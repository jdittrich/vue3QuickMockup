// HELPERS
function _getParentOf(flatDocumentData, idToSearchFor){
    const parent = flatDocumentData.find(element => element.children.includes(idToSearchFor));
    return parent; 
};

/** returns the innermost element which contains the point
* @param {object} documentElements  - the  document tree
* @param {object} point - the point in document coordinates
* @param {number} point.pos_x - the x coordinate of the point
* @param {number} point.pos_y - the y coordinate of the point
* @returns {object} the innermost element (in case point applies to several nested elements) which contains the point
*/
function _elementPointIsIn(documentElements,point){
    const flatDocumentData = _getFlatDocumentData(documentElements);
    const enclosingElements = flatDocumentData.filter(element => _isPointInElement(element,point));
    
    //efficient way to find innermost element? probably by comparing the flat Document data children attributes
    //checking what contains what
    //return element
}

/** returns the innermost element which contains the point
* @param {object} documentElement  - the  document tree
* @param {number} documentElement.pos_x
* @param {number} documentElement.pos_y
* @param {number} documentElement.width
* @param {number} documentElement.height
*
* @param {object} point - the point in document coordinates
* @param {number} point.pos_x - the x coordinate of the point
* @param {number} point.pos_y - the y coordinate of the point
* @returns {object} the innermost element (in case point applies to several nested elements) which contains the point
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
* @param {string} elementId - the Id of the elements whose parents you want to get
* @returns {array} an array with the parents, beginning with…
*/  
function _getParentChain(documentElements,elementId){
    const flatDocumentData = _getFlatDocumentData(documentElements);
    // create an array containing all the parents 
    let idToSearchFor = elementId;
    let currentElement = _getDocumentElementById(documentElements,elementId)

    let parentChain = [];

    while (currentElement && idToSearchFor !== "documentElementsRootNode") {
        parentChain.push(currentElement)

        currentElement = _getParentOf(flatDocumentData, idToSearchFor);
        idToSearchFor = currentElement.id;
    }

    return parentChain;
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
            pos_x: accumulator.pos_x + currentValue.pos_x,
            pos_y: accumulator.pos_y + currentValue.pos_y
        }
    };
    //now add all positions along the parent chain.
    const offset = parentChain.reduce(reducerXYAdd);

    return {
        pos_x_abs:offset.pos_x,
        pos_y_abs:offset.pos_y
    }
}

/** returns all parents and their parents etc.
* @param {object} documentElements  - the  document tree
* @returns {array} flattened tree. The children-array contains the ids of the children, not the children themselves. 
*/
function _getFlatDocumentData(documentElementTree) {
    let flatDocumentData = [];

    flatten(documentElementTree);

    function flatten(documentElementTree) {
        let childrenIds = documentElementTree.children.map(element => element.id) 
        const toAppend = Object.assign({}, documentElementTree, {
            'children': childrenIds
        });
        flatDocumentData.push(toAppend);
        
        if (documentElementTree.children.length > 0) {
            documentElementTree.children.forEach(element => flatten(element))
        }
    }

    return flatDocumentData;
}

/** return the element from the document tree with the specified id
* @param {object} documentElements  - the  document tree
* @param {string} idToFind - the Id of the elements whose parents you want to get
* @returns {object} the element from the document tree matching the idToFind
*/
function _getDocumentElementById(documentElementTree, idToFind) {

    const elementToGet = searchTree(documentElementTree, idToFind)

    // https://stackoverflow.com/questions/9133680#9133680, CC BY-SA_3, driangle, tanman
    function searchTree(element, idToFind) {
        if (element.id == idToFind) {
            return element;
        } else if (element.children != null) {
            var i;
            var result = null;
            for (i = 0; result == null && i < element.children.length; i++) {
                result = searchTree(element.children[i], idToFind);
            }
            return result;
        }
        return null;
    }

    return elementToGet;
};

export {
    _isPointInElement,
    _getDocumentElementById,
    _getFlatDocumentData,
    _getElementPositionOnCanvas,
    _getParentChain
}