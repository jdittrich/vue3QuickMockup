import {reactive} from './vue.esm-browser.js'

let documentElements = reactive([
    {
        width: 100,
        height: 130,
        pos_x: 10,
        pos_y: 20,
        id: 1
    },
    {
        width: 30,
        height: 40,
        pos_x: 200,
        pos_y: 30,
        id: 2
    },
    {
        width: 140,
        height: 50,
        pos_x: 200,
        pos_y: 40,
        id: 3
    }
]);

let selectedElement = ref({});

function useDocumentElements() {
   
    function getDocumentElementById(id) {
        const elementToGet = documentElements.find(element => element.id === id)
        return elementToGet;
    };

    //function to move elements
    //function to end move
    function moveElementBy(id, pos_diff) {
        const { pos_x_diff, pos_y_diff } = pos_diff;
        const elementToMove = getDocumentElementById(id);
        elementToMove.pos_x += pos_x_diff;
        elementToMove.pos_y += pos_y_diff;
    }

    function setSelectedElement(newSelectedElement){
        selectedElement = newSelectedElement    
    }

    function getSelectedElement(){
        return selectedElement
    }

    return {
        documentElements,
        selectedElement,
        setSelectedElement,
        moveElementBy
    }
}

export default useDocumentElements