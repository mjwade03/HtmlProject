var WeatherReportTableName = "NearByITaiwan";
var DBHelper = require("./DBHelper/mongodHelper");
var BufferHelper = require('bufferhelper');

var iTiwanDistance = 0.005;

function getNearByITaiwanData(response, targetLat, targetLon)
{
    fs = require('fs')
    fs.readFile('AdditionalFile/hotspotlist.csv', 'utf8', function (err, data) {
        console.log(""); 
        console.log("=================================================");
        console.log('Response from near by iTaiwan hotspot request');
        if (err) {            
            console.log('Error happened when load local file: ' + err);
        }
        else {
            var resultString = data.replace(/\"/g, '');
            var result = ConvertCSV2JsonObject(resultString, targetLat, targetLon);
            console.log("There are " + result.length + " iTaiwan hot spot near by the request position");
            var jsonString = JSON.stringify(result);
            // Response the data back to client
            if (response.connection) {
                response.write(jsonString);
                response.end();
            }
        }
        console.log("=================================================");
        console.log("");
    });        
    
}
function ConvertCSV2JsonObject(csvString, targetLat, targetLon)
{
    var lines = csvString.split("\r\n");

    var result = [];

    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {

        var obj = {};
        var currentline = lines[i].split(",");

        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        var currentLat = obj[headers[4]];
        var currentLon = obj[headers[5]];
        var distance = Math.abs(currentLat - targetLat) + Math.abs(currentLon - targetLon);
        if (distance <= iTiwanDistance) {
            obj.Distance = distance;
            result.push(obj);
        }
    }
    return result;
}

exports.getNearByITaiwanData = getNearByITaiwanData;