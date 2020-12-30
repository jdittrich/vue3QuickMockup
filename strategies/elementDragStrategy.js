import {moveElementBy} from '../state/useDocumentElements.js';
import {useDragAndDrop} from '../state/useDragAndDrop.js';
import {useContentSelection} from '../state/useSelectedElements.js'

const {createProxy,moveProxyBy} = useDragAndDrop();
const {contentSelection} = useContentSelection();

// TODO
// I need a function to move an element, not matter if it is a proxy or not: 
// import {moveElementBy} …
//
// I need to get the proxys to manipulate
// import {draggedProxy}…
// 
// I need to import the elements which I then actually move
// import {draggedElements}


/**
 * pointer strategy (called via pointerEventProxy)
 * Used e.g. when moving documentElements (see useDocumentElements (model) and documentElement (view))
 */

let elementDragStrategy = {
    down:function(qmEvent,vueElement) {
        createProxy(vueElement);
        //startDragElement()
    },
    move: function (qmEvent){
        if (!qmEvent.isDragging){ return };
        const pos_x_diff = qmEvent.pos_x_diff;
        const pos_y_diff = qmEvent.pos_y_diff;
        moveProxyBy({ pos_x_diff, pos_y_diff });
    },
    up: function (qmEvent) {
        const pos_down = qmEvent.pos_down;
        const pos_up = {
            pos_x:qmEvent.pos_x,
            pos_y:qmEvent.pos_y

        }
        const movedDistance =  {
            pos_x_diff:pos_up.pos_x - pos_down.pos_x,
            pos_y_diff:pos_up.pos_y - pos_down.pos_y
        }
        moveElementBy(contentSelection.id,movedDistance);
        //endDragElement(); 
    }
};


export {elementDragStrategy}
