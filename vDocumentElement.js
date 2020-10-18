import { setPointerEventStrategy } from './pointerEventProxy.js'
import { elementDragStrategy } from './elementDragStrategy.js'
import useDocumentElements from './useDocumentElements.js'

const {setSelectedElementId} = useDocumentElements()

/*
A document Element. Despite being meant to represent the content that users manipulate it is currently
very much empty and only represented by a rectangle. It can be dragged and resized, but all that 
resides not within it. It only sets the drag strategy if a mousedown happens in it. 
*/

export default {
    name:'document-element',
    props:{
        rectSpec: Object
    },
    emits: [
        'mousedown-on-document-element'
    ],
    computed:{
        styleObject:function(){
            return{
                'height':this.rectSpec.height+'px',
                'width':this.rectSpec.width+'px',
                'top':this.rectSpec.pos_y+'px',
                'left':this.rectSpec.pos_x+'px',
                'position':'absolute',
                'outline':'1px solid green'
            }
        }
    },
    methods:{
        onmousedown:function(evt){
            setSelectedElementId(this.rectSpec.id)
            setPointerEventStrategy(elementDragStrategy)  
        }
    },
    template:`
    <div :style="styleObject" @mousedown.self="onmousedown">
    {{rectSpec.id}}
        <div class="documentElementChildrenContainer">
            <document-element 
                v-for="documentElement in rectSpec.children" 
                :rectSpec = "documentElement"
                :key="documentElement.id">
            </document-element> 
        </div>
    </div>
    `
}