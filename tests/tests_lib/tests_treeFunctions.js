import {
    treeReduce,
    treeReduceContext,
    treeMap,
    treeFind,
    hasChildren
} from './../../lib/treeFunctions.js'

const it = Mocha.it;
const describe = Mocha.describe;



describe('treeReduce', function () {
    const nestedData = {
        'id': 'documentElementsRootNode',
        'value':0,
        'children': [
            {
                'id': '1',
                'value':2,
                'children': [
                    {
                        'id': '2',
                        'value':4,
                        'children': [
                            {
                                'id': '3',
                                'value':8,
                                'children': []
                            }]
                        }]
            },
            { 
                'id': '4',
                'value': 16,
                'children':[]
            }
        ]
    }
    const reducer_adding = function(accumulator, treeNode){    
        return accumulator + treeNode.value;
    }
    it('should add 0,2,4,8,16 to 30', function () {
        chai.expect(treeReduce(reducer_adding, 0 , nestedData)).equals(30);
    })
    

});

describe('treeReduceContext', function () {
    const nestedData = {
        'id': "1",
        'children': [
            {
                'id': "2",
                'children': []
            }]
    }

    const reducerFlattenWithContext = function (accumulator, treeNode, context) {
        const newElement = {
            'id': treeNode.id,
            'element': treeNode,
            'ancestors': [...context.ancestors]
        }

        return [...accumulator, newElement];
    } 



    it('should flatten Array', function () {
        chai.expect(treeReduceContext(reducerFlattenWithContext,[],nestedData)).to.eql([
            {'id':"1",'element':nestedData,'ancestors':[]},
            {'id':"2", 'element': nestedData.children[0], 'ancestors': [nestedData]}
        ]);
    });
});


describe('treeMap', function () {
    const nestedData = {
        'value': 0,
        'children': [
            {
                
                'value': 2,
                'children': [
                    {
                        'value': 4,
                        'children': [
                            {
                                'value': 8,
                            }]
                    }]
            }]
    }

    const nestedDatax2 = {
        'value': 0,
        'children': [
            {
                'value': 4,
                'children': [
                    {
                        'value': 8,
                        'children': [
                            {
                                'value': 16,
                            }]
                    }]
            }]
    }
    const mapper = function (treeNode) {
        return {value: treeNode.value*2}
    }

    it('should multiply each value', function () {
        chai.expect(treeMap(mapper, nestedData)).to.eql(nestedDatax2);
    })
});

describe('treeFind', function () {
    const nestedData = {
        'value': 0,
        'children': [
            {

                'value': 2,
                'children': [
                    {
                        'value': 4,
                        'children': [
                            {
                                'value':8
                            }
                       ]
                    }
                ]
            }
        ]
    }


    it('should return element with value:4', function () {
        chai.expect(treeFind(treeNode => treeNode.value > 3, nestedData)).to.eql({
            'value': 4,
            'children': [
                {
                    'value': 8,
                }]
        });
    })
    it('should return undefined for element not in the node', function () {
        chai.expect(treeFind(treeNode =>treeNode.value === 123, nestedData)).to.equal(undefined);
    })
    it('should return the initial node itself if id matches ', function () {
        chai.expect(treeFind(treeNode => treeNode.value === 0, nestedData)).to.equal(nestedData);
    })
});
