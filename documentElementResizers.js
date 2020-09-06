
export default {
    name:'document-element-resizers',
    props:{
        posSpec: Object,
        direction: String
    },
    emits: [
        'mousedown-on-document-document-element-resizers'
    ],
    computed:{
        styleObject:function(){
            return{
                'height':'10px',
                'width':'10px',
                'top':this.posSpec.pos_y+'px',
                'left':this.posSpec.pos_x+'px',
                'position':'absolute',
                'background':'blue'
            }
        }
    },
    methods:{
        onmousedown:function(evt){
            this.$emit('mousedown-on-document-element-resizers',evt,this.posSpec)    
        }
    },
    template:`
    <div :style="styleObject" @mousedown="onmousedown">
    </div>
    `
}