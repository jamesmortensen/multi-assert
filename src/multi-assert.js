// multi-assert.js

const buildErrorMessage = require('./error-message-builder.js');


function multiAssert(functions) {

    const assertionErrors = [];

    functions.forEach((fn) => {
        try {
            fn();
        } catch (e) {
            assertionErrors.push(buildErrorMessage(e, assertionErrors.length));
        }
    });

    if (assertionErrors.length > 0)
        throw new AssertionError(assertionErrors.join('\n') + '\n');
}


const AssertionError = require('./assertion-error.js');

module.exports = multiAssert;
