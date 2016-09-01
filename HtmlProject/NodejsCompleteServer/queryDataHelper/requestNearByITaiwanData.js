var WeatherReportTableName = "NearByITaiwan";
var DBHelper = require("./DBHelper/mongodHelper");
var BufferHelper = require('bufferhelper');

var iTaiwanDataArray;
var bookmarkArray;

var alreadtGotITaiwanData = false;
var alreadtGotBookmarkData = false;
var alreadyGotid;

var iTiwanDistance = 0.005;

function getNearByITaiwanData(response, targetid, targetLat, targetLon)
{
    // Trigger to get current weather status from database
    getBookmarks(response, targetid);
    alreadyGotid = targetid;

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
            iTaiwanDataArray = result;
            alreadtGotITaiwanData = true;
            generateFinalData(response);

            //var jsonString = JSON.stringify(result);
            //// Response the data back to client
            //if (response.connection) {
            //    response.write(jsonString);
            //    response.end();
            //}
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

function getBookmarks(response, targetid) {

    // Trigger to get all bookmarks location
    var tableName = "Bookmark";
    var data = {};
    if (targetid)
        data.id = targetid;
    var querykey = data;
    DBHelper.getLocationBookmark(tableName, querykey, function (err, item) {
        if (!err && item != null) {
            console.log(item);
            bookmarkArray = item;
            alreadtGotBookmarkData = true;
            generateFinalData(response);
        }
    });
}

function generateFinalData(response) {
    if (alreadtGotITaiwanData == true &&
        alreadtGotBookmarkData == true &&
        iTaiwanDataArray &&
        bookmarkArray
    ) {
        // Restore the status of these flags
        alreadtGotITaiwanData = false;
        alreadtGotBookmarkData = false;

        for (var Index = 0; Index < iTaiwanDataArray.length; Index++) {
            for (var bkIndex = 0; bkIndex < bookmarkArray.length; bkIndex++) {
                if (bookmarkArray[bkIndex].Addr == iTaiwanDataArray[Index].Name) {
                    iTaiwanDataArray[Index].isBookmark = true;
                    break;
                }
            }
        }
        // Serialize the object to json string
        var jsonString = JSON.stringify(iTaiwanDataArray);

        // Response the data back to client
        if (response.connection) {
            response.write(jsonString);
            response.end();
        }
    }
}

exports.getNearByITaiwanData = getNearByITaiwanData;