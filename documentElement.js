//import data element for data on canvas



export default {
    name:'document-element',
    props:{
        rectSpec: Object
    },
    emits: [
        'mousedown-on-document-element'
    ],
    computed:{
        styleObject:function(){
            return{
                'height':this.rectSpec.height+'px',
                'width':this.rectSpec.width+'px',
                'top':this.rectSpec.pos_y+'px',
                'left':this.rectSpec.pos_x+'px',
                'position':'absolute',
                'outline':'1px solid green'
            }
        }
    },
    methods:{
        onmousedown:function(evt){
            this.$emit('mousedown-on-document-element',evt,this.rectSpec)    
        }
    },
    template:`
    <div :style="styleObject" @mousedown="onmousedown">
    {{rectSpec.id}}
    </div>
    `
}