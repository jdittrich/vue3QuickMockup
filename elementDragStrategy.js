import useDocumentElements from './useDocumentElements.js'


let documentElements = useDocumentElements();

let elementDragStrategy = {
    down:function() { },
    move: function (qmEvent, options){
        if (!qmEvent.isDragging){ return };
        const pos_x_diff = qmEvent.pos_x_diff;
        const pos_y_diff = qmEvent.pos_y_diff;
        documentElements.moveSelectedElementBy({ pos_x_diff, pos_y_diff });
    },
    up:function() {
    }
};


export {elementDragStrategy}
