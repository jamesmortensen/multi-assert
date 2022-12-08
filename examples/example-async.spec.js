const { expect } = require('chai');
const { multiAssertAsync } = require('../index.js');

describe('Test - async/promises', () => {
    
    async function fetchData() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('{"status":"bluegreen"}');
            }, 300)
        });
    }

    it('should expect status to be yellowblue, yellowred, bluegreen, and 3 to equal 4', async () => {
        await multiAssertAsync([
            async () => expect((JSON.parse(await fetchData())).status).to.equal('yellowblue'),
            () => expect(3).to.equal(4),
            async () => expect((JSON.parse(await fetchData())).status).to.equal('bluegreen'),
            async () => expect((JSON.parse(await fetchData())).status).to.equal('yellowred')
        ]);
    });
});
