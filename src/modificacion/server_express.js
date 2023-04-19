"use strict";
exports.__esModule = true;
var express_1 = require("express");
var weather_1 = require("./weather");
var app = (0, express_1["default"])();
app.get('/weather', function (req, res) {
    var location = req.query.location;
    (0, weather_1.weatherInfo)(location, function (error, data) {
        if (error) {
            res.send({ error: error });
        }
        else {
            res.send({ data: data });
        }
    });
});
app.listen(3000, function () {
    console.log('Server is up on port 3000.');
});
