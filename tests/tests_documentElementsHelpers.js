import documentElementData from './../documentElementData.js'
import {
    _getDocumentElementById,
    _getFlatDocumentData,
    _getElementPositionOnCanvas,
    _getParentChain,
    _isPointInElement,
    _elementPointIsIn
} from './../documentElementsHelpers.js'

const it = Mocha.it;
const describe = Mocha.describe;

describe('_getDocumentElementById', function () {
    it('should return the document object with the id', function () {
        //get a non-root object: 
        const documentObject = documentElementData.children[1]
        //get its id
        const documentObjectId = documentObject.id

        chai.expect(
            _getDocumentElementById(documentElementData, documentObjectId)
        ).to.equal(
            documentObject
        );
    });
});


describe('_getFlatDocumentData', function () {
    const flatData = _getFlatDocumentData(documentElementData);
    it('should be an array', function () {
        chai.expect(flatData).to.be.an('Array');
    })
});

describe('_getParentChain', function () {
    const nestedData = {
        'id': 'documentElementsRootNode',
        'children': [
            {
                'id': '2',
                'children': [
                    {
                        'id': '1',
                        'children': []
                    }]
            }]
    }

    const parentChain = [
        { 'id': '1', 'children': [] },
        { 'id': '2', 'children': ['1'] }
    ];

    it('should return the parents', function () {
        chai.expect(_getParentChain(nestedData, '1')).to.eql(parentChain);
    })

    it('should return the id as the only value in an array if the element is a direct descendent of the root element', function () {
        chai.expect(_getParentChain(nestedData, '2')).to.eql([{ 'id': '2', 'children': ['1'] }]);
    })

});

describe('_getParentChain', function () {
    const nestedData = {
        'id': 'documentElementsRootNode',
        'children': [
            {
                'id': '2',
                'pos_x': 20,
                'pos_y': 30,
                'children': [
                    {
                        'id': '1',
                        'pos_x': 10,
                        'pos_y': 5,
                        'children': []
                    }]
            }]
    }

    it('should give the absolute position  by adding all offsets', function () {
        chai.expect(_getElementPositionOnCanvas(nestedData, '1')).to.eql({ 'pos_x_abs': 30, 'pos_y_abs': 35 });
    })
});

describe('_elementPointIsIn', function () {
    const nestedData = {
        'id': 'documentElementsRootNode',
        'children': [
            {
                'id': '1',
                'pos_x': 20,
                'pos_y': 31,
                'width': 200,
                'height': 151,
                'children': [
                    {
                        'id': '2',
                        'pos_x': 10,
                        'pos_y': 11,
                        'width': 40,
                        'height': 51,
                        'children': [
                            {
                                id: '3',
                                'pos_x': 10,
                                'pos_y': 3,
                                'width': 10,
                                'height': 11,
                                'children': []
                            }]
                    }]
            }]
    }

    const pointIn3 = { pos_x: 45, pos_y: 50 }
    const pointIn1 = { pos_x: 110, pos_y: 150 }


    it('should return an array with 4 elements', function () {
        chai.expect(_elementPointIsIn(nestedData, pointIn3)).to.eql([nestedData, nestedData.children[0], nestedData.children[0].children[0], nestedData.children[0].children[0].children[0]])
    });

    it('should return an array with 2 elements', function () {
        chai.expect(_elementPointIsIn(nestedData, pointIn1)).to.eql([nestedData, nestedData.children[0]])
    });
});


describe('_isPointInElement', function () {
    const element = {
        pos_x: 2,
        pos_y: 2,
        width: 50,
        height: 50
    }
    const outsidePoint = {
        pos_x: 999,
        pos_y: 999
    }

    const insidePoint = {
        pos_x: 15,
        pos_y: 15
    }

    it('should recognize point is outside', function () {
        chai.expect(_isPointInElement(element, outsidePoint)).to.be.false;
    })

    it('should recognize point is inside', function () {
        chai.expect(_isPointInElement(element, insidePoint)).to.be.true;
    })
});