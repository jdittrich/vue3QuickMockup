import {reactive, ref, computed, watch} from './vue.esm-browser.js'
import {_getElementById, 
        _getElementPositionOnCanvas, 
        _getElementsPointIsIn,
        _getParentChain,
        _getElementChildren,
        _getParentOf} from './documentElementsHelpers.js'
import documentElementData from './documentElementData.js'

let documentElements = reactive(documentElementData);

const selectedElementId = ref(null);


function useDocumentElements() {
    const selectedElement = computed(() => {
        if (!selectedElementId.value) { return null }

        const selectedElementData = _getElementById(documentElements, selectedElementId.value);

        return selectedElementData;
        // I guess this might be a bad Idea until I have sorted out how to reliable get the absolute position
        // const absolutePosition = _getElementPositionOnCanvas(documentElements, selectedElementId.value);
        //return Object.assign({},selectedElementData,absolutePosition);
    });

    //-------------------
    // ACTIONS 
    //-------------------
    function setSelectedElementId(newSelectedElementId) {
        selectedElementId.value = newSelectedElementId;
    }

    function unsetSelectedElementId() {
        selectedElementId.value = null
    }

    function moveSelectedElementBy(pos_diff){
        const selectedId = selectedElementId.value;
        moveElementBy(selectedId, pos_diff);        
    }

    function moveElementBy(id, pos_diff) {
        const { pos_x_diff, pos_y_diff } = pos_diff;
        const elementToMove = _getElementById(id,documentElements);
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
        const elementToResize = _getElementById(id,documentElements);

        // sides defined with of the sides of a rectangle would be affected. 
        // If a corner handle is grabbed, this would be two sides that are affected
        // since I take the top left corner as reference point (just like CSS)
        // when resizing e.g. the left side, we need to change position if dealing with top and left sides
        if(sides.top===true){
            elementToResize.pos_y += pos_y_diff;
            //change height inverse proportionally, so that bottom does not move
            elementToResize.height -= pos_y_diff;
        }
    
        if(sides.right === true){
            elementToResize.width += pos_x_diff; 
       }
       
       if(sides.bottom === true){
           elementToResize.height += pos_y_diff
       }
       
       if(sides.left === true){
           elementToResize.pos_x += pos_x_diff;
           //change width inverse proportionally so that the right does not move. 
           elementToResize.width -= pos_x_diff;
       }
    }

    /**
    * Take a point in qm-document coordinates. 
    * Assumes the selected element to be dropped at point. 
    * Reattaches selected element 
    * to new parent element if dropped on top of that (to-be parent) element
    * removes from old element. 
    * 
    * @param {object} point - the point in document coordinates where the element was dropped
    * @param {number} point.pos_x - the x coordinate of the point
    * @param {number} point.pos_y - the y coordinate of the point
    */
    function dropElement(point){
        // TODO this is soooo messy. 
        // convert to qm-document coordinates
        
        //not sure if I get these from shared state or injection?
        const dropTargets = _getElementPointIsIn(documentElements,point)
        const dropTarget = dropTargets[dropTargets.length-1]; // the last element obviously being the element itself
        const dropped = _getElementById(documentElements,selectedElementId);

        //create needed variables
        const droppedParent = _getParentOf(selectedElementId.value, documentElements);

        
        const dropTarget_absPos = _getElementPositionOnCanvas(documentElements,dropTarget.id);
        const dropped_absPos = _getElementPositionOnCanvas(documentElements,dropped.id)

        //what is their difference?
        const droppedTarget_diffPos = {
            pos_x: dropped_absPos.pos_x - dropTarget_absPos.pos_x,
            pos_y: dropped_absPos.pos_y - dropTarget_absPos.pos_y
        }

        //remove from current Parent attach to new parent
        const droppedIndexOld = droppedParent.children.indexOf(dropped); //for later use in .splice()
        
        const storeElement = droppedParent.children.splice(1, droppedIndexOld)[0]
        
        dropTarget.children.push(storeElement);
    }

    // ---------------
    // Getters -------
    // ---------------
    function getElementChildren(elementId){
        _getElementChildren(elementId);
    }

    return {
        //↓data
        documentElements,
        selectedElementId,
        selectedElement,
        //↓getters
        getElementChildren,
        //↓actions
        setSelectedElementId,
        unsetSelectedElementId,
        moveSelectedElementBy,
        resizeSelectedElementBy,
        dropElement,
    }
}

export default useDocumentElements