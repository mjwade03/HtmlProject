function getUVData(response)
{
            var http = require("http");
            var req = http.get('http://opendata.epa.gov.tw/ws/Data/UV/?$orderby=PublishTime%20desc&$skip=0&$top=1000&format=json', function (res) {
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
                    SetUVDataToDB(resultString);
                    response.end();
                });
            });
            req.on('error', function (e) {
                console.log('problem with request: ' + e.message);
            });

            getDBToUVData(function (err, result) {
                if (!err) {
                    var rstring = result;
                    console.log(result);
                }
            });
}

function SetUVDataToDB(jsonString) {
    var mongodb = require("../mongodb");
    var result = JSON.parse(jsonString);
    mongodb.remove("UVData");
    mongodb.insert("UVData", result);
    mongodb.find("UVData", "SiteName", "臺北", function (err, item) {
        console.log(item);
    });
    // mongodb.findAll("UVData", function (err, data) {
    //     data.each(function (err, doc) {
    //         if (!err) 
    //             console.log(doc);
    //     });
    // });
}

function getDBToUVData(callback) {
    var mongodb = require("../mongodb");
    mongodb.findAll("UVData", function (err, data) {
        if (!err) {
            data.toArray(function(err, docs){
                if (!err) {
                    var jsonString = JSON.stringify(docs);
                    callback(err, jsonString);
                }
                else
                    callback(err, null);
            });
            //data.each(function (err, doc) {
            //    if (!err) 
            //        console.log(doc);
            //});
        }
     });
}

exports.getUVData = getUVData;