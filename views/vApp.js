import {computed} from '../vue.esm-browser.js'

import documentElement from '../components/vDocumentElement.js'
import documentElementResizers from '../components/vDocumentElementResizers.js'

import {documentElements,
        copiesToDrag,
        elementsToHide,
        selectedElementId,
        unsetSelectedElementId,
        getRootNode,
        getElementChildren} from '../state/useDocumentElements.js'

import {pointerEventProxy, unsetPointerEventStrategy} from '../strategies/pointerEventProxy.js'



export default {
    name:'app',
    components:{
        'document-element':documentElement,
        'document-element-resizers': documentElementResizers
    },
    setup(props, context){  
        const childElements = computed(function(){
            const rootNode = getRootNode();
            const children = getElementChildren(rootNode.id);
            return children;
        })
        return {
            documentElements, 
            copiesToDrag,
            elementsToHide,
            selectedElementId,
            childElements
        }
    },
    data: function(){
        return {
            canvas:{
                pos_x:0,
                pos_y:0,
                width:1000, 
                height:1000
            }
        };   
    },
    methods:{
        mousedown(event){
            if(event.target === this.$el){ //click on background. Should probably be outsourced to a separate background element and its reactions
                unsetSelectedElementId();
                unsetPointerEventStrategy();
            }
            pointerEventProxy.down(event);          
        },
        mousemove(event){
            pointerEventProxy.move(event);
        },
        mouseup(event){
            pointerEventProxy.up(event)
        }, 
    },
    //TODO: Move this to "canvas", encapsulate the "layers" in their own divs. 
    template:`
    <div style='width:95%; height:95%; background-color:#ABC; position:absolute;'

        v-on:mousedown="mousedown"
        v-on:mousemove.left="mousemove"
        v-on:mouseup = "mouseup"
        >
        Selected: {{selectedElementId}}

        <div style="position:absolute; width:0; height:0; top:0; left:0">
            <document-element
                v-for="documentElement in childElements"
                :rectSpec="documentElement"
                :key="documentElement.id"
            ></document-element>
        </div>
        <div style="position:absolute; width:0; height:0; top:0; left:0; pointer-events:none">
            <document-element 
                v-for="documentElement in copiesToDrag" 
                :rectSpec="documentElement"
                :key="documentElement.id"
            ></document-element>
        </div>
        <div style="position:absolute; width:0; height:0; top:0; left:0">
            <document-element-resizers v-if="selectedElementId" :selectedElementId="selectedElementId"></document-element-resizers>
        </div>
    </div>
    `
}