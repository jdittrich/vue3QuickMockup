import curry from './ramda/curry.js'
import __ from './ramda/__.js'

// treeMap and treeReduce based on https://jrsinclair.com/articles/2019/functional-js-traversing-trees-with-recursive-reduce/


/**
 * The TreeNode Object can have an array of children with other tree node objects. It often also comes with an id
 * @typedef treeNode
 * @type {object}
 * @property {array} [children] - array of treeNodes
 */



/**
 * Does this node object have children?
 * @param {treeNode} treeNode
 * @returns {boolean}
 */

function hasChildren(treeNode){
      const hasChildren = 
        (typeof treeNode === 'object')
        && (typeof treeNode.children !== 'undefined')
        && (treeNode.children.length > 0);
      
      return hasChildren;
  }

/** 
* @function
* returns an accumulator after having walked the tree. On each node the reducerFunction is called 
* and returns the new accumulator for the next node. 
* 
* @param {function} reducerFunc - reducer, getting an accumulator and node, returning a new accumulator
* @param {*} accumulator - initial accumulator value, same type as return
* @param {treeNode} treeNode
* 
* @returns {*} - same type as accumulator
*/
const treeReduce = curry(function(reducerFunc, accumulator, treeNode){
  const newAccumulator = reducerFunc(accumulator, treeNode);

  if (!hasChildren(treeNode)) {
    return newAccumulator;
  }
  // children.reduce is the native JS array reduce
  // treeReduce with applied reducer function returns 
  // a function which takes accumulator and node and returns an accumulated value
  return treeNode.children.reduce(treeReduce(reducerFunc), newAccumulator)
});


/** 
* @function
* returns an accumulator after having walked the tree. On each node the reducerFunction is called 
* and returns the new accumulator for the next node. 
* Difference to treeReduce: reducer function gets a 3rd argument which gives additional information (currently this element’s ancestors)
* 
* @param {function} reducerFunc - reducer, getting an accumulator, context and node, returning a new accumulator
* @param {*} accumulator - initial accumulator value, same type as return
* @param {treeNode} treeNode
* 
* @returns {*} - same type as accumulator
*/
const treeReduceContext = curry(function (reducerFunc, accumulator, treeNode, context = { 'ancestors': [] }) {
  const newAccumulator = reducerFunc(accumulator, treeNode, context);

  if (!hasChildren(treeNode)) {
    return newAccumulator;
  }

  const newContext = {
    'ancestors': [...context.ancestors, treeNode]
  }
  // children.reduce is the native JS array reduce
  // treeReduce with applied reducer function returns 
  // a function which takes accumulator and node and returns an accumulated value
  return treeNode.children.reduce(treeReduceContext(reducerFunc, __, __, newContext), newAccumulator);
});



/**
* @function
* returns an new Tree. Walks the tree and calls a mapFunction and passes it the current node and expects the new node as return. 
*
* @param {function} mapFunc - mapper, getting an accumulator, returning a new accumulator
* @param {treeNode} treeNode
*
* @returns {treeNode}
*/
const treeMap = curry(function(mapFunc,treeNode){
  const newTreeNode = mapFunc(treeNode);

  if(!hasChildren(treeNode)){
    return newTreeNode;
  }
  // children.map is the native JS array map.
  // treeMap with applied reducer function returns 
  // a function which takes a treeNode and returns an item for an array
  newTreeNode.children = treeNode.children.map(treeMap(mapFunc));
  return newTreeNode;
});



// Frequently used variants

/**
* @function
*
* @param {function} checkElement - gets treeNode, returns true or false
* @param {treeNode} treeNode
*
* @returns {treeNode|undefined} - returns first found treeNode for which checkElement returns true. If no element found returns undefined
*/
const treeFind = function (checkElement, treeNode) {
  const findReducer = function(accumulator,treeNode){
    if(checkElement(treeNode) && accumulator===undefined){
      return treeNode;
    }else{
      return accumulator;
    }
  }
  const result = treeReduce(findReducer,undefined,treeNode)
  return result;
};



export {
  treeReduce,
  treeReduceContext,
  treeMap,
  treeFind,
  hasChildren
}