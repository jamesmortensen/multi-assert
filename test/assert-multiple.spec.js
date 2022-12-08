const { expect, assert } = require('chai');
const multiAssert = require('../src/multi-assert.js');


describe('Chai assert tests', () => {

    it('should throw an assertion error with two MultipleAssertionErrors', () => {
        let errorNotThrown = true;
        try {
            multiAssert([
                () => assert.equal(1, 2),
                () => assert.equal(3, 3),
                () => assert.equal(3, 4)
            ]);
        } catch(e) {
            errorNotThrown = false;
            const arrErrors = e.message.split('\n');
            expect(arrErrors[2]).to.contain('MultipleAssertionError: expected 1 to equal 2');
            expect(arrErrors[7]).to.contain('MultipleAssertionError: expected 3 to equal 4');
        }
        if(errorNotThrown)
            throw new AssertionError('expected [Function] to throw AssertionError');
    });

    it('should throw an assertion error with one MultipleAssertionError', () => {
        expect(() => {
            multiAssert([
                () => assert.equal(1, 2),
                () => assert.equal(3, 3),
                () => assert.equal(4, 4)
            ]);
        }).to.throw(AssertionError, 'MultipleAssertionError: expected 1 to equal 2');
    });
});

const AssertionError = require('../src/assertion-error.js');
