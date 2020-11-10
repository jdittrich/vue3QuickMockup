import {treeReduce,treeReduceContext,treeMap,treeFind} from './lib/treeFunctions.js'
import { unref,toRaw,readonly } from './vue.esm-browser.js'


/**
 * The DocumentElement Object can have an array of children with and array of child Ids. It often also comes with an id.
 * @typedef documentElement
 * @type {object}
 * @property {array} [children] - array of Ids
 * @property {string} id
 * @property {number} pos_x
 * @property {number} pos_y
 * @property {number} width
 * @property {number} height 
 */

/**
 * DocumentElements is an array of DocumentElement
 * @typedef documentElements
 * @type {array}  
 */


/**
 * Gets the parent of a documentElement
 * @param {string} idToSearchFor 
 * @param {documentElements} documentElements
 * @returns {documentElement} parent
 */
function _getParentOf(idToSearchFor, documentElements){
    idToSearchFor = unref(idToSearchFor);
    
    const parent = documentElements.find(element => element.children.includes(idToSearchFor));
    
    //since the flattened array returns new objects, the the proxy ones, we need to find the "real" (reactive) parent again

    return parent; 
};

/** returns the elements which contain the point
* @param {object} documentElements  - the  qmDocument tree
* @param {object} point - the point in qmDocument coordinates
* @param {number} point.pos_x - the x coordinate of the point
* @param {number} point.pos_y - the y coordinate of the point
* @returns {documentElements} the elements which contain the point
*/
function _getElementsPointIsIn(documentElements,point){
    // let currentOffset = {pos_x: 0, pos_y:0}
    
    let rootElement = _getElementById("documentElementsRootNode",documentElements);
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

        let childrenOfContainingElement = _getElementChildren(containingElement.id,documentElements); 
        let newContainingElement = childrenOfContainingElement.find(function(childElement){
                const objectDimensionsWithOffset = {
                    width: (childElement.width || Number.POSITIVE_INFINITY),
                    height: (childElement.height || Number.POSITIVE_INFINITY),
                    pos_x: offset.pos_x + childElement.pos_x,
                    pos_y: offset.pos_y + childElement.pos_y
                }
                return _isPointInElement(objectDimensionsWithOffset,point)
            }
        );
        
        containingElement = newContainingElement;
    };

    return elementsPointIsIn;
}

/** returns the element below the point (if there are several nested Elements below that point
 * the element returned will be the innermost element aka the element on top)
* @param {documentElements} documentElements  - the  qmDocument tree
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
* @param {documentElement} documentElement  - the  qmDocument tree
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
* @param {documentElements} documentElements  - the  qmDocument tree
* @param {string} idElementToFind - the Id of the elements whose parents you want to get
* @returns {array} an array with the parents of the element and the element itself
*/
function _getParentChain(documentElements, idElementToFind) {
    idElementToFind = unref(idElementToFind);

    let parentChain = [];
    parentChain.push(_getElementById(idElementToFind,documentElements));
    
    let parent = _getParentOf( idElementToFind, documentElements);
    
    while(parent){
        parentChain.push(parent);
        let nextParent = _getParentOf(parent.id,documentElements)
        parent = nextParent;
    } 

    return parentChain;
}

function _getElementChildren(id, documentElements){
    const parentElement = _getElementById(id,documentElements);
    console.log(toRaw(parentElement.children));
    const childElements = parentElement.children.map(childId => _getElementById(childId,documentElements));
    

    if(childElements.length === 1 && childElements[0] === undefined){
        throw "Found children are undefined – do the children that are referenced on the element currently exists?"
    }
    return childElements;
}


/** returns the absolute position of an element in the qmDocument
* @param {documentElement} documentElements  - the  qmDocument tree
* @param {string} id - the Id of the elements whose parents you want to get
* @returns {object} object with absolute pos_x und pos_y
*/
function _getElementPositionOnCanvas(id, documentElements){
    id = unref(id);

    const parentChain = _getParentChain(documentElements, id);

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
function _getElementById(idToFind,documentElements) {
    idToFind = unref(idToFind); //in case the id is reactive
    const foundElement = documentElements.find(element => element.id === idToFind);
    if(foundElement===undefined){
        throw new Error("no Element with id "+idToFind)
    }
    return foundElement;
};

export {
    _isPointInElement,
    _getElementsPointIsIn,
    _getElementPointIsIn,
    _getElementChildren,
    _getElementById,
    _getElementPositionOnCanvas,
    _getParentChain,
    _getParentOf
}