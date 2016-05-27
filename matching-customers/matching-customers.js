var process = require("process");
var readline = require("readline");
var fs = require("fs");

function processInput(filePath, distance, callback) {
    /* - Read the file, 
       - identify misformed inputs (incorrect JSON) and store them to results.malformedRecords
       - identify the correctly formatted records and store them to results.validRecrods
       - store list of valid customers to results.computedRecords
    */

    var lineReader = readline.createInterface({
        input: fs.createReadStream(filePath)
    });

    var results = {
        validRecords: [], // set of valid records on which computation can be run
        malformedRecords: [], // set of malformed records which can be displayed if debugging is enabled.
        computedRecords: [] // computed set of valid customers, this attribute is filled by the compute fuction.
    };

    lineReader.on("line", function (line) {
        try {
            var customer = JSON.parse(line);
            if (!customer.latitude || !customer.longitude || isNaN(parseFloat(customer.latitude)) || isNaN(customer.longitude)) {
                // console.log("Malformed line", line)
                results.malformedRecords.push(line);
            } else {
                results.validRecords.push(customer);
            }
        } catch (e) {
            // add record to malformedRecords
            results.malformedRecords.push(line);
        }
    });

    lineReader.on("close", function () {
        results.computedRecords = findCustomersWithinDistance(results.validRecords, distance);
        callback(results);
    });
}

exports.processInput = processInput;

function deg2rad(value) {
    /* Convert a co-ordinate from Degree to Radian */
    return value * Math.PI / 180;
}

function getDistaceFromDublinOfficeInKM(latitude, longitude) {
    /*
        Given a latitude and longitude of a place, compute the distance of the place from the Dublin Office.
        The Distance is computed using the Haversine formula: https://en.wikipedia.org/wiki/Haversine_formula
    */
    var officeCordinates = {
        latitude: 53.3381985,
        longitude: -6.2592576
    };

    var radiusOfEarth = 6371;
    var dLat = deg2rad(latitude - officeCordinates.latitude);
    var dLon = deg2rad(longitude - officeCordinates.longitude);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(officeCordinates.latitude)) * Math.cos(deg2rad(latitude)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return radiusOfEarth * c; // Distance in km
}

exports.getDistaceFromDublinOfficeInKM = getDistaceFromDublinOfficeInKM;

function findCustomersWithinDistance(customers, distance) {
    /*
       - Accepts a valid array of Customer records as input and returns the computed list of customers who live within 100 km of the Dublin office.
       - Compute the valid set of Customers from customers array, living within the distance using getDistaceFromDublinOfficeInKM
    */
    var customersWithinDistance = [];
    customers.forEach(function (customer) {
        if (getDistaceFromDublinOfficeInKM(customer.latitude, customer.longitude) <= 100) {
            customersWithinDistance.push(customer);
        }
    });
    return customersWithinDistance;
}

exports.findCustomersWithinDistance = findCustomersWithinDistance;

function displayResults(results, distance) {
    /*
        - If the system variable DEBUG is set to true, display the records having incorrectly formatted JSON.
        - Display the list of relevant customers, sorted by user_id
    */
    var debug = process.env.DEBUG || false;

    if (debug === "true" && process.env.NODE_ENV !== "test") {
        console.log("DEBUG set to true", debug, typeof debug);
        console.log("Malformed records:\n", results.malformedRecords);
    }

    var sortedRecords = results.computedRecords.sort(function (c1, c2) {
        return c1.user_id - c2.user_id;
    });
    if (process.env.NODE_ENV !== "test") {
        console.log("Customers living within", distance, "km, sorted by user_id:");
        console.log("-------");
        sortedRecords.forEach(function (customer) {
            console.log(customer.name, "|| User Id:", customer.user_id);
        });
    }
}

exports.displayResults = displayResults;

function init() {
    /* Entry point of the application */
    var distanceInKm = 100;
    var filePath = "./customers.json";
    processInput(filePath, distanceInKm, function (results) {
        displayResults(results, distanceInKm);
    });
}

init();