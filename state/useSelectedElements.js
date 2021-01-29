import { reactive, readonly } from '../vue.esm-browser.js';

const contentSelection = reactive([]);
const contentSelectionReadonly = readonly(contentSelection);

const setContentSelection = (contentElement) => contentSelection[0] = contentElement;
const clearContentSelection = () => contentSelection.splice(0, contentSelection.length)

export { setContentSelection, clearContentSelection, contentSelectionReadonly as contentSelection }