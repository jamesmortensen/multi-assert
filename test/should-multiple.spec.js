const should = require('chai').should();
const expect = require('chai').expect;
const multiAssert = require('../src/multi-assert.js');


describe('Chai should Tests', () => {

    it('should throw an assertion error with two MultipleAssertionErrors', () => {
        let errorNotThrown = true;
        const name = 'James';
        const favColor = 'purplegreen';
        try {
            multiAssert([
                () => name.should.be.an('array'),
                () => favColor.should.equal('orangepink'),
                () => name.should.equal('James')
            ]);
        } catch (e) {
            errorNotThrown = false;
            const arrErrors = e.message.split('\n');
            expect(arrErrors[2]).to.contain('MultipleAssertionError: expected \'James\' to be an array');
            expect(arrErrors[7]).to.contain('MultipleAssertionError: expected \'purplegreen\' to equal \'orangepink\'');
        }
        if(errorNotThrown)
            throw new AssertionError('expected [Function] to throw AssertionError');
    });

    it('should throw an assertion error with one MultipleAssertionError', () => {
        expect(() => {
            const name = 'James';
            const favColor = 'purplegreen';
            multiAssert([
                () => name.should.be.a('string'),
                () => favColor.should.equal('orangepink'),
                () => name.should.equal('James')
            ]);
        }).to.throw(AssertionError, 'MultipleAssertionError: expected \'purplegreen\' to equal \'orangepink\'');
    });
});

const AssertionError = require('../src/assertion-error.js');
