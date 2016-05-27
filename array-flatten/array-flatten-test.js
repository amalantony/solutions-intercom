var assert = require('chai').assert;
var flattenArray = require('./array-flatten.js');

var input, actual, expected;

describe("flattenArray", function () {
    it("should flatten the valid input nested array: [[1,2,[3]],4]", function () {
        input = [
            [1, 2, [3]], 4
        ];
        actual = flattenArray(input);
        expected = [1, 2, 3, 4];
        assert.sameMembers(actual, expected);
    });

    it("should flatten the valid input nested array: [[[[1], 2]], 3]", function () {
        input = [[[[1], 2]], 3];
        actual = flattenArray(input);
        expected = [1, 2, 3];
        assert.sameMembers(actual, expected);
    });

    it("should be able to handle an already flat array as input", function () {
        input = [1, 2, 3];
        actual = flattenArray(input);
        expected = input;
        assert.sameMembers(actual, expected);
    });

    it("should be able to handle an empty array as input", function () {
        input = [];
        actual = flattenArray(input);
        expected = input;
        assert.sameMembers(actual, expected);
    });

    it("should throw an error on being invoked without 0 arguments", function () {
        try {
            flattenArray();
        } catch (e) {
            assert.equal(e.message, "0 arguments or null value passed to flattenArray. Required: a single argument of type Array");
        }
    });

    it("should throw an error on being invoked with the wrong argument type", function () {
        try {
            flattenArray(1, 2);
        } catch (e) {
            assert.equal(e.message, "Invalid Input, required input of type Array, Recieved input of type: number");
        }
    });

    it("should throw an error on being invoked with a null value", function () {
        try {
            flattenArray(null);
        } catch (e) {
            assert.equal(e.message, "0 arguments or null value passed to flattenArray. Required: a single argument of type Array");
        }
    });
});