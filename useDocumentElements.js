import {reactive, ref, computed, watch} from './vue.esm-browser.js'
import {_getDocumentElementById,_getElementPositionOnCanvas} from './documentElementsHelpers.js'
import documentElementData from './documentElementData.js'

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

    /**
    * Take a point in html-document coordinates. 
    * Assumes the selected element to be dropped at point. 
    * Reattaches selected element 
    * to new parent element if dropped on top of that (to-be parent) element
    * removes from old element. 
    * 
    * @param {object} point - the point in document coordinates
    * @param {number} point.pos_x - the x coordinate of the point
    * @param {number} point.pos_y - the y coordinate of the point
    */
    function dropElement(point){
        // convert to qm-document coordiantes

        //attach to new parent?
        //no: 
        //just move

        //yes: 
        // act on data

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