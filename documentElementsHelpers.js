// HELPERS
function _getParentOf(flatDocumentData, idToSearchFor){
    const parent = flatDocumentData.find(element => element.children.includes(idToSearchFor));
    return parent; 
};

function _getElementPositionOnCanvas(documentElements,elementId){
    
    const flatDocumentData = _getFlatDocumentData(documentElements);
        

    // create an array containing all the parents 
    let idToSearchFor = elementId;
    let currentElement = _getDocumentElementById(elementId)
    let parentChain = [];

    while (currentElement && idToSearchFor !== "documentElementsRootNode"){
        parentChain.push(currentElement)

        currentElement = _getParentOf(flatDocumentData, idToSearchFor);
        idToSearchFor = currentElement.id;
    }
    
    //now add all positions along the parent chain. 
    const offset = parentChain.reduce((accumulator, currentValue)=>{
        return {
            pos_x: accumulator.pos_x + currentValue.pos_x,
            pos_y: accumulator.pos_y + currentValue.pos_y
        }
    })

    return {
        pos_x_abs:offset.pos_x,
        pos_x_abs:offset.pos_y
    }
}

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
    _getDocumentElementById,
    _getFlatDocumentData,
    _getElementPositionOnCanvas
}