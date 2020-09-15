import documentElementResizer from './documentElementResizer.js'
import {direction_constraint_horizontal, direction_constraint_horizontal, direction_constraint_vertical} from './variables.js'


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
                        'bottom':'100%',
                        'left':'calc(50% - 5px)'
                    },
                    constraint:direction_constraint_vertical
                },
                {   //⭧
                    position:{
                        'bottom':'100%',
                        'left':'100%'
                    }
                },
                {   //→
                    position:{
                        'left':'100%',
                        top:'calc(50% - 5px)'
                    },
                    constraint:direction_constraint_horizontal
                },
                {   //⭨
                    position:{
                        'left':'100%',
                        'top':'100%'
                    }
                },
                {   //↓
                    position:{
                        'top':'100%',
                        'left':'calc(50% - 5px)'
                    },
                    constraint:direction_constraint_vertical
                },
                {   //⭩
                    position:{
                        'top':'100%',
                        'right':'100%'
                    }
                },
                {   //←
                    position:{
                        'right':'100%',
                        'top':'calc(50% - 5px)'        
                    },
                    constraint:direction_constraint_horizontal
                },
                {   //⭦
                    position:{
                        'bottom':'100%',
                        'right':'100%'
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