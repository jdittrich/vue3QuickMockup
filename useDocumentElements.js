import {reactive, ref, computed, watch} from './vue.esm-browser.js'
import {_getDocumentElementById,_getElementPositionOnCanvas} from './documentElementsHelpers.js'
import documentElementData from './documentElementData.js'
// should I keep it array or better have a root node? Probably a root node. I can leave the root note pretty much empty. 
// when I use it as canvas, I can add stuff like zoom and width and whatnot somewhere else; the <qm-canvas> or whatever does only
// need to access child objects (in HTML the root node is the same as the .document)
let documentElements = reactive(documentElementData);

const selectedElementId = ref(null);


function useDocumentElements() {
    //MOVE ELEMENTS
    function moveSelectedElementBy(pos_diff){

        const selectedId = selectedElementId.value;
        moveElementBy(selectedId, pos_diff);        
    }

    function moveElementBy(id, pos_diff) {
        const { pos_x_diff, pos_y_diff } = pos_diff;
        const elementToMove = _getDocumentElementById(documentElements,id);
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
        const elementToResize = _getDocumentElementById(documentElements,id);

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
           elementToResize.width -= pos_x_diff;
       }
    }



    function setSelectedElementId(newSelectedElementId){
        selectedElementId.value = newSelectedElementId;    
    }

    function unsetSelectedElementId(){
        selectedElementId.value = null
    }

    const selectedElement = computed(()=>{
        if(!selectedElementId.value){return null}

        const selectedElementData = _getDocumentElementById(documentElements, selectedElementId.value);
        const absolutePosition = _getElementPositionOnCanvas(documentElements, selectedElementId.value);
        return Object.assign({},selectedElementData,absolutePosition);
    });
    // A note on learning: This only got "activated" aka seen-as-computed when I used .value
    // I tried quite some other things like using watch instead or tried to track the value 
    // using this.selectedElement in the template etc. But .value it was.
    /*watch(
        selectedElementId,(newId,oldId) => {
            console.log("ids",newId,oldId); 
            _getDocumentElementById(selectedElementId)
        });
    */

    return {
        documentElements,
        setSelectedElementId,
        unsetSelectedElementId,
        selectedElementId,
        selectedElement,
        moveSelectedElementBy,
        resizeSelectedElementBy
    }
}

export default useDocumentElements