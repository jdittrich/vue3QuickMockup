import {toRaw} from './vue.esm-browser.js'

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
            const positionObject = toRaw(this.resizerHandleSpec.position);

            const generalStyles = {
                'height':'10px',
                'width':'10px',
                'position':'absolute', 
                'pointer-events':'auto',
                'background':"rgba(0,200,100,0.8)",
                'outline':'1px solid rgb(0,200,100)' 
            }

            return Object.assign({},generalStyles,positionObject);
        }
    },
    methods:{
        onmousedown:function(evt){
            this.$emit('mousedown-on-document-element-resizer',evt,this.resizeHandle)    
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