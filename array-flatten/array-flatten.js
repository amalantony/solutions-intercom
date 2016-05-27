function flattenArray(array) {
    if (!array) {
        throw new Error("0 arguments or null value passed to flattenArray. Required: a single argument of type Array");
    }
    if (!(array instanceof Array)) {
        throw new Error("Invalid Input, required input of type Array, Recieved input of type: " + typeof array);
    }
    //valid input, continue with processing
    var flattenedArray = [];

    array.forEach(function (elem) {
        if (elem instanceof Array) {
            var intermediateArray = flattenArray(elem);
            intermediateArray.forEach(function (el) {
                flattenedArray.push(el);
            });
        } else {
            flattenedArray.push(elem);
        }
    });
    return flattenedArray;
}

module.exports = flattenArray;