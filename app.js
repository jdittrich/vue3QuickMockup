import documentElement from './documentElement.js'
import documentElementResizers from './documentElementResizers.js'
import useDocumentElements from './useDocumentElements.js'
//import { ref, reactive, computed } from './vue.esm-browser.js'
import { pointerEventProxy} from './pointerEventProxy.js'

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
            pointerEventProxy.down(event);
        },
        mousemove(event){
            pointerEventProxy.move(event);
        },
        mouseup(event){
            pointerEventProxy.up(event)
        },
        // setPointerEventHandlers(event,rectSpec){
        
        //     this.setSelectedElementId(rectSpec.id);
            
        //    // setPointerEventStrategy(dragStrategy)//what about setting additional arguments beyond the event here?
        // }   
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
        ></document-element>
        
        <document-element-resizers v-if="selectedElement" :selectedElement="selectedElement"></document-element-resizers>

    </div>
    `
}