import documentElementResizer from './documentElementResizer.js'


export default {
    name:'document-element-resizers',
    components:{
        'document-element-resizer':documentElementResizer
    },
    props:[
        'selectedElement'
    ],
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
    computed:{
        styleObject:function(){
            if(!this.selectedElement){return}
            return{
                'height':this.selectedElement.height+'px',
                'width':this.selectedElement.width+'px',
                'top':this.selectedElement.pos_y+'px',
                'left':this.selectedElement.pos_x+'px',
                'position':'absolute',
                'background-color':'rgba(0,100,250,0.3)',
                'pointer-events':'none'
            }
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