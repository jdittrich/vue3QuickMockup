import { ref } from '../vue.esm-browser.js';

let contentSelection = ref(null)

export const useContentSelection = function(){
    const setContentSelection = (contentElement) => contentSelection.value = contentElement;
    const clearContentSelection = () => contentSelection.value = null;      

    return {
        contentSelection,
        setContentSelection,
        clearContentSelection
    }    
}


export default useContentSelection; 