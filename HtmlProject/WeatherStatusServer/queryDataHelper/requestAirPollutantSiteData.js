function getAirPollutantSiteData(response) {
    var http = require("http");
    var req = http.get('http://opendata.epa.gov.tw/ws/Data/AQXSite/?$orderby=SiteName&$skip=0&$top=1000&format=json', function (res) {
        console.log('Status: ' + res.statusCode);
        console.log('Headers: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        var resultString = "";
        res.on('data', function (body) {
            resultString = resultString + body;
            console.log('Receive data');
            //console.log(body);
            //response.write(body);
        });
        res.on('end', function () {
            console.log('Already end');
            response.write(resultString);
            SetAirPollutantSiteDataToDB(resultString);
            response.end();

        });
    });
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    getDBToAirPollutantSiteData(function (err, result) {
        if (!err) {
            var rstring = result;
            console.log(result);
        }
    });
}

function SetAirPollutantSiteDataToDB(jsonString) {
    //var getConnection = require("../connection");
    // var result = JSON.parse(resultString);
    // getConnection(function (err, db) {
    //     if (!err) {
    //         db.collection('AirPollutantSiteData', function (err, collection) {
    //             if (!err) {
    //                 collection.remove();
    //                 collection.insert(result);
    //                 console.log("AirPollutantSiteData insert success!");
    //             }
    //             else {
    //                 console.log("ErrorMessage:" + err.message);
    //             }
    //         });
    //     }
    // });
    var mongodb = require("../mongodb");
    var result = JSON.parse(jsonString);
    mongodb.remove("AirPollutantSiteData");
    mongodb.insert("AirPollutantSiteData", result);
    //mongodb.find("AirPollutantSiteData", "");
}

function getDBToAirPollutantSiteData(callback) {
    var mongodb = require("../mongodb");
    mongodb.findAll("AirPollutantSiteData", function (err, data) {
        if (!err) {
            data.toArray(function (err, docs) {
                if (!err) {
                    var jsonString = JSON.stringify(docs);
                    callback(err, jsonString);
                }
                else
                    callback(err, null);
            });
        }
    });
}


exports.getAirPollutantSiteData = getAirPollutantSiteData;