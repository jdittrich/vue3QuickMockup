import { setPointerEventStrategy } from './pointerEventProxy.js'
import { elementDragStrategy } from './elementDragStrategy.js'
import  { setSelectedElementId, getElementChildren }  from './useDocumentElements.js'

/*
A document Element. Despite being meant to represent the content that users manipulate it is currently
very much empty and only represented by a rectangle. It can be dragged and resized, but all that functionality  
resides not within it. It only sets the drag strategy if a mousedown happens in it. 
*/

export default {
    name:'document-element',
    props:{
        rectSpec: Object
    },
    emits: [
        'mousedown-on-document-element' //I think this can be deleted
    ],
    computed:{
        styleObject:function(){
            return{
                'height':this.rectSpec.height+'px',
                'width':this.rectSpec.width+'px',
                'top':this.rectSpec.pos_y+'px',
                'left':this.rectSpec.pos_x+'px',
                'position':'absolute',
                'outline':'1px solid green',
                'background':'rgba(100,140,180,0.5)'
            }
        }, 
        childElements:function(){
            //or passing child Id array
            return getElementChildren(this.rectSpec.id) //gets children of elemenet with that id
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
                v-for="documentElement in childElements" 
                :rectSpec = "documentElement"
                :key="documentElement.id">
            </document-element> 
        </div>
    </div>
    `
}