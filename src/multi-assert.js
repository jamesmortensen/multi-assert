// multi-assert.js


function multiAssert(functions) {

    const assertionErrors = [];

    functions.forEach((fn) => {
        try {
            fn();
        } catch (e) {
            const CR = assertionErrors.length === 0 ? '\n\n' : '\n';
            assertionErrors.push(CR + buildMultipleAssertionErrorMessage(e));
            assertionErrors[assertionErrors.length - 1] += getFirst3LinesOfStackTrace(e);
        }
    });

    if (assertionErrors.length > 0)
        throw new AssertionError(assertionErrors.join('\n') + '\n');
}

function buildMultipleAssertionErrorMessage(e) {
    return RED +
        '      ' +
        e.name.replace('AssertionError', 'MultipleAssertionError') +
        ': ' +
        e.message +
        BLACK;
}

function getFirst3LinesOfStackTrace(e) {
    return e.stack.split('\n').reduce((acc, stackMsg, index) => {
        if (index > 0 && index < 4)
            acc += LIGHT_GREY + '\n    ' + stackMsg + BLACK;
        return acc;
    }, '');
}

const RED = '\x1b[31m';
const LIGHT_GREY = '\x1b[90m';
const BLACK = '\x1b[0m';

const AssertionError = require('./assertion-error.js');
//const AssertionError = require('chai').AssertionError;

module.exports = multiAssert;
