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


//can be passed to move and up events
let pos_down = {
    clientpos_x : null,
    clientpos_y : null
}

let isDragging = false;

let options = null; 
//can hold anything that should be passed to the qmevent handlers as the "options" parameter
//settable via setPointerEventStrategy

//these is the proxy to the strategies. Proxies  are not changeable, only the strategies.
let pointerEventProxy = {
    down:function(nativeEvent){
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


let strategyPointerEvent = {
    down: function () {},
    move: function () { },
    up: function () {},
    name:"empty"
}

const setPointerEventStrategy = function (newStrategyPointerEvent, newOptions){
    strategyPointerEvent = newStrategyPointerEvent
    options = newOptions
}

const unsetPointerEventStrategy = function(){
    strategyPointerEvent = {
        down: function () {},
        move: function () {},
        up: function () {},
        name: "empty"
    }
}
export { pointerEventProxy, setPointerEventStrategy, unsetPointerEventStrategy}
