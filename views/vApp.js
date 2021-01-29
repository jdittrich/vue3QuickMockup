import {computed} from '../vue.esm-browser.js'

import documentElement from '../components/vDocumentElement.js'
import documentElementResizers from '../components/vDocumentElementResizers.js'

import {documentElements,
        getRootNode,
        getElementChildren} from '../state/useDocumentElements.js';

import { clearContentSelection} from '../state/useSelectedElements.js'
import { useDragAndDrop } from '../state/useDragAndDrop.js'




import {pointerEventProxy, unsetPointerEventStrategy} from '../strategies/pointerEventProxy.js'



export default {
    name:'app',
    components:{
        'document-element':documentElement,
        'document-element-resizers': documentElementResizers
    },
    setup(props, context){  
        
        const {draggedProxies, contentSelectionProxy} = useDragAndDrop();
        
        
        const childElements = computed(function(){
            const rootNode = getRootNode();
            const children = getElementChildren(rootNode);
            return children;
        });

        return {
            draggedProxies,
            contentSelectionProxy,
            documentElements, 
            // copiesToDrag,
            // elementsToHide,
            // selectedElementId,
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
                clearContentSelection();
                unsetPointerEventStrategy();
            }
            //pointerEventProxy.down(event);          
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
        Selected: {{contentSelectionProxy[0]}}

        <div style="position:absolute; width:0; height:0; top:0; left:0">
            <document-element
                v-for="documentElement in childElements"
                :rectSpec="documentElement"
                :key="documentElement.id"
            ></document-element>
        </div>
        <div style="position:absolute; width:0; height:0; top:0; left:0; pointer-events:none">
            <document-element  
                v-if="draggedProxies[0]"
                :rectSpec="draggedProxies[0]"
                :key="draggedProxies[0].id"
                :isProxy="true"
            ></document-element>
        </div>
        <div style="position:absolute; width:0; height:0; top:0; left:0">
            <document-element-resizers v-if="contentSelectionProxy" :selectedElement="contentSelectionProxy"></document-element-resizers>
        </div>
    </div>
    `
}   