import documentElement from './vDocumentElement.js'
import documentElementResizers from './vDocumentElementResizers.js'
import useDocumentElements from './useDocumentElements.js'

import {pointerEventProxy, unsetPointerEventStrategy} from './pointerEventProxy.js'

export default {
    name:'app',
    components:{
        'document-element':documentElement,
        'document-element-resizers': documentElementResizers
    },
    setup(props, context){
        const { documentElements, setSelectedElementId, unsetSelectedElementId, selectedElementId, selectedElement  } = useDocumentElements();
        
        return {
            documentElements, 
            setSelectedElementId,
            unsetSelectedElementId,
            selectedElementId,
            selectedElement
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
                this.unsetSelectedElementId();
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
    template:`
    <div style='width:95%; height:95%; background-color:#ABC; position:absolute;'

        v-on:mousedown="mousedown"
        v-on:mousemove.left="mousemove"
        v-on:mouseup = "mouseup"
        >
        Selected: {{selectedElementId}}

      
        <document-element 
            v-for="documentElement in documentElements.children" 
            :rectSpec="documentElement"
            :key="documentElement.id"
        ></document-element>
        
        <document-element-resizers v-if="selectedElement" :selectedElement="selectedElement"></document-element-resizers>

    </div>
    `
}