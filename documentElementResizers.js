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
            resizerHandles:[
                {   //↑
                    position:{
                        'top':0
                    }
                },
                {   //⭧
                    position:{
                        'top':0,
                        'right':0
                    }
                },
                {   //→
                    position:{
                        'right':0
                    }
                },
                {   //⭨
                    position:{
                        'right':0,
                        'bottom':0
                    }
                },
                {   //↓
                    position:{
                        'bottom':0
                    }
                },
                {   //⭩
                    position:{
                        'bottom':0,
                        'left':0
                    }
                },
                {   //←
                    position:{
                        'left':0
                    }
                },
                {   //⭦
                    position:{
                        'top':0,
                        'left':0
                    }
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
    <div :style="styleObject" @mousedown="onmousedown">
        <document-element-resizer v-for="resizerHandle in resizerHandles" :resizerHandleSpec="resizerHandle" ></document-element-resizer>         
    </div>
    `
}



/*
start:set strategies 
move: resize selected
drop: end resize
*/