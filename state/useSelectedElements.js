import { reactive } from '../vue.esm-browser.js';

let contentSelection = reactive([]]);

export const useContentSelection = function(){
    const setContentSelection = (contentElement) => contentSelection[0] = contentElement;
    const clearContentSelection = () => contentSelection.splice(0,contentSelection.length)
    return {
        contentSelection,
        setContentSelection,
        clearContentSelection
    }    
}

export default useContentSelection; 