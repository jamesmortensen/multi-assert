const expect = require('chai').expect;
const multiAssert = require('../src/multi-assert.js');

describe('Example 1 - Test', () => {

    it('should validate that true is true', () => {
        expect(false).to.equal(true);
    });

    it('should validate 2 equals 2 an 3 equals 3 and 4 equals 4', () => {
        multiAssert([
           () => expect(1).to.equal(2),
           () => expect(3).to.equal(3),
           () => expect(3).to.equal(4)
        ]);
        console.log('SHOULD NOT SEE THIS')
        throw new Error('multiAssert did not throw an AssertionError');
    });

    it('should validate 2 equals 2 an 3 equals 3 and 4 equals 4', () => {
        multiAssert([
           () => expect(1).to.equal(2),
           () => expect(3).to.equal(3),
           () => expect(4).to.equal(4)
        ]);
    });

});

