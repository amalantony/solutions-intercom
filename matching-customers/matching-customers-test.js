// test for malformed JSON 
// test for customer records without latitude or longitude.
// test for invalid values of latitude or longitude

// test for file read correctly. 
// test for a customer within 100km
// test for a customer outside 100km

//test individual functions 

var assert = require('chai').assert;
process.env.NODE_ENV = 'test';

var imports = require("./matching-customers.js");
var results;
var actual, expected;

describe("matching-customers ", function () {
    before(function (done) {
        imports.processInput('./customers-test.json', 100, function (r) {
            results = r;
            done();
        });
    });

    it(".processInput should read from the given path and store malformed customer records into results.malformedRecords", function () {
        actual = results.malformedRecords;
        expected = ['{"latitude": "hello", "user_id": 12, "name": "Christina McArdle", "longitude": "-6.043701"}',
            '{"latitude": "51.92893" "user_id": 1, "name": "Alice Cahill", "longitude": "-10.27699"}'
        ];
        for (i = 0; i < actual.length; i++) {
            assert.equal(actual[i], expected[i]);
        }
    });

    it(".processInput should store valid customer records into results.validRecords", function () {
        actual = results.validRecords;
        expected = [{
            latitude: '53.2451022',
            user_id: 4,
            name: 'Ian Kehoe',
            longitude: '-6.238335'
        }, {
            latitude: '51.8856167',
            user_id: 2,
            name: 'Ian McArdle',
            longitude: '-10.4240951'
        }];
        for (i = 0; i < actual.length; i++) {
            assert.deepEqual(actual[i], expected[i]);
        }
    });

    it(".processInput should call findCustomersWithinDistance to find all customers within the given distance and store it in results.computedRecords",
        function () {
            actual = results.computedRecords;
            expected = [{
                latitude: '53.2451022',
                user_id: 4,
                name: 'Ian Kehoe',
                longitude: '-6.238335'
            }];
            for (i = 0; i < actual.length; i++) {
                assert.deepEqual(actual[i], expected[i]);
            }
        }
    );
});

describe("getDistaceFromDublinOfficeInKM", function() {
    it("should return the correct distance from Dublin to the given location", function() {
       expected = 41.67683909574448;
       actual = imports.getDistaceFromDublinOfficeInKM(52.986375, -6.043701);
       assert.equal(actual, expected);
    });
});