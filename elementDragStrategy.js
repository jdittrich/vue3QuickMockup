import useDocumentElements from './useDocumentElements.js'

let documentElements = useDocumentElements();


function mousedownDragStrategy() { }


function mousemoveDragStrategy(event,isDragging){
    if(!isDragging){return};
    const pos_x_diff = event.movementX;
    const pos_y_diff = event.movementY;

    documentElements.moveSelectedElementBy({pos_x_diff, pos_y_diff});
}

function mouseupDragStrategy() {
    
}


export { mouseupDragStrategy, mousemoveDragStrategy, mousedownDragStrategy}
