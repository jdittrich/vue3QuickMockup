import {reactive, ref, computed, watch} from './vue.esm-browser.js'

let documentElements = reactive([
    {
        width: 100,
        height: 130,
        pos_x: 10,
        pos_y: 20,
        id: "1"
    },
    {
        width: 30,
        height: 40,
        pos_x: 200,
        pos_y: 30,
        id: "2"
    },
    {
        width: 140,
        height: 50,
        pos_x: 200,
        pos_y: 40,
        id: "3"
    }
]);

const selectedElementId = ref("null");

function useDocumentElements() {
    // HELPERS
    function getDocumentElementById(id) {
        const elementToGet = documentElements.find(element => element.id === id)
        return elementToGet;
    };

    //MOVE ELEMENTS
    function moveSelectedElementBy(pos_diff){

        const selectedId = selectedElementId.value;
        moveElementBy(selectedId, pos_diff);        
    }

    function moveElementBy(id, pos_diff) {
        const { pos_x_diff, pos_y_diff } = pos_diff;
        const elementToMove = getDocumentElementById(id);
        elementToMove.pos_x += pos_x_diff;
        elementToMove.pos_y += pos_y_diff;
    }

    //RESIZE ELEMENTS
    function resizeSelectedElementBy(pos_diff,sides){
        const selectedId = selectedElementId.value;
        resizeElementBy(selectedId, pos_diff,sides);     
    }
    
    function resizeElementBy(id,pos_diff,sides){     
        const { pos_x_diff, pos_y_diff } = pos_diff;
        const elementToResize = getDocumentElementById(id);

        //if top is selected
        if(sides.top===true){
            //change top position
            elementToResize.pos_y += pos_y_diff;
            //change height inverse proportionally, so that bottom does not move
            elementToResize.height -= pos_y_diff;
        }
    
       //if right is selected
        if(sides.right === true){
            //change width proportially
            elementToResize.width += pos_x_diff; 
       }
       
       //if bottom is selected
       if(sides.bottom === true){
            // change height proportially
           elementToResize.height += pos_y_diff
       }
    
    
       //if left is selected
       if(sides.left === true){
           //change left position proportionally
           elementToResize.pos_x += pos_x_diff;
           
           //change width inverse proportially so that the right does not move. 
           element.width -= pos_x_diff;
       }
    }



    function setSelectedElementId(newSelectedElementId){
        selectedElementId.value = newSelectedElementId;    
    }

    const selectedElement = computed(()=>getDocumentElementById(selectedElementId.value));
    // A note on learning: This only got "activated" aka seen-as-computed when I used .value
    // I tried quite some other things like using watch instead or tried to track the value 
    // using this.selectedElement in the template etc. But .value it was.
    /*watch(
        selectedElementId,(newId,oldId) => {
            console.log("ids",newId,oldId); 
            getDocumentElementById(selectedElementId)
        });
    */

    return {
        documentElements,
        setSelectedElementId,
        selectedElementId,
        selectedElement,
        moveSelectedElementBy,
        resizeSelectedElementBy
    }
}

export default useDocumentElements