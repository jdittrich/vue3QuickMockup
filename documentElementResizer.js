import {toRaw} from './vue.esm-browser.js'
import {setPointerEventStrategy} from './pointerEventProxy.js'
import {elementResizeStrategy} from './elementResizeStrategy.js'

export default {
    name:'document-element-resizers',  
    props:{
        'resizerHandleSpec': Object
    },
    emits: [
        'mousedown-on-document-element-resizer'
    ],
    computed:{
        styleObject:function(){
            const positionObject = toRaw(this.resizerHandleSpec);

            let positionStyles = {
                'top':'calc(50% - 5px)',
                'left': 'calc(50% - 5px)'
            };

            if(positionObject.top === true){
                positionStyles.top="-10px";                
            };
            if (positionObject.right === true) {
                positionStyles.left = "100%";
            };
            if (positionObject.bottom === true) {
                positionStyles.top = "100%";
            };
            if (positionObject.left === true) {
                positionStyles.left = "-10px";
            };


            const generalStyles = {
                'height':'10px',
                'width':'10px',
                'position':'absolute', 
                'pointer-events':'auto',
                'background':"rgba(0,200,100,0.8)",
                'outline':'1px solid rgb(0,200,100)' 
            }

            return Object.assign({}, generalStyles, positionStyles);
        }
    },
    methods:{
        onmousedown:function(evt){
            setPointerEventStrategy(elementResizeStrategy, toRaw(this.resizerHandleSpec))
        }
    },
    template:`
    <div :style="styleObject" @mousedown="onmousedown"></div>
    `
}



/*
start:set strategies 
move: resize selected
drop: end resize
*/