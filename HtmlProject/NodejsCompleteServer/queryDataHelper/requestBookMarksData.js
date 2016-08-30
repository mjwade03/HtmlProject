var mongodb = require("../mongodb");
var DBHelper = require("./DBHelper/mongodHelper");
var tableName = "Bookmark";

var bookmarkArray;
var realTimeWeatherStatusArray;
var UVStatusArray;
var airStatusArray;

var alreadtGotBookmarkData = false;
var alreadyGotRealTimeWeatherStatus = false;
var alreadyGotUVStatus = false;
var alreadyGotAirStatus = false;


function getBookmarks(response, targetid, targetAddr, targetLat, targetLon) {

    // Trigger to get current weather status from database
    getPositionTemp(response);
    getPositionUV(response);
    getPositionAirStatus(response);

    // Trigger to get all bookmarks location
    var data = {};
    if (targetid)
        data.id = targetid;
    if (targetAddr)
        data.Addr = targetAddr;
    if (targetLat)
        data.Lat = targetLat;
    if (targetLon)
        data.Lon = targetLon;
    var querykey = data;
    mongodb.findDatas(tableName, querykey, function (err, item) {
        if (!err && item != null) {
            console.log(item);
            //var bookmarks = [];
            //for (var i in item) {
            //    bookmarks.push([item[i]]);
            //}
            bookmarkArray = item;
            alreadtGotBookmarkData = true;
            generateFinalData(response);
        }
    });
}

function getPositionTemp(response) {
    DBHelper.getCompleteTableFromDB("RealTimeWeatherStatus", function (err, data) {
        if (data) {
            realTimeWeatherStatusArray = JSON.parse(data)[0].cwbopendata.location;
            alreadyGotRealTimeWeatherStatus = true;
            generateFinalData(response);
        }
    }
    );

}

function getPositionUV(response) {
    DBHelper.getCompleteTableFromDB("UVSite", function (err, data) {
        if (data) {
            UVStatusArray = JSON.parse(data);
            var gotUVCount = 0;
            for (var index = 0; index < UVStatusArray.length; index++) {
                DBHelper.findSpecificDataInDB("UV", "SiteName", UVStatusArray[index].SiteName, function (err, findData) {

                    for (var i = 0; i < UVStatusArray.length; i++) {
                        if (UVStatusArray[i].SiteName == findData.SiteName) {
                            UVStatusArray[i].UVI = findData.UVI;
                            break;
                        }
                    }

                    gotUVCount++;

                    // To make sure all the UV array have been processed
                    if (gotUVCount == UVStatusArray.length) {
                        alreadyGotUVStatus = true;
                        generateFinalData(response);
                    }
                }
                );
            }

        }
    }
    );
}
function getPositionAirStatus(response) {
    DBHelper.getCompleteTableFromDB("AirPollutantSite", function (err, data) {
        if (data) {
            airStatusArray = JSON.parse(data);
            var gotAirCount = 0;
            for (var index = 0; index < airStatusArray.length; index++) {
                DBHelper.findSpecificDataInDB("AirPollutant", "SiteName", airStatusArray[index].SiteName, function (err, findData) {

                    for (var i = 0; i < airStatusArray.length; i++) {
                        if (airStatusArray[i].SiteName == findData.SiteName) {
                            airStatusArray[i].Status = findData.Status;
                            airStatusArray[i].PM2_5 = findData.PM2_5;
                            break;
                        }
                    }

                    gotAirCount++;

                    // To make sure all the air array have been processed
                    if (gotAirCount == airStatusArray.length) {
                        alreadyGotAirStatus = true;
                        generateFinalData(response);
                    }
                }
                );
            }
        }
    }
    );
}

function generateFinalData(response) {
    if (alreadtGotBookmarkData == true &&
        alreadyGotRealTimeWeatherStatus == true &&
        alreadyGotUVStatus == true &&
        alreadyGotAirStatus == true &&
        bookmarkArray &&
        realTimeWeatherStatusArray &&
        UVStatusArray &&
        airStatusArray
    ) {
        // Restore the status of these flags
        alreadtGotBookmarkData = false;
        alreadyGotRealTimeWeatherStatus = false;
        alreadyGotUVStatus = false;
        alreadyGotAirStatus = false;

        for (var bookmarkIndex = 0; bookmarkIndex < bookmarkArray.length; bookmarkIndex++) {
            var currentLat = bookmarkArray[bookmarkIndex].Lat;
            var currentLon = bookmarkArray[bookmarkIndex].Lon;

            // Find the nearest real time weather status site and keep the data to attraction array
            var minDistance = 999999;
            for (var weatherIndex = 0; weatherIndex < realTimeWeatherStatusArray.length; weatherIndex++) {
                var distance = Math.abs(currentLat - realTimeWeatherStatusArray[weatherIndex].lat[0] * 1) + Math.abs(currentLon - realTimeWeatherStatusArray[weatherIndex].lon[0] * 1);
                if (distance < minDistance) {
                    if (realTimeWeatherStatusArray[weatherIndex].weatherElement[4].elementValue[0].value[0] > 0)
                        bookmarkArray[bookmarkIndex].Temperature = realTimeWeatherStatusArray[weatherIndex].weatherElement[4].elementValue[0].value[0];

                }
            }

            // Find the nearest UVI site and keep the data to attraction array
            minDistance = 999999;
            for (var UVIndex = 0; UVIndex < UVStatusArray.length; UVIndex++) {
                var distance = Math.abs(currentLat - UVStatusArray[UVIndex].TWD97Lat * 1) + Math.abs(currentLon - UVStatusArray[UVIndex].TWD97Lon * 1);
                if (distance < minDistance) {
                    bookmarkArray[bookmarkIndex].UVI = UVStatusArray[UVIndex].UVI
                }
            }

            // Find the nearest air status site and keep the data to attraction array
            minDistance = 999999;
            for (var airIndex = 0; airIndex < airStatusArray.length; airIndex++) {
                var distance = Math.abs(currentLat - airStatusArray[airIndex].TWD97Lat * 1) + Math.abs(currentLon - airStatusArray[airIndex].TWD97Lon * 1);
                if (distance < minDistance) {
                    bookmarkArray[bookmarkIndex].AirStatus = airStatusArray[airIndex].Status;
                    bookmarkArray[bookmarkIndex].PM2_5 = airStatusArray[airIndex].PM2_5;
                }
            }


        }

        // Serialize the object to json string
        var jsonString = JSON.stringify(bookmarkArray);

        // Response the data back to client
        if (response.connection) {
            response.write(jsonString);
            response.end();
        }
    }
}

exports.getBookmarks = getBookmarks;
