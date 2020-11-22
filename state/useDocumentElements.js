import {
    reactive,
    ref,
    computed,
    unref,
    toRaw
} from '../vue.esm-browser.js'
import {
    _getElementById,
    _getElementPositionOnCanvas,
    _getElementsPointIsIn,
    _getElementPointIsIn,
    _getParentChain,
    _getElementChildren,
    _getParentOf
} from './documentElementsHelpers.js'

import documentElementData from '../tests/documentElementData.js'


// STATE
const documentElements  = reactive(documentElementData);

const selectedElementId = ref(null);

const copiesToDrag      = reactive([]); //TODO rename to "elementsInDrag"

const elementsToHide    = computed(function(){
    return copiesToDrag.map(element=>element.id)
}); 

//SETTERS
function setSelectedElementId(newSelectedElementId) {
    selectedElementId.value = newSelectedElementId;
}

function unsetSelectedElementId() {
    selectedElementId.value = null
}



//MANIPULATION
function moveSelectedElementBy(pos_diff) {
    const selectedId = selectedElementId.value;
    moveElementBy(selectedId, pos_diff);
}

function moveElementBy(id, pos_diff) {
    const {
        pos_x_diff,
        pos_y_diff
    } = pos_diff;
    const elementToMove = _getElementById(id, documentElements);
    elementToMove.pos_x += pos_x_diff;
    elementToMove.pos_y += pos_y_diff;
}

//RESIZE ELEMENTS
function resizeSelectedElementBy(pos_diff, sides) {
    const selectedId = selectedElementId.value;
    resizeElementBy(selectedId, pos_diff, sides);
}

function resizeElementBy(id, pos_diff, sides) {
    const {
        pos_x_diff,
        pos_y_diff
    } = pos_diff;
    const elementToResize = _getElementById(id, documentElements);

    // sides defined with of the sides of a rectangle would be affected. 
    // If a corner handle is grabbed, this would be two sides that are affected
    // since I take the top left corner as reference point (just like CSS)
    // when resizing e.g. the left side, we need to change position if dealing with top and left sides
    if (sides.top === true) {
        elementToResize.pos_y += pos_y_diff;
        //change height inverse proportionally, so that bottom does not move
        elementToResize.height -= pos_y_diff;
    }

    if (sides.right === true) {
        elementToResize.width += pos_x_diff;
    }

    if (sides.bottom === true) {
        elementToResize.height += pos_y_diff
    }

    if (sides.left === true) {
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
function dropElement(point) {


    // moveToNewParent(toMove,Parent,Offset);
    //Problem: The current state includes the dragged element. The point under the mouse cursor 
    // and the dimensions of the dragged element are in... the dragged element itself!
    // this messes all up. So there needs to be some way to represent state. 
    // We can't just filter out the dragged element, since this creates a bit of a messy state
    // as there are references to an element we filtered out. 
    // we could:
    // remove or disable the dragged Element and push a copy it to an in-between-state.


    // TODO this is soooo messy. 
    const dropTarget = _getElementPointIsIn(documentElements, point);


    const dropped = _getElementById(selectedElementId, documentElements);

    //create needed variables
    const droppedParent = _getParentOf(selectedElementId.value, documentElements);


    const dropTarget_absPos = _getElementPositionOnCanvas(dropTarget.id, documentElements);
    const dropped_absPos = _getElementPositionOnCanvas(dropped.id, documentElements)

    //what is their difference?
    const droppedTarget_diffPos = {
        pos_x: dropped_absPos.pos_x - dropTarget_absPos.pos_x,
        pos_y: dropped_absPos.pos_y - dropTarget_absPos.pos_y
    }

    //remove from current Parent attach to new parent
    const droppedIndexOld = droppedParent.children.indexOf(dropped.id); //for later use in .splice()

    const storeElement = droppedParent.children.splice(1, droppedIndexOld)[0]

    dropTarget.children.push(storeElement);
}

// ---------------
// Getters -------
// ---------------
function getElementById(elementId) {
    const element = _getElementById(elementId, documentElements);
    return element;
}

function getElementChildren(elementId) {
    const elementChildren = _getElementChildren(elementId, documentElements);
    return elementChildren;
}

function getRootNode() {
    const rootNode = _getElementById("documentElementsRootNode", documentElements);
    return rootNode;
}

function getAbsolutePosition(elementId) {
    const absolutePosition = _getElementPositionOnCanvas(elementId, documentElements);
    return absolutePosition;
}




const selectedElement = computed(() => {
    if (!selectedElementId.value) {
        return null
    }

    const selectedElementData = _getElementById(selectedElementId.value, documentElements);
    //const absolutePosition = _getElementPositionOnCanvas(documentElements, selectedElementId.value);

    return selectedElementData;

    //return Object.assign({},selectedElementData,{pos_asb});
});


// ---------
// ACTIONS PROXIED
// --------
// watch selectedElementId, when that changes, call this thing:
function setDragCopy() {
    //copy to drag copies
    const selectedElement = _getElementById(selectedElementId, documentElements);
    const {
        pos_x,
        pos_y
    } = _getElementPositionOnCanvas(selectedElementId, documentElements)
    copiesToDrag.push(
        reactive({
            'pos_x': pos_x,
            'pos_y': pos_y,
            'width': selectedElement.width,
            'height': selectedElement.height,
            'children': selectedElement.children, //which is not a copy, but a reference!
            'id':selectedElement.id
        })
    );
}

function unsetDragCopies(){
    copiesToDrag.splice(0, copiesToDrag.length);
}

function dragElementBy(pos_diff) {
    copiesToDrag.forEach(element => {
        element.pos_x = element.pos_x + pos_diff.pos_x_diff,
        element.pos_y = element.pos_y + pos_diff.pos_y_diff
    });
}

function startDragElement(){
    setDragCopy();
}
function endDragElement() {
    unsetDragCopies();
}





export {
    //↓data
    documentElements,
    selectedElementId,
    selectedElement,
    copiesToDrag,
    elementsToHide,
    //↓getters
    getElementById,
    getElementChildren,
    getAbsolutePosition,
    getRootNode,
    //↓actions
    startDragElement,
    dragElementBy,
    endDragElement,
    setSelectedElementId,
    unsetSelectedElementId,
    moveSelectedElementBy,
    resizeSelectedElementBy,
    dropElement,

}