// error-message-builder.js


module.exports = function buildErrorMessage(e, numErrors) {
    const CR = numErrors === 0 ? '\n\n' : '\n';
    const message = CR + buildMultipleAssertionErrorMessage(e) + getFirst3LinesOfStackTrace(e);
    return message;
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
