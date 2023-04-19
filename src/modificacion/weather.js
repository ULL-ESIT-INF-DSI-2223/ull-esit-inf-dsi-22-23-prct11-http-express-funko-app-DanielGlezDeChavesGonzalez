"use strict";
exports.__esModule = true;
exports.weatherInfo = void 0;
var request_1 = require("request");
var weatherInfo = function (location, callback) {
    var url = "http://api.weatherstack.com/current?access_key=9376141fdd275dd807c18e0c0d116220&query=".concat(location);
    (0, request_1["default"])({ url: url, json: true }, function (error, response) {
        if (error) {
            callback("Unable to connect to weather service!", undefined);
        }
        else if (response.body.error) {
            callback("Unable to find location", undefined);
        }
        else {
            callback(undefined, response);
        }
    });
};
exports.weatherInfo = weatherInfo;
