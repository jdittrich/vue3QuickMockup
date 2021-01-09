import {
    onBeforeUnmount,
    computed,
    ref,
    readonly} from '../vue.esm-browser.js'

import {documentElements} from '../state/useDocumentElements.js' 
// there should be a function "move elements by that takes a by and an array of elementIds

import {_getElementPositionOnCanvas} from '../state/documentElementsHelpers.js';

import {
    useContentSelection
} from './useSelectedElements.js'

const {contentSelection} = useContentSelection();

// this is the element that moves
let draggedProxy   = ref(null);

// this is the element that is NOT moved (cause the proxy is)
let draggedElement = ref(null); 

/**
 * This function returns the proxy, if there is one, 
 * otherwise the selected element
 * otherwise null (if there is no selected element)
 */
let contentSelectionProxy = computed(function(){
    if(draggedProxy){
        return draggedProxy;
    } else { //needs no extra branch, if no selection content selection is ref(null)
        return contentSelection
    }
})

/** 
 * @param {object} elementToDrag 
 * @param {array} documentElements 
 */
function generateProxyElement(elementToDrag,documentElements) {
    const {
        pos_x,
        pos_y
    } = _getElementPositionOnCanvas(elementToDrag, documentElements)

    const proxyForDrag = {
            'pos_x': pos_x,
            'pos_y': pos_y,
            'width': elementToDrag.width,
            'height': elementToDrag.height,
            'children': elementToDrag.children, //which is not a copy, but a reference!
            'id':elementToDrag.id
        }

    return proxyForDrag;
}

/**
 * @return {object}
 * @return {object} dragProxy - the proxy copy of the element current being dragged
 * @return {object} dragElement - the element currently being dragged  
 * @return {boolean} isDragging - is there a drag in progress? 
 * @return {function} createProxy - the function to call to start a drag of the selected element
 * @return {function} removeProxy - the function to end a drag of the selected element 
 */
export const useDragAndDrop = function (){
    /**
     * Setup for the drag proxy
     * 
     * @param {*} elementToDrag 
     */
    const createProxy = function(elementToDrag){ //set elementToDrag explicitly for now. 
        draggedProxy.value   = generateProxyElement(elementToDrag,documentElements);
        draggedElement.value = contentSelection;
    };

    /**
     * Does teardown of the drag proxy
     */
    const removeProxy = function(){
        draggedProxy.value   = null;
        draggedElement.value = null;
    };
    
    function moveProxyBy(pos_diff) {
        draggedProxy.value.pos_x = draggedProxy.value.pos_x + pos_diff.pos_x_diff,
        draggedProxy.value.pos_y = draggedProxy.value.pos_y + pos_diff.pos_y_diff
    }

    window.addEventListener('mouseup', removeProxy);
    
    onBeforeUnmount(() => {
        window.removeEventListener('mouseup', removeProxy);
    })
    
    // should probably return also something to manipulate the content of the selection.
    return {
        draggedProxy: readonly(draggedProxy),
        draggedElement: readonly(draggedElement),
        contentSelectionProxy,
        createProxy,
        removeProxy,
        moveProxyBy
    }
}