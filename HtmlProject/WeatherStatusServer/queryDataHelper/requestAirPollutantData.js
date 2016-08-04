function getAirPollutantData(response)
{
            var http = require("http");
            var req = http.get('http://opendata.epa.gov.tw/ws/Data/REWXQA/?$orderby=SiteName&$skip=0&$top=1000&format=json', function (res) {
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
                    SetAirPollutantDataToDB(resultString);
                    response.end();

                });
            });
            req.on('error', function (e) {
                console.log('problem with request: ' + e.message);
            });

            getDBToAirPollutantData(function (err, result) {
                if (!err) {
                    var rstring = result;
                    console.log(result);
                }
            });

}

function SetAirPollutantDataToDB(jsonString) {
    var mongodb = require("../mongodb");
    jsonString = jsonString.replace(/PM2.5/g, "PM2_5");
    var result = JSON.parse(jsonString);
    mongodb.remove("AirPollutantData");
    mongodb.insert("AirPollutantData", result);
    //mongodb.find("AirPollutantData", "");
}

function getDBToAirPollutantData(callback) {
    var mongodb = require("../mongodb");
    mongodb.findAll("AirPollutantData", function (err, data) {
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


exports.getAirPollutantData = getAirPollutantData;