/**
 * Proxies events so that strategies can be swapped out via setPointerEventStrategy
 */

/**
 * 
 * @param {object} nativeEvent - native MouseEvent 
 * @param {object} customProperties  - additional properties to be added to the qmEvent
 * @param {boolean} customProperties.isDragging - is a drag current going on?
 * @param {object} customProperties.pos_down - position of the mousedown that started the drag (pox_x, pos_y)
 */
function createQmEvent(nativeEvent,customProperties = {}){
    const qmPointerEvent = {
        pos_x_diff:nativeEvent.movementX,
        pos_y_diff:nativeEvent.movementY,
        pos_x: nativeEvent.clientX,
        pos_y: nativeEvent.clientY,
        button: nativeEvent.button,
        ctrlKey: nativeEvent.ctrlKey,
        metaKey: nativeEvent.metaKey,
        shiftKey: nativeEvent.shiftKey,
        originalEvent: nativeEvent
    }
    
    qmPointerEvent.isDragging = customProperties.isDragging || null
    
    if (customProperties.pos_down){
        qmPointerEvent.pos_down = {
            pos_x:customProperties.pos_down.pos_x,
            pos_y:customProperties.pos_down.pos_y
            
        };
    }

    return qmPointerEvent;
}


//variables shared across events -- local state
//last mousedown for move and up events
let pos_down = {
    pos_x : null,
    pos_y : null
}

//is dragging for move and up events
let isDragging = false;

//can hold anything that should be passed to the qmevent handlers as the "options" parameter
//settable via setPointerEventStrategy
let options = null; 


//these is the proxy to the strategies. Proxies  are not changeable, only the strategies.
let pointerEventProxy = {
    down:function(nativeEvent,...rest){

        //set shared state variables
        pos_down = {
            pos_x: nativeEvent.clientX,
            pos_y: nativeEvent.clientY
        };
        isDragging = true;

        const qmevent = createQmEvent(nativeEvent, {
            "isDragging":isDragging,
            "pos_down":pos_down
        });

        strategyPointerEvent.down(qmevent, ...rest);
    },
    move:function(nativeEvent, ...rest){
        const qmevent = createQmEvent(nativeEvent, {
            "isDragging": isDragging,
            "pos_down": pos_down
        });

        strategyPointerEvent.move(qmevent,...rest)
    },
    up: function (nativeEvent, ...rest){
        isDragging = false;

        const qmevent = createQmEvent(nativeEvent, {
            "isDragging": isDragging,
            "pos_down": pos_down
        });

        strategyPointerEvent.up(qmevent,...rest);
    }
}

//the default: strategy which does nothing
const emptyStrategy = {
    down: function () { },
    move: function () { },
    up: function () { },
    name: "empty"
}

let strategyPointerEvent = emptyStrategy;

const setPointerEventStrategy = function (newStrategyPointerEvent, newOptions){
    strategyPointerEvent = newStrategyPointerEvent
    options = newOptions;
}

const unsetPointerEventStrategy = function(){
    //set empty default stratgy
    strategyPointerEvent = emptyStrategy;
}
export { pointerEventProxy, setPointerEventStrategy, unsetPointerEventStrategy}
