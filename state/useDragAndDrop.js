import {
    onBeforeUnmount,
    reactive,
    computed,
    readonly} from '../vue.esm-browser.js'

import {documentElements} from '../state/useDocumentElements.js' 
// there should be a function "move elements by that takes a by and an array of elementIds

import {_getElementPositionOnCanvas} from '../state/documentElementsHelpers.js';

import {
    contentSelection
} from './useSelectedElements.js'

// this is the element that moves
const draggedProxies   = reactive([]);
const draggedProxiesReadonly = readonly(draggedProxies);

// this is are the original element. It is NOT moved (cause the proxy is)
const draggedElements = reactive([]);
const draggedElementsReadonly = readonly(draggedElements);


/**
 * This function returns the proxy, if there is one, 
 * otherwise the selected element
 * otherwise null (if there is no selected element)
 */
const contentSelectionProxy = computed(function(){
    if(draggedProxies.length>0){
        return draggedProxies;
    } else{ 
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
            'id':elementToDrag.id+"p",
            'originalId': elementToDrag.id
        }

    return proxyForDrag;
}


/**
 * Setup for the drag proxy
 * 
 * @param {*} elementToDrag 
 */
const createProxy = function(elementToDrag){ //set elementToDrag explicitly for now. 
    draggedProxies.push(generateProxyElement(elementToDrag,documentElements));
    draggedElements.push(contentSelection[0]);
};

/**
 * Does teardown of the drag proxy
 */
const removeProxy = function(){
    draggedProxies.splice(0,draggedProxies.length); //remove all elements
    draggedElements.splice(0, draggedElements.length);
};


function moveProxyBy(pos_diff) {
    draggedProxies[0].pos_x += pos_diff.pos_x_diff,
    draggedProxies[0].pos_y += pos_diff.pos_y_diff
}

function useDragAndDrop(){
    window.addEventListener('mouseup', removeProxy);

    onBeforeUnmount(() => {
        window.removeEventListener('mouseup', removeProxy);
    })
    return{
        draggedProxies:draggedProxiesReadonly,
        contentSelectionProxy
    }
}
    
export { 
    useDragAndDrop,
    moveProxyBy, 
    removeProxy, 
    createProxy, 
    contentSelectionProxy,
    draggedElementsReadonly as draggedElements, 
    draggedProxiesReadonly as draggedProxies
}