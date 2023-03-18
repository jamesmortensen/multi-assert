// multi-assert-async.js

const buildErrorMessage = require('./error-message-builder.js');


async function multiAssertAsync(functions) {
    return new Promise((resolve, reject) => {

        const assertionErrors = [];

        Promise.all(
            functions.map(async (fn, index, arr) => {
                try {
                    await fn();
                } catch (e) {
                    assertionErrors.push(buildErrorMessage(e, assertionErrors.length));
                }
            })
        ).then((res) => {
            if (assertionErrors.length > 0)
                throw new AssertionError(assertionErrors.join('\n') + '\n');
            resolve(res);
        }).catch((err) => {
            reject(err);
        });
    });
};


const AssertionError = require('./assertion-error.js');

module.exports = multiAssertAsync;
