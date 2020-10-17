import {reactive, ref, computed, watch} from './vue.esm-browser.js'

// should I keep it array or better have a root node? Probably a root node. I can leave the root note pretty much empty. 
// when I use it as canvas, I can add stuff like zoom and width and whatnot somewhere else; the <qm-canvas> or whatever does only
// need to access child objects (in HTML the root node is the same as the .document)
let documentElements = reactive({
    id: "documentElementsRootNode",
    children: [{
            width: 100,
            height: 130,
            pos_x: 10,
            pos_y: 20,
            id: "1",
            children: [{
                width: 30,
                height: 40,
                pos_x: 10,
                pos_y: 10,
                children: [],
                id: "99"
            }]
        },
        {
            width: 30,
            height: 40,
            pos_x: 200,
            pos_y: 30,
            children: [],
            id: "2"
        },
        {
            width: 140,
            height: 50,
            pos_x: 200,
            pos_y: 40,
            children: [],
            id: "3"
        }
    ]
});

const selectedElementId = ref("null");




function useDocumentElements() {
    // HELPERS
    function _calculatePositionOnCanvas(elementId,documentElements){
           
        const flatDocumentData = _getFlatDocumentData(documentElements);
            
        function getParentOf(flatDocumentData, idToSeachFor){
            const parent = flatDocumentData.find(element => element.children.includes(idToSeachFor));
            return parent; 
        }

        // create an array containing all the parents 
        let idToSeachFor = elementId;
        let currentElement = _getDocumentElementById(elementId)
        let parentChain = [];

        while (currentElement && idToSearchFor !== "documentElementsRootNode"){
            
            parentChain.push(currentElement)

            currentElement = getParentOf(flatDocumentData, idToSeachFor);
            idToSearchFor = currentElement.id;
        }
        
        //now add all positions along the parent chain. 
        const offset = parentChain.reduce((accumulator, currentValue)=>{
            return {
                pos_x: accumulator.pos_x + currentValue.pos_x,
                pos_y: accumulator.pos_y + currentValue.pos_y
            }
        })

        return offset
    }

    function _getFlatDocumentData(documentElementTree) {
        let flatDocumentData = [];

        flatten(documentElementTree);

        function flatten(documentElementTree) {
            const toAppend = Object.assign({}, documentElementTree, {
                children: documentElementTree.children.map(element => element.id)
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



    function setSelectedElementId(newSelectedElementId){
        selectedElementId.value = newSelectedElementId;    
    }

    function unsetSelectedElementId(){
        selectedElementId.value = null
    }

    const selectedElement = computed(()=>{
        const selectedElementData = _getDocumentElementById(documentElements, selectedElementId.value)
        return selectedElementData;
        
        // const positionOnCanvas = 
        //  selectedElement
        // _getDocumentElementById(selectedElementId.value)
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