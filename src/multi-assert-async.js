// multi-assert-async.js


async function multiAssertAsync(functions) {
    return new Promise((resolve, reject) => {

        const assertionErrors = [];

        Promise.all(
            functions.map(async (fn, index, arr) => {
                try {
                    await fn();
                } catch (e) {
                    //console.error('inside lib catch only if chai assert fails')
                    const CR = assertionErrors.length === 0 ? '\n\n' : '\n';
                    assertionErrors.push(CR + buildMultipleAssertionErrorMessage(e));
                    assertionErrors[assertionErrors.length - 1] += getFirst3LinesOfStackTrace(e);
                }
            })
        ).then((res) => {
            if (assertionErrors.length > 0)
                throw new AssertionError(assertionErrors.join('\n') + '\n');
            //console.log(res);
            resolve(res);
        }).catch((err) => {
            //console.error(err);
            reject(err);
        });
    });

};




async function multiAssertR(functions) {

    const assertionErrors = [];

    await functions.forEach(async (fn) => {
        try {
            console.log(fn);
            if (typeof fn === 'function')
                await fn();
        } catch (e) {
            console.error('inside lib catch only if chai assert fails')
            const CR = assertionErrors.length === 0 ? '\n\n' : '\n';
            assertionErrors.push(CR + buildMultipleAssertionErrorMessage(e));
            assertionErrors[assertionErrors.length - 1] += getFirst3LinesOfStackTrace(e);
        }
    });
    console.log('length= ' + assertionErrors.length)
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

module.exports = multiAssertAsync;
