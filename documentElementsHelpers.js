import {treeReduce,treeReduceContext,treeMap,treeFind} from './lib/treeFunctions.js'
import { unref,readonly } from './vue.esm-browser.js'


/**
 * The TreeNode Object can have an array of children with other tree node objects. It often also comes with an id.
 * I will also refer to the qmDocument tree – which is just the root treeNode, containing all the other elements
 * @typedef treeNode
 * @type {object}
 * @property {array} [children] - array of treeNodes
 */


/**
 * 
 * @param {string} idToSearchFor 
 * @param {treeNode} treeNode
 * @returns {object} parent
 */
function _getParentOf(idToSearchFor, treeNode){
    const idToSearchFor = unref(idToSearchFor);
    
    const parent = flattened.find(element => element.children.includes(idToSearchFor));
    
    //since the flattened array returns new objects, the the proxy ones, we need to find the "real" (reactive) parent again

    return parent; 
};

/** returns the elements which contain the point
* @param {object} documentElements  - the  qmDocument tree
* @param {object} point - the point in qmDocument coordinates
* @param {number} point.pos_x - the x coordinate of the point
* @param {number} point.pos_y - the y coordinate of the point
* @returns {array} the elements which contain the point
*/
function _getElementsPointIsIn(documentElements,point){
    //let currentOffset = {pos_x: 0, pos_y:0}
    
    let rootElement = _getDocumentElementById("documentElementsRootNode");
    let elementsPointIsIn = [];
    let offset = {
        pos_x: 0,
        pos_y: 0
    }
    
    let containingElement = rootElement;

    while(containingElement){
        elementsPointIsIn.push(containingElement);
        offset = {
            pos_x: offset.pos_x + (containingElement.pos_x || 0),
            pos_y: offset.pos_y + (containingElement.pos_y || 0)
        }

        let newContainingElement = containingElement.children
            .find(function(childId){
                let elementToCheck = _getDocumentElementById(childId);
                const objectDimensionsWithOffset = {
                    width: (elementToCheck.width || Number.POSITIVE_INFINITY),
                    height: (elementToCheck.height || Number.POSITIVE_INFINITY),
                    pos_x: offset.pos_x + elementToCheck.pos_x,
                    pos_y: offset.pos_y + elementToCheck.pos_y
                }
                return _isPointInElement(objectDimensionsWithOffset)
            }
        );
        
        containingElement = newContainingElement;
    };

    return elementsPointIsIn;
}

/** returns the element below the point (if there are several nested Elements below that point
 * the element returned will be the innermost element aka the element on top)
* @param {object} documentElements  - the  qmDocument tree
* @param {object} point - the point in qmDocument coordinates
* @param {number} point.pos_x - the x coordinate of the point
* @param {number} point.pos_y - the y coordinate of the point
* @returns {object} the element below the point
*/
function _getElementPointIsIn(documentElements,point){
    let elementsPointIsIn = _getElementsPointIsIn(documentElements,point);
    return elementsPointIsIn[elementsPointIsIn.length-1];    
}

/** 
* @param {object} documentElement  - the  qmDocument tree
* @param {number} documentElement.pos_x
* @param {number} documentElement.pos_y
* @param {number} documentElement.width
* @param {number} documentElement.height
* @returns {boolean} - true, if the point is in the qmDocument elements passed.
*/
function _isPointInElement(documentElement,point){
    const isInside = 
        point.pos_x > documentElement.pos_x &&  //Point is right of left side
        point.pos_x < (documentElement.pos_x + documentElement.width) &&  //Point is left of right side
        point.pos_y > documentElement.pos_y && //point is below top side
        point.pos_y < (documentElement.pos_y + documentElement.height) //point is above bottom side

    return isInside 
}

/** returns all parents and their parents etc. Returns empty array if no match was found.
*
* @param {object} documentElements  - the  qmDocument tree
* @param {string} idElementToFind - the Id of the elements whose parents you want to get
* @returns {array} an array with the parents of the element and the element itself
*/
function _getParentChain(treeNode, idElementToFind) {
    idElementToFind = unref(idElementToFind);

    let parentChain = []

    
    let parent = _getParentOf(idElementToFind);
    
    while(parent){
        parentChain.push(parent);
        let nextParent = getParentOf(parent.id)
        parent = nextParent;
    } 

    return parentChain;
}


/** returns the absolute position of an element in the qmDocument
* @param {object} documentElements  - the  qmDocument tree
* @param {string} elementId - the Id of the elements whose parents you want to get
* @returns {object} an array with the parents, beginning with…
*/
function _getElementPositionOnCanvas(documentElements,elementId){
    elementId = unref(elementId);

    const parentChain = _getParentChain(documentElements, elementId);

    const reducerXYAdd = function(accumulator, currentValue){
        return {
            pos_x: accumulator.pos_x + (currentValue.pos_x),
            pos_y: accumulator.pos_y + (currentValue.pos_y)
        }
    };
    //now add all positions along the parent chain.
    const offsetParentChain = parentChain.reduce(reducerXYAdd);

    return offsetParentChain;
}





/** return the element from the qmDocument tree with the specified id
* @param {string} idToFind - the Id of the elements whose parents you want to get
* @param {object} documentElements  - the  qmDocument tree
* @returns {object} the element from the qmDocument tree matching the idToFind
*/
function _getDocumentElementById(idToFind,documentElementTree) {
    idToFind = unref(idToFind); //in case the id is reactive
    const foundElement = documentElementTree.elements.find(element => element.id === idToFind);
    return foundElement;
};

export {
    _isPointInElement,
    _getElementPointIsIn,
    _getDocumentElementById,
    _getFlatDocumentData,
    _getElementsPositionOnCanvas,
    _getParentChain,
    _getParentOf
}