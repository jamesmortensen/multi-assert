# multi-assert

When using multiple assertions with chai's expect, the first failed assertion causes the entire test to stop executing. This means we don't get feedback on the other remaining assertions.

This module allows developers and testers to use multiple assertions in the same test and get feedback on all of the ones that would cause the test to fail, not just the first failed assertion encountered.

## Installation

Install `multi-assert` as a dev dependency in your project:

```bash
$ npm install multi-assert --save-dev
```

## Usage

Import multiAssert and/or multiAssertAsync into your spec files:

**CommonJS:**
```javascript
const { multiAssert, multiAssertAsync } = require('multi-assert');
```

**ESM:**
```javascript
import { multiAssert, multiAssertAsync } from 'multi-assert';
```

Wrap your existing assertions inside arrow functions, inside an array passed into multiAssert:

**Before:**
```javascript
    it('should expect 2 to be 2 and 3 to be 3', () => {
        expect(2).to.equal(2);
        expect(3).to.equal(3);
    });
```

**After:**
```javascript
    it('should expect 2 to be 2 and 3 to be 3', () => {
        multiAssert([
            expect(2).to.equal(2),
            expect(3).to.equal(3)
        ]);
    });
```

See the examples for more in-depth usage.

## Example Usage

NOTE: You can run many examples with `npm run example` by cloning this repository. See the `examples` folder.

For example, below is a test with 3 assertions. The first one will fail. However, since we're using `multiAssert`, results show that the first and third assertions fail.

```javascript
const { expect } = require('chai');
const { multiAssert } = require('multi-assert');

describe('Test', () => {
    it('should validate 2 equals 2 an 3 equals 3 and 4 equals 4', () => {
        multiAssert([
           () => expect(1).to.equal(2),
           () => expect(3).to.equal(3),
           () => expect(3).to.equal(4)
        ]);
    });
});
```

Here is the output, which shows the first and third assertions failing:

```
1) Test
       should validate 2 equals 2 an 3 equals 3 and 4 equals 4:
     AssertionError: 

      MultipleAssertionError: expected 1 to equal 2
        at /Users/user123/proj/example-mocha/test/example.spec.js:8:33
        at /Users/user123/proj/example-mocha/multi-assert.js:10:17
        at Array.forEach (<anonymous>)

      MultipleAssertionError: expected 3 to equal 4
        at /Users/user123/proj/example-mocha/test/example.spec.js:10:33
        at /Users/user123/proj/example-mocha/multi-assert.js:10:17
        at Array.forEach (<anonymous>)

      at multiAssert (multi-assert.js:23:19)
      at Context.<anonymous> (test/example.spec.js:7:9)
      at processImmediate (node:internal/timers:466:21)
```

This also works with should and assert:

```javascript
const should = require('chai').should();
const multiAssert = require('multi-assert').multiAssert;

    it('name should be an array, favColor should be orangepink, and name should be "James"', () => {    
        const name = 'James';
        const favColor = 'purplegreen';
        multiAssert([
            () => name.should.be.a('array'),
            () => favColor.should.equal('orangepink'),
            () => name.should.equal('James')
        ]);
    });
```

```javascript
const { assert } = require('chai');
const { multiAssert } = require('multi-assert');

describe('Test', () => {
    it('should validate 2 equals 2 an 3 equals 3 and 4 equals 4', () => {
        multiAssert([
            () => assert.equal(1, 2),
            () => assert.equal(3, 3),
            () => assert.equal(3, 4)
        ]);
    });
});
```

### Async mode

```javascript
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
```

Here is the output when using async mode:

```
1) Test - async/promises
       should expect status to be yellowblue, yellowred, bluegreen, and 3 to equal 4:
     AssertionError: 

      MultipleAssertionError: expected 3 to equal 4
        at /Users/user123/proj/multi-assert/examples/example-async.spec.js:17:32
        at /Users/user123/proj/multi-assert/multi-assert-async.js:12:27
        at Array.map (<anonymous>)

      MultipleAssertionError: expected 'bluegreen' to equal 'yellowblue'
        at /Users/user123/proj/multi-assert/examples/example-async.spec.js:16:75
        at async /Users/user123/proj/multi-assert/multi-assert-async.js:12:21
        at async Promise.all (index 0)

      MultipleAssertionError: expected 'bluegreen' to equal 'yellowred'
        at /Users/user123/proj/multi-assert/examples/example-async.spec.js:19:75
        at async /Users/user123/proj/multi-assert/multi-assert-async.js:12:21
        at async Promise.all (index 3)

      at /Users/user123/proj/multi-assert/multi-assert-async.js:22:23
```

### Banking Example - Withdraw $100

In this example, we group assertions by whether or not they validate the test case is ready to be executed or whether or not the test case has executed successfully and given us the expected output conditions.

Note that the first set of assertions could also be added to a beforeEach hook if other tests rely on the system being in the same state of having an initial $110 balance with a max withdrawal amount of $2000.

```javascript
describe('Withdraw Tests', () => {
    it('should successfully withdraw $100 from an account with $110 balance', () => {
         
        /*  arrange - If the account is not in a state where it has a $100 balance, 
                      AND where we can withdraw $100 in a single transaction, we fail
                      the test. If any assertion fails or if both fail, we see BOTH
                      failure conditions. */
        const accountService = new AccountService(process.env.TEST_TOKEN);
        accountService.setBalance(110);
        multiAssert([
            () => expect(accountService.getAccountBalance()).to.equal(110),
            () => expect(accountService.getMaxWithdrawalAmount()).to.equal(2000)
        ]);

        /* act - Perform the action we want to test */
        const transactionResult = accountService.withdrawAmount(100);

        /* assert - Validate that the account balance is now $100 less and that the
                    transaction was marked as a success. If the account is not in the
                    right state, we fail the test. Even if both conditions fail, we
                    see BOTH failure conditions. */
        multiAssert([
            () => expect(accountService.getAccountBalance()).to.equal(10),
            () => expect(transactionResult).to.equal('success')
        ]);
    });
}
```

## Use Cases

### When to use the multi-assert module

#### API Testing

With API testing, we oftentimes want to examine more than one property in the request payload. It may not make sense to repeat the test N times for each N assertions, especially when we're most interested in examining the payload as a whole, either being correct or not correct. For instance, if we wish to assert that a status code equals 401 and that there is an error message stating "Unauthorized", we can catch validate both properties regardless of its position in the control flow.

#### UI Testing

When testing a user interface with tools like SeleniumJS, WebdriverIO, and other testing frameworks, we oftentimes need to confirm that performing operation X results in the state of the system being Y, where Y may be a combination of different things.

#### Unit Tests

While unit tests are typically smaller and more focused than API and UI tests, there may be multiple properties affected by performing a single operation, and we may want to validate all of those properties.

### On Arrange, Act, Assert and Failing Fast

Don't put all of your assertions in a single assertMulti if you intend for the test to fail fast.

The typical structure of a test case is outlined by the 3 A's, Arrange, Act, Assert.

- Arrange: In this section, we setup the necessary state of the application in order to run the test case steps. For instance, we may need to populate an entity object with specific data, or we may need to confirm that a certain setting is first enabled _before_ executing the part of the code we want to test. If we're testing the withdraw logic for a bank account and whether or not $100 can be withdrawn succcessfully, we first need to make sure our test account has at least $100 in it; otherwise, we cannot execute the test.

- Act: In this part of the test case, we execute the code that we want to test. For example, we might execute a method such as `withdrawAmount(100)`. This method changes the state of the system and may also return a value. We validate the state of the system in the next section.

- Assert: In this section, we validate that the operation performed in the "Act" part of the test case has put the system in the desired state. For example, `withdrawAmount(100)` should have returned `true` and `getAccountBalance()` should return 10, assuming we asserted in the "Arrange" section that the original balance was $110.

Sometimes we use assertions to validate that the "arrange" part of arrange, act, assert is setup correctly, and we may use an assertion to first validate the state of the system prior to running the test. If an assertion which is intended to validate that a test is _ready_ instead tells us that a test is _not_ ready, we probably do not want to execute the test, and multi-assert may get in the way of failing fast. 

For example, in the banking example, if our test account doesn't have a starting balance of $110, then we're not ready to execute the test. If we did execute it, it would fail, not because of logic problems or bugs in the `withdrawAmount` section but simply because the system is not in the desired state.

In the "Arrange" section, if there is more than one condition to check to validate the test is ready to be executed, we might consider grouping all of those "arrange" assertions together in a separate assertMulti block so that we know if there are other reasons that the test is not ready to be executed.

In the "Assert" section, we could then group all of the assertions together which validate that the system state has changed as expected. If one or more fail, we will see this in the reporter.

### On Keeping Tests Small and Focused

Using multiple assertions in a test case can be a sign that a test is doing too many things. Before using this module, ask yourself if your test could be further broken down so that it's doing less. For instance, if we're checking `add(2,5)` and `subtract(5,2)` in the same test case, and then asserting that the first method call returns 7 and the second returns 3, then we may get more value out of our test failures if we break this up into two completely different tests with their own separate assertions:

**Yes**
```javascript
    it('should validate 2 + 5 = 7', () => {
        expect(add(2,5)).to.equal(7);
    });

    it('should validate 5 - 2 = 3', () => {
        expect(subtract(5,2)).to.equal(3);
    });
```

**No: Split this test case up into two test cases**
```javascript
    it('should validate 2 + 5 = 7 and should validate 5 - 2 = 3', () => {
        multiAssert([
            () => expect(add(2,5)).to.equal(7),
            () => expect(subtract(5,2)).to.equal(3)
        ]);
    });
```

### Differences between chaining and multiple assertions

Let's look at how assertMulti is different from language chaining in Chai, and other assertion libraries  With chai, we can chain assertions like so:

```javascript
expect(name).to.be.a('number').and.equal('james');
```

or 

```javascript
const name = "James";
name.should.be.a('number').and.equal('james');
```

While this may look like it's doing the same thing as assertMulti, it suffers from the same problem as using assertions that execute line by line. They fail too fast; we only get feedback on the first assertion. What's more, we're only asserting properties of the same variable. With assert-multi, we can check the state of the system from multiple angles and get all of the feedback.

## How it works

Basically, multiAssert takes an array of functions and then executes each one of them in a loop. If one throws an AssertionError, multi-assert catches it and stores the error message and stack trace. Once all of the assertions have been executed, if there is at least one failure, we re-throw the AssertionError with all of the information about each failure.

## Using with other testing frameworks

### Jest

multi-assert is built with Chai's assertions in mind, used in combination with Mocha. However, because the module just executes whatever assertions are passed to it, it will also likely work with other testing frameworks. For example, it works with Jest's assertions, and it also works with Chai as a replacement to Jest's own assertions. It also works with WebdriverIO's expect assertions. It may work with other testing frameworks as well. 

### Jasmine

If you're using Jasmine, you don't need this library. Jasmine already executes all of the assertions before reporting the errors.

### WebdriverIO

This example uses a combination of Chai assertions with WebdriverIO's own expect assertion library, using multiAssertAsync:

```javascript
const { chaiExpect } = require('chai');
const { multiAssertAsync } = require('multi-assert');

describe('UI Tests', () => {

    it('should validate 2 equals 2 an 3 equals 3 and 4 equals 4, on webdriver.io/async', async () => {
        await browser.url('http://example.com');
        await multiAssertAsync([
            () => chaiExpect(1).to.equal(2),
            () => chaiExpect(3).to.equal(3),
            () => chaiExpect(3).to.equal(4),
            async () => await expect(browser).toHaveUrl('https://webdriver.io/async')
        ]);
    });
});
```

Here's the output showing the first, third, and fourth assertion failing:

```
[chrome 107.0.5304.110 mac os x #0-0] AssertionError: 
[chrome 107.0.5304.110 mac os x #0-0]
[chrome 107.0.5304.110 mac os x #0-0]       MultipleAssertionError: expected 1 to equal 2
[chrome 107.0.5304.110 mac os x #0-0]         at /Users/user123/proj/wdio-test/test/example.spec.js:9:36
[chrome 107.0.5304.110 mac os x #0-0]         at /Users/user123/proj/multi-assert/multi-assert-async.js:12:27
[chrome 107.0.5304.110 mac os x #0-0]         at Array.map (<anonymous>)
[chrome 107.0.5304.110 mac os x #0-0]
[chrome 107.0.5304.110 mac os x #0-0]       MultipleAssertionError: expected 3 to equal 4
[chrome 107.0.5304.110 mac os x #0-0]         at /Users/user123/proj/wdio-test/test/example.spec.js:11:36
[chrome 107.0.5304.110 mac os x #0-0]         at /Users/user123/proj/multi-assert/multi-assert-async.js:12:27
[chrome 107.0.5304.110 mac os x #0-0]         at Array.map (<anonymous>)
[chrome 107.0.5304.110 mac os x #0-0]
[chrome 107.0.5304.110 mac os x #0-0]       Error: Expect window to have url
[chrome 107.0.5304.110 mac os x #0-0]
[chrome 107.0.5304.110 mac os x #0-0] Expected: "https://webdriver.io/async"
[chrome 107.0.5304.110 mac os x #0-0] Received: "http://example.com/"
[chrome 107.0.5304.110 mac os x #0-0]     
[chrome 107.0.5304.110 mac os x #0-0]     Expected: "https://webdriver.io/async"
[chrome 107.0.5304.110 mac os x #0-0]     Received: "http://example.com/"
[chrome 107.0.5304.110 mac os x #0-0]
[chrome 107.0.5304.110 mac os x #0-0]     at /Users/user123/proj/multi-assert/multi-assert-async.js:22:23
```

## Contributions

If you run into any issues, please report them in the issue tracker, ideally with some way to replicate the issue. Pull requests are also welcome, but I recommend first opening an issue to discuss the proposed changes to ensure that the work done will be more likely to be accepted.

### Unit Tests


## License

Copyright (c) James Mortensen, 2022 MIT License
