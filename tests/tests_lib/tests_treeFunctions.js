import {
    treeReduce,
    treeMap,
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
            }]
    }
    const reducer = function(accumulator, treeNode){    
        return accumulator + treeNode.value;
    }

    it('should add 0,2,4,8 to 14', function () {
        chai.expect(treeReduce(reducer, 0, nestedData)).equals(14);
    })
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