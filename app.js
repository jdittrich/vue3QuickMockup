import documentElement from './documentElement.js   '
import { ref, reactive } from './vue.esm-browser.js'

function useDocumentElements(){
    let documentElements = reactive([
        {
            width: 100,
            height: 130,
            pos_x: 10,
            pos_y: 20,
            id: 1
        },
        {
            width: 30,
            height: 40,
            pos_x: 200,
            pos_y: 30,
            id: 2
        },
        {
            width: 140,
            height: 50,
            pos_x: 200,
            pos_y: 40,
            id: 3
        }
    ]);
    
    function getDocumentElementById(id){
        const elementToGet = documentElements.find(element => element.id === id)
        return elementToGet;
    };

    //function to move elements
    //function to end move
    function moveElementBy(id,pos_diff){
        const {pos_x_diff, pos_y_diff} = pos_diff;
        const elementToMove = getDocumentElementById(id);
        elementToMove.pos_x += pos_x_diff;
        elementToMove.pos_y += pos_y_diff;
    }

    return {
        documentElements,
        moveElementBy
    }
}

export default {
    name:'app',
    components:{
        'document-element':documentElement
    },
    setup(props){
        const {documentElements, moveElementBy} = useDocumentElements();
        return {documentElements, moveElementBy}
    },
    data:function(){
        return {
            canvas:{
                pos_x:0,
                pos_y:0,
                width:1000, 
                height:1000
            },
            dragInProgress:false,
            pos_mousedown:{
                clientpos_x:null,
                clientpos_y:null
            },
            isdragging:false,
            selectedElement:null
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
        setMousedown(event,rectSpec){
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
            @mousedown-on-document-element="setMousedown"
        ></document-element>
    </div>
    `
}