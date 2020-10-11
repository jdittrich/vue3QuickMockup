import useDocumentElements from './useDocumentElements.js'


let documentElements = useDocumentElements();

let dragStrategy = {
    mousedown:function() { },
    mousemove: function (event, isDragging){
        if(!isDragging){ return };
        const pos_x_diff = event.movementX;
        const pos_y_diff = event.movementY;

        documentElements.moveSelectedElementBy({ pos_x_diff, pos_y_diff });
    },
    mouseup:function() {
    }
};


export {dragStrategy}
