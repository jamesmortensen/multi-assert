// assertion-error.js

class AssertionError extends Error {
    constructor(message) {
        super(message);
        this.name = "AssertionError";
    }
}

module.exports = AssertionError;
