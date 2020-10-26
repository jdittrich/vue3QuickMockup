import curry from './ramda/curry.js'

// based on https://jrsinclair.com/articles/2019/functional-js-traversing-trees-with-recursive-reduce/

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

function hasChildren(node){
    const hasChildren = 
      (typeof node === 'object')
      && (typeof node.children !== 'undefined')
      && (node.children.length > 0);
    
    return hasChildren;
}


export {
  treeReduce,
  treeMap,
  hasChildren
}