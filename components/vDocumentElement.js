import { setPointerEventStrategy, pointerEventProxy } from '../strategies/pointerEventProxy.js'
import { elementDragStrategy } from '../strategies/elementDragStrategy.js'
import { draggedElements} from '../state/useDragAndDrop.js'
import { getElementChildren }  from '../state/useDocumentElements.js'
import { setContentSelection} from '../state/useSelectedElements.js'


/*
A document Element. Despite being meant to represent the content that users manipulate it is currently
very much empty and only represented by a rectangle. It can be dragged and resized, but all that functionality  
resides not within it. It only sets the drag strategy if a mousedown happens in it. 
*/



export default {
    name:'document-element',
    props:{
        rectSpec: Object,
        isProxy:Boolean
    },
    computed:{
        shouldHide:function(){
            let hidden = false
            if(draggedElements[0]){
                hidden = this.rectSpec.id === draggedElements[0].id && this.isProxy === false;
            }
            return hidden;
        },
        styleObject:function(){
            return{
                'display': (this.shouldHide) ? "none": "block",
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
            return getElementChildren(this.rectSpec) //gets children of element with that id
        }
    },
    methods:{
        onmousedown: function (evt) { //TODO: useDragdrop
            setContentSelection(this.rectSpec)
            setPointerEventStrategy(elementDragStrategy);
            pointerEventProxy.down(evt,this.rectSpec);
        },
        onmouseup: function (evt) { //TODO: useDragdrop
            console.log("dropped on ", this.rectSpec.id) //not working yet
        }
    },
    template:`
    <div :style="styleObject" @mousedown.self="onmousedown">
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