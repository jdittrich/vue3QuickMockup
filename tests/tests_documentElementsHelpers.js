import documentElementData from './../documentElementData.js'
import {
    _getElementById,
    _getElementChildren,
    _getElementPositionOnCanvas,
    _getParentChain,
    _isPointInElement,
    _getElementsPointIsIn,
    _getParentOf
} from './../documentElementsHelpers.js'

const it = Mocha.it;
const describe = Mocha.describe;

describe('_getElementById', function () {
    it('should return the document object with the id', function () {
        //get a non-root object: 
        const documentObject = documentElementData[1]
        //get its id
        const documentObjectId = documentObject.id

        chai.expect(
            _getElementById(documentObjectId, documentElementData)
        ).to.equal(
            documentObject
        );
    });
    it('should throw an error for a non existing id', function () {
        chai.expect(
            () => { _getElementById("iShouldNotExist", documentElementData) } //wrap throwing function in function, see https://stackoverflow.com/questions/14966821/
        ).to.throw(/id/);
    });
});

describe('_getParentOf', function () {
    it('should return parent', function () {
        let parent = _getElementById("1",documentElementData);
        chai.expect(
            _getParentOf("99",documentElementData)
        ).to.equal(
            parent
        );
    });
});


/*
describe('_getFlatDocumentData', function () {
    const flatData = _getFlatDocumentData(documentElementData);
    it('should be an array', function () {
        chai.expect(flatData).to.be.an('Array');
    })
});*/

describe('_getParentChain', function () {
    const parentsOf99 = [
        _getElementById("99",documentElementData),
        _getElementById("1",documentElementData),
        _getElementById("documentElementsRootNode",documentElementData),
    ]
    it('should return the parents+ element ', function () {
        chai.expect(_getParentChain(documentElementData, '99')).to.eql(parentsOf99);
    })

});

describe('_getParentChain', function () {
    it('should give the absolute position  by adding all offsets', function () {
        chai.expect(_getElementPositionOnCanvas('99',documentElementData)).to.eql({ 'pos_x': 60, 'pos_y': 60 });
    })
});

describe('_getElementChildren', function () {
    const rootNodeChildren = [
        _getElementById("1", documentElementData),
        _getElementById("2", documentElementData),
        _getElementById("3", documentElementData)
    ];


    it('should return the element’s children', function () {
        chai.expect(_getElementChildren("documentElementsRootNode",documentElementData)).to.eql(rootNodeChildren);
    });

    it('should return an empty array children for an element without children',function(){
        chai.expect(_getElementChildren("2",documentElementData)).to.eql([]);
    })
});

describe('_elementsPointIsIn', function () {
    const pointIn99 = { pos_x: 62, pos_y: 65 }
    const elements99PointIsIn = [
        _getElementById("documentElementsRootNode",documentElementData),
        _getElementById("1",documentElementData),
        _getElementById("99",documentElementData)
    ]

    it('should return an array with elements root,1,99', function () {
        chai.expect(_getElementsPointIsIn(documentElementData, pointIn99)).to.eql(elements99PointIsIn)
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