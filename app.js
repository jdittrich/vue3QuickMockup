import documentElement from './documentElement.js   '
import documentElementResizers from './documentElementResizers.js'
import useDocumentElements from './useDocumentElements.js'
import { ref, reactive, computed } from './vue.esm-browser.js'

export default {
    name:'app',
    components:{
        'document-element':documentElement,
        'document-element-resizer': documentElementResizers
    },
    setup(props, context){
        const { documentElements, moveElementBy } = useDocumentElements();

        
        const resizerIsVisible = computed(
            ()=> selectedElement !== null
        );

        const isDragging = ref(false);

        const pos_mousedown = reactive({
            clientpos_x: null,
            clientpos_y: null    
        })

        
        
        const selectedElement = reactive({});
        
        return {
            documentElements, 
            moveElementBy,
            resizerIsVisible,
            isDragging,

            pos_mousedown
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
            this.pos_mousedown={
                clientpos_x : event.clientX,
                clientpos_y : event.clientY
            }
            this.isdragging = true; 
        },
        mousemove(event){
            if(this.isdragging){
                const pos_x_diff = event.movementX;
                const pos_y_diff = event.movementY;

                this.moveElementBy(this.selectedElement, { pos_x_diff, pos_y_diff})
            }
        },
        mouseup(event){
            this.isdragging = false; 
        },
        setMousedownHandler(event,rectSpec){
            this.selectedElement = rectSpec.id;
        }
    },
    template:`
    <div style='width:95%; height:95%; background-color:#ABC; position:absolute;'

        v-on:mousedown="mousedown"
        v-on:mousemove.left="mousemove"
        v-on:mouseup = "mouseup"
        >
        
        <document-element 
            v-for="documentElement in documentElements" 
            :rectSpec="documentElement"
            :key="documentElement.id"
            @mousedown-on-document-element="setMousedownHandler"
        ></document-element>
        
        <div v-if="resizerIsVisible">
            <document-element-resizer v-for="resizer in resizers"
                :posSpec="resizer.pos"
                :key="resizer.id"
                ></document-element-resizer>
        </div>
    </div>
    `
}