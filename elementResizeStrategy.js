import useDocumentElements from './useDocumentElements.js'


let documentElements = useDocumentElements();

/**
 * pointer strategy (called via pointerEventProxy)
 * Used e.g. when resizing documentElements (see useDocumentElements (model) and documentElement (view)) via handles (see documentElementResizer) 
 */

const elementResizeStrategy = {
    down: function () {},
    move: function (qmevent, options) { //options carries the spec which handler has been dragged based on booleans on top, right, bottom, left.
        if (!qmevent.isDragging) {
            return
        };
        const pos_x_diff = qmevent.pos_x_diff;
        const pos_y_diff = qmevent.pos_y_diff;
        documentElements.resizeSelectedElementBy({
            pos_x_diff,
            pos_y_diff
        }, options)
    },
    up: function () {}
};


export {elementResizeStrategy}