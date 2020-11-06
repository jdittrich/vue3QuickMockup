import useDocumentElements from './useDocumentElements.js'


let documentElements = useDocumentElements();

/**
 * pointer strategy (called via pointerEventProxy)
 * Used e.g. when moving documentElements (see useDocumentElements (model) and documentElement (view))
 */

let elementDragStrategy = {
    down:function() { },
    move: function (qmEvent, options){
        if (!qmEvent.isDragging){ return };
        const pos_x_diff = qmEvent.pos_x_diff;
        const pos_y_diff = qmEvent.pos_y_diff;
        documentElements.moveSelectedElementBy({ pos_x_diff, pos_y_diff });
    },
    up: function (qmEvent, options) {
        const postionOfUp = {
            pos_x:qmEvent.pos_x,
            pos_y:qmEvent.pos_y

        }
        documentElements.dropElement(postionOfUp)
    }
};


export {elementDragStrategy}
