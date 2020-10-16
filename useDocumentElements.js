import {reactive, ref, computed, watch} from './vue.esm-browser.js'

let documentElements = reactive([
    {
        width: 100,
        height: 130,
        pos_x: 10,
        pos_y: 20,
        id: "1",
        children:[{
            width: 30,
            height: 40,
            pos_x: 10,
            pos_y: 10,
            children: [],
            id: "99"
            }
        ]
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
]);

const selectedElementId = ref("null");






function useDocumentElements() {
    // HELPERS
    function _getDocumentElementById(idToFind) {
        //wrap the document in an empty root node
        const rootNodeTree= {
            "children": documentElements,
            "id": Symbol("rootNode") //so you CANT pass anything that returns you this root node
        }

        const elementToGet = searchTree(rootNodeTree, idToFind)

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
        const elementToMove = _getDocumentElementById(id);
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
        const elementToResize = _getDocumentElementById(id);

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

    const selectedElement = computed(()=>_getDocumentElementById(selectedElementId.value));
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