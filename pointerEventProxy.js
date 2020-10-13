//start
//store initial position
//execute function

//they remain constant and do general handling like storing positions etc.
let pos_mousedown = {
    clientpos_x : null,
    clientpos_y : null
}

let isDragging = false

//these are the proxy to the strategies. They are not changable.
let mouseEventProxy = {
    mousedown:function(event){
        pos_mousedown = {
            clientpos_x : event.clientX,
            clientpos_y : event.clientY
        };
        isDragging = true;

        strategyMouseEvent.mousedown(event);
    },
    mousemove:function(event){
        strategyMouseEvent.mousemove(event,isDragging,pos_mousedown)
    },
    mouseup:function(){
        isDragging = false;
        strategyMouseEvent.mouseup(event,pos_mousedown);

    }
}

//these can be set
let strategyMouseEvent = {
    mousedown: function () {},
    mousemove: function () {},
    mouseup: function () {}
}

const setMouseEventStrategy = function (newStrategyMouseEvent = {
    mousedown: function () { },
    mousemove: function () { },
    mouseup: function () { }
}){
    strategyMouseEvent = newStrategyMouseEvent
}

const unsetMouseEventStrategy = function(){
    strategyMouseEvent = {
        mousedown: function () { },
        mousemove: function () { },
        mouseup: function () { }
    }
}
export { mouseEventProxy, setMouseEventStrategy, unsetMouseEventStrategy}
