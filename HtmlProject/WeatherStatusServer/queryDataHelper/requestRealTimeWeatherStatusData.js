var getConnection = require("../connection");

function getRealTimeWeatherStatusData(response) {
    var http = require("http");
    var req = http.get('http://opendata.cwb.gov.tw/opendata/DIV2/O-A0003-001.xml', function (res) {
        console.log('Status: ' + res.statusCode);
        console.log('Headers: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        var resultString = "";
        res.on('data', function (body) {
            resultString = resultString + body.toString();
            console.log('Receive data');
            //console.log(body);
            //response.write(body);
        });
        res.on('end', function () {
            
            console.log('Already end');

            var xml2js = require('xml2js'); // XML2JS Module
            var parser = new xml2js.Parser(); 
            //var xml = "<root>" + resultString.toString() + "</root>";
            parser.parseString(resultString, function (err, result) {
                //console.log(result.cwbopendata.location);
                response.write(JSON.stringify(result));
                var jsonresult = JSON.stringify(result);
                SetRealTimeWeatherStatusDataToDB(jsonresult)
                response.end();
            });
            
        });
    });
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    getDBToRealTimeWeatherStatusData(function (err, result) {
        if (!err) {
            var rstring = result;
            console.log(result);
        }
    });

}

function SetRealTimeWeatherStatusDataToDB(jsonString) {
    //var getConnection = require("../connection");
    // var result = JSON.parse(jsonString);
    // getConnection(function (err, db) {
    //     if (!err) {
    //         db.collection('RealTimeWeatherStatusData', function (err, collection) {
    //             if (!err) {
    //                 collection.remove();
    //                 collection.insert(result);
    //                 console.log("RealTimeWeatherStatusData insert success!");
    //             }
    //             else {
    //                 console.log("ErrorMessage:" + err.message);
    //             }
    //         });
    //     }
    // });
    var mongodb = require("../mongodb");
    jsonString = jsonString.replace("$", "DollarSign");
    var result = JSON.parse(jsonString);
    mongodb.remove("RealTimeWeatherStatusData");
    mongodb.insert("RealTimeWeatherStatusData", result);
    //mongodb.find("RealTimeWeatherStatusData", "");
}

function getDBToRealTimeWeatherStatusData(callback) {
    var mongodb = require("../mongodb");
    mongodb.findAll("RealTimeWeatherStatusData", function (err, data) {
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



exports.getRealTimeWeatherStatusData = getRealTimeWeatherStatusData;