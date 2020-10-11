import useDocumentElements from './useDocumentElements.js'


let documentElements = useDocumentElements();

let dragStrategy = {
    mousedown: function () { },
    mousemove: function (event, isDragging, posMousedown, options) {
        if (!isDragging) { return };
        const pos_x_diff = event.movementX;
        const pos_y_diff = event.movementY;
        useDocumentElements.resizeSelectedElementBy({ pos_x_diff, pos_y_diff },sides)       
    },
    mouseup: function () {
    }
};


export { dragStrategy }
