const expect = require('chai').expect;
const multiAssert = require('../src/multi-assert.js');


describe('Chai expect tests', () => {

    it('should throw an assertion error with two MultipleAssertionErrors', () => {
        let errorNotThrown = true;
        try {
            multiAssert([
                () => expect(1).to.equal(2),
                () => expect(3).to.equal(3),
                () => expect(3).to.equal(4)
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
                () => expect(1).to.equal(2),
                () => expect(3).to.equal(3),
                () => expect(4).to.equal(4)
            ]);
        }).to.throw(AssertionError, 'MultipleAssertionError: expected 1 to equal 2');
    });
});

const AssertionError = require('../src/assertion-error.js');
