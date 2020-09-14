import documentElement from './documentElement.js'
import documentElementResizers from './documentElementResizers.js'
import useDocumentElements from './useDocumentElements.js'
//import { ref, reactive, computed } from './vue.esm-browser.js'
import {mouseEventProxy, setMouseEventStrategy} from './mouseEventProxy.js'
import {mousemoveDragStrategy} from './elementDragStrategy.js'

export default {
    name:'app',
    components:{
        'document-element':documentElement,
        'document-element-resizers': documentElementResizers
    },
    setup(props, context){
        const { documentElements, setSelectedElementId, selectedElementId, selectedElement  } = useDocumentElements();
        
        return {
            documentElements, 
            setSelectedElementId,
            selectedElementId,
            selectedElement
        }
    },
    data:function(){
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
            mouseEventProxy.mousedown(event);
        },
        mousemove(event){
            mouseEventProxy.mousemove(event);
        },
        mouseup(event){
            mouseEventProxy.mouseup(event)
        },
        setMousedownHandler(event,rectSpec){
            this.setSelectedElementId(rectSpec.id);
            
            setMouseEventStrategy({
                mousedown: function () { },
                mousemove: mousemoveDragStrategy,
                mouseup: function () { }
            })
        }
    },
    template:`
    <div style='width:95%; height:95%; background-color:#ABC; position:absolute;'

        v-on:mousedown="mousedown"
        v-on:mousemove.left="mousemove"
        v-on:mouseup = "mouseup"
        >
        Selected: {{selectedElementId}}

      
        <document-element 
            v-for="documentElement in documentElements" 
            :rectSpec="documentElement"
            :key="documentElement.id"
            @mousedown-on-document-element="setMousedownHandler"
        ></document-element>
        
        <document-element-resizers v-if="selectedElement" :selectedElement="selectedElement"></document-element-resizers>

    </div>
    `
}