import documentElementResizer from './vDocumentElementResizer.js'
import { getAbsolutePosition, getElementById } from '../state/useDocumentElements.js'
import {toRefs, computed} from '../vue.esm-browser.js'

/**
 * Holds all the resizer handles. See (documentElementResizer.js)
 * Also creates the "selected" effect using 'background-color':'rgba(0,100,250,0.3)', (The effect/data for it probably should reside within the elements or in some other overlay, not here, eventually)
 * Mouse events are not captured by it but passed "through" via pointer-events:none (except you click a child element which stops this behavior, like a resizer)
*/
export default {
    name:'document-element-resizers',
    components:{
        'document-element-resizer':documentElementResizer
    },
    props:[
        //'selectedElementId',
        'selectedElement'
    ],
    setup:function(props,context){
        const selectedElements = props.selectedElement;
        
        const styleObject = computed(function(){
            if (!selectedElements  || selectedElements.length === 0) { 
                return 
            };

            const { width, height } = toRefs(selectedElements[0]);
            const absolutePosition = getAbsolutePosition(selectedElements[0]);

            return {
                'height': height.value + 'px',
                'width': width.value + 'px',
                'top': absolutePosition.pos_y + 'px',
                'left': absolutePosition.pos_x + 'px',
                'position': 'absolute',
                'background-color': 'rgba(0,100,250,0.3)',
                'pointer-events': 'none'
            }
        });

        return {styleObject}
    },
    data:function(){
        return {
            resizerHandles: [
                { // 🡱 
                    'top': true,
                },
                { //🡵
                    'top': true,
                    'right': true
                },
                { //🡲
                    'right': true,
                },
                { //🡶
                    'right': true,
                    'bottom': true
                },
                { //🡳
                    'bottom': true,
                },
                { //🡷

                    'left': true,
                    'bottom': true

                },
                { //🡰 
                    'left': true,
                },
                { //🡴
                    'top': true,
                    'left': true
                },
            ]
        }
    },
    template:`
    <div :style="styleObject">
        <document-element-resizer v-for="resizerHandle in resizerHandles" :resizerHandleSpec="resizerHandle" ></document-element-resizer>         
    </div>
    `
}



/*
start:set strategies 
move: resize selected
drop: end resize
*/