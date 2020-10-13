/**
 * Proxies events so that strategies can be swapped out via setPointerEventStrategy
 */


 // create a custom event. Rather similar like a normal mouseEvent with some additional data like
 // downPoint (the last mousedown)
 // isDragging 
function createQmEvent(nativeEvent,{
    downPoint = null,
    isDragging = null
}){
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

    if (downPoint !== null){
        qmPointerEvent.downPoint_pos_x = downPoint.pos_x;
        qmPointerEvent.downPoint_pos_y = downPoint.pos_y; 
    }
    
    qmPointerEvent.isDragging = isDragging

    return qmPointerEvent;
}


//variables shared across events -- local state
//last mousedown for move and up events
let pos_down = {
    clientpos_x : null,
    clientpos_y : null
}

//is dragging for move and up events
let isDragging = false;

//can hold anything that should be passed to the qmevent handlers as the "options" parameter
//settable via setPointerEventStrategy
let options = null; 


//these is the proxy to the strategies. Proxies  are not changeable, only the strategies.
let pointerEventProxy = {
    down:function(nativeEvent){

        //set shared state variables
        pos_down = {
            clientpos_x: nativeEvent.clientX,
            clientpos_y: nativeEvent.clientY
        };
        isDragging = true;


        const qmevent = createQmEvent(nativeEvent, {
            "isDragging":isDragging,
            "pos_down":pos_down
        });

        strategyPointerEvent.down(qmevent);
    },
    move:function(nativeEvent){ 
        const qmevent = createQmEvent(nativeEvent, {
            "isDragging": isDragging,
            "pos_down": pos_down
        });

        strategyPointerEvent.move(qmevent,options)
    },
    up: function (nativeEvent){
        isDragging = false;

        const qmevent = createQmEvent(nativeEvent, {
            "isDragging": isDragging,
            "pos_down": pos_down
        });

        strategyPointerEvent.up(qmevent,options);
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
    options = newOptions
}

const unsetPointerEventStrategy = function(){
    //set empty default stratgy
    strategyPointerEvent = emptyStrategy;
}
export { pointerEventProxy, setPointerEventStrategy, unsetPointerEventStrategy}
