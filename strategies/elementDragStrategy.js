import {moveSelectedElementBy,startDragElement,endDragElement, dragElementBy} from '../state/useDocumentElements.js'


/**
 * pointer strategy (called via pointerEventProxy)
 * Used e.g. when moving documentElements (see useDocumentElements (model) and documentElement (view))
 */

let elementDragStrategy = {
    down:function() {
        startDragElement()
    },
    move: function (qmEvent, options){
        if (!qmEvent.isDragging){ return };
        const pos_x_diff = qmEvent.pos_x_diff;
        const pos_y_diff = qmEvent.pos_y_diff;
        dragElementBy({ pos_x_diff, pos_y_diff });
    },
    up: function (qmEvent, options) {
        const pos_down = qmEvent.pos_down;
        const pos_up = {
            pos_x:qmEvent.pos_x,
            pos_y:qmEvent.pos_y

        }
        const movedDistance =  {
            pos_x_diff:pos_up.pos_x - pos_down.pos_x,
            pos_y_diff:pos_up.pos_y - pos_down.pos_y
        }
        moveSelectedElementBy(movedDistance)
        endDragElement(); 
    }
};


export {elementDragStrategy}
