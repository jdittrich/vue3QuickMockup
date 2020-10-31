import {treeReduce,treeReduceContext,treeMap,treeFind} from './lib/treeFunctions.js'

/**
 * The TreeNode Object can have an array of children with other tree node objects. It often also comes with an id
 * @typedef treeNode
 * @type {object}
 * @property {array} [children] - array of treeNodes
 */


// HELPERS
function _getParentOf(idToSearchFor, flatDocumentData){
    const parent = flatDocumentData.find(element => element.children.includes(idToSearchFor));
    return parent; 
};

/** returns the innermost element which contains the point
* @param {object} documentElements  - the  document tree
* @param {object} point - the point in document coordinates
* @param {number} point.pos_x - the x coordinate of the point
* @param {number} point.pos_y - the y coordinate of the point
* @returns {array} the elements which contain the point
*/
function _elementPointIsIn(documentElement,point){
    //let currentOffset = {pos_x: 0, pos_y:0}
    
    //let containsPoint = _documentElements.children.find(element => _isPointInElement(element,point))
    // its a mess!!!
    let elementsPointIsIn = findContainingElement(documentElement, point);    
    
    function findContainingElement(documentElement, point, currentOffset={pos_x:0, pos_y:0},  accumulator=[]) {
        //calculate new offset
        let newOffset = {
            pos_x: currentOffset.pos_x + (documentElement.pos_x || 0),
            pos_y: currentOffset.pos_y + (documentElement.pos_y || 0)
        }

        const objectDimensionsWithOffset = {
            width: (documentElement.width || Number.POSITIVE_INFINITY),
            height: (documentElement.height || Number.POSITIVE_INFINITY),
            pos_x: newOffset.pos_x,
            pos_y: newOffset.pos_y
        }

        if (_isPointInElement(objectDimensionsWithOffset,point)) {
            accumulator.push(documentElement)

            if (documentElement.children.length > 0) {
                documentElement.children.find(childElement => findContainingElement(childElement, point, newOffset, accumulator))
            };
            return accumulator
        } else {
            return false
        } 
    }

    return elementsPointIsIn;
}

/** 
* @param {object} documentElement  - the  document tree
* @param {number} documentElement.pos_x
* @param {number} documentElement.pos_y
* @param {number} documentElement.width
* @param {number} documentElement.height
* @returns {boolean} - true, if the point is in the document elements passed. 
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
* @param {object} documentElements  - the  document tree
* @param {string} idElementToFind - the Id of the elements whose parents you want to get
* @returns {array} an array with the parents of the element and the element itself
*/

function _getParentChain(treeNode, idElementToFind) {
    
    const reducerFlattenWithContext = function (accumulator, treeNode, context) {
        const newElement = {
            'id': treeNode.id,
            'element': treeNode,
            'childIds': (treeNode.children) ? treeNode.children.map(childNode => childNode.id) : [] , 
            'ancestors': [...context.ancestors]
        }

        return [...accumulator, newElement];
    }

    const flattenedTree = treeReduceContext(reducerFlattenWithContext, [], treeNode);
    const elementFound = flattenedTree.find(element => element.id === idElementToFind)
    
    return [...elementFound.ancestors,elementFound.element];
}


/** returns all parents and their parents etc.
* @param {object} documentElements  - the  document tree
* @param {string} elementId - the Id of the elements whose parents you want to get
* @returns {object} an array with the parents, beginning with…
*/
function _getElementPositionOnCanvas(documentElements,elementId){
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


/** returns a brand new Flat tree. If you manipulate the returned flattened node, the passed-in-by-parameter nodes do NOT change!
 * @param {treeNode} - treeNode
 * @returns {array} - array of treeNode like objects. Their children, however, are not other treeNodes, but an array of ids of these children.
 */

function _getFlatDocumentData(treeNode){
    const flattenTreeReducer = function(accumulator,treeNode){
        let newTreeNode = {...treeNode}
    
        if(treeNode.children){
            let childrenIds = treeNode.children.map(childNode=>childNode.id)
            newTreeNode.children = childrenIds;
        };

        const newAccumulator = [...accumulator,newTreeNode];

        return newAccumulator;
    };
    
    const flattenedTree = treeReduce(flattenTreeReducer,[],treeNode);
    return flattenedTree
}


/** return the element from the document tree with the specified id
* @param {object} documentElements  - the  document tree
* @param {string} idToFind - the Id of the elements whose parents you want to get
* @returns {object} the element from the document tree matching the idToFind
*/
function _getDocumentElementById(documentElementTree, idToFind) {
    const checkElement = function(treeNode){
        return (treeNode.id === idToFind)
    }
    
    const foundElement = treeFind(checkElement,documentElementTree)

    return foundElement;
};

export {
    _isPointInElement,
    _elementPointIsIn,
    _getDocumentElementById,
    _getFlatDocumentData,
    _getElementPositionOnCanvas,
    _getParentChain
}