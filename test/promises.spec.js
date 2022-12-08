const expect = require('chai').expect;
const multiAssertAsync = require('../src/multi-assert-async.js');


describe('Chai promises expect tests - async/await', function () {

    async function fetchData() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('{"status":"bluegreen"}');
            }, 300)
        });
    }

    it('should pass with just one assertion and no multiAssert', async () => {
        expect((JSON.parse(await fetchData())).status).to.equal('bluegreen');
    });

    it('should throw an assertion error for async function that returns yellowblue instead of bluegreen', async () => {
        let errorNotThrown = true;
        try {
            await multiAssertAsync([
                async () => expect((JSON.parse(await fetchData())).status).to.equal('yellowblue')
            ]);
        } catch (e) {
            errorNotThrown = false;
            const arrErrors = e.message.split('\n');
            expect(arrErrors[2]).to.contain('MultipleAssertionError: expected \'bluegreen\' to equal \'yellowblue\'');
        }
        if(errorNotThrown)
            throw new AssertionError('expected [Function] to throw AssertionError');
    });

    it('should throw an assertion error with two MultipleAssertionErrors with one async', async () => {
        let errorNotThrown = true;
        try {
            await multiAssertAsync([
                async () => expect((JSON.parse(await fetchData())).status).to.equal('yellowblue'),
                () => expect(3).to.equal(3),
                () => expect(3).to.equal(4)
            ]);
        } catch (e) {
            errorNotThrown = false;
            const arrErrors = e.message.split('\n');
            expect(arrErrors[7]).to.contain('MultipleAssertionError: expected \'bluegreen\' to equal \'yellowblue\'');
            expect(arrErrors[2]).to.contain('MultipleAssertionError: expected 3 to equal 4');
        }
        if(errorNotThrown)
            throw new AssertionError('expected [Function] to throw AssertionError');
    });

    it('should throw an assertion error with two MultipleAssertionErrors without any async', async () => {
        let errorNotThrown = true;
        try {
            await multiAssertAsync([
                () => expect(1).to.equal(2),
                () => expect(3).to.equal(3),
                () => expect(3).to.equal(4)
            ]);
        } catch (e) {
            errorNotThrown = false;
            const arrErrors = e.message.split('\n');
            expect(arrErrors[2]).to.contain('MultipleAssertionError: expected 1 to equal 2');
            expect(arrErrors[7]).to.contain('MultipleAssertionError: expected 3 to equal 4');
        }
        if(errorNotThrown)
            throw new AssertionError('expected [Function] to throw AssertionError');
    });

    it('should throw an assertion error with two MultipleAssertionErrors with two async', async () => {
        let errorNotThrown = true;
        try {
            await multiAssertAsync([
                async () => expect((JSON.parse(await fetchData())).status).to.equal('yellowblue'),
                () => expect(3).to.equal(3),
                async () => expect((JSON.parse(await fetchData())).status).to.equal('yellowred')
            ]);
        } catch (e) {
            errorNotThrown = false;
            const arrErrors = e.message.split('\n');
            expect(arrErrors[2]).to.contain('MultipleAssertionError: expected \'bluegreen\' to equal \'yellowblue\'');
            expect(arrErrors[7]).to.contain('MultipleAssertionError: expected \'bluegreen\' to equal \'yellowred\'');
        }
        if(errorNotThrown)
            throw new AssertionError('expected [Function] to throw AssertionError');
    });

    // the chai way doesn't work with async functions within the expect
    // xit('should throw an assertion error with one MultipleAssertionError', async () => {
    //     await expect(async () => {
    //         await multiAssertAsync([
    //             () => expect(1).to.equal(2),
    //             () => expect(3).to.equal(3),
    //             () => expect(4).to.equal(4)
    //         ]);
    //     //}).to.throw(AssertionError, 'MultipleAssertionError: expected 1 to equal 2');
    //     }).to.be.rejectedWith(AssertionError);//(AssertionError, 'MultipleAssertionError: expected 1 to equal 2');
    // });
});

const AssertionError = require('../src/assertion-error.js');
