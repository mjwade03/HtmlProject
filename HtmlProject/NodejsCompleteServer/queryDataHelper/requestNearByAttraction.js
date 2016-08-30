var NearByAttractionTableName = "NearByAttraction";
var DBHelper = require("./DBHelper/mongodHelper");
var BufferHelper = require('bufferhelper');
var $ = require("jquery");

var attractionArray;
var realTimeWeatherStatusArray;
var UVStatusArray;
var airStatusArray;

var alreadtGotAttractionData = false;
var alreadyGotRealTimeWeatherStatus = false;
var alreadyGotUVStatus = false;
var alreadyGotAirStatus = false;

var attractionDistance = 0.3;

function getNearByAttraction(response, targetLat, targetLon) {

    // Trigger to get current weather status from database
    getPositionTemp(response, targetLat, targetLon);
    getPositionUV(response, targetLat, targetLon);
    getPositionAirStatus(response, targetLat, targetLon);

    // Trigger to get all attraction location
    fs = require('fs')
    fs.readFile('AdditionalFile/special_poi_sec.xml', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        else {
            // Convert the data from xml to json
            var xml2js = require('xml2js'); // XML2JS Module
            var parser = new xml2js.Parser();

            // Replace special characters in xml
            var xml = data.replace(/[\n\r]/g, '\\n')
                .replace(/&/g, "&amp;")
                .replace(/\'/g, '&apos;')
                .replace(/\"/g, '&quot;')
                .replace(/-/g, "&#45;");

            // Parse array from xml string
            parser.parseString(xml, function (err, result) {
                if (result) {
                    var nearAttractions = [];
                    for (var index = 0; index < result.LIST.ITEM.length; index++) {
                        var currentLat = result.LIST.ITEM[index].PY[0];
                        var currentLon = result.LIST.ITEM[index].PX[0];
                        var distance = Math.abs(currentLat - targetLat) + Math.abs(currentLon - targetLon);
                        if (distance < attractionDistance) {
                            result.LIST.ITEM[index].Distance = distance;
                            nearAttractions.push(result.LIST.ITEM[index]);
                        }
                    }
                    attractionArray = nearAttractions;
                    alreadtGotAttractionData = true;
                    generateFinalData(response);
                }
                else {
                }

            });
        }
    });
}
function getPositionTemp(response)
{
    DBHelper.getCompleteTableFromDB("RealTimeWeatherStatus", function (err, data)
    {
        if (data)
        {
            realTimeWeatherStatusArray = JSON.parse(data)[0].cwbopendata.location;
            alreadyGotRealTimeWeatherStatus = true;
            generateFinalData(response);
        }
    }
    );
    
}

function getPositionUV(response)
{
    DBHelper.getCompleteTableFromDB("UVSite", function (err, data) {
        if (data) {
            UVStatusArray = JSON.parse(data);
            var gotUVCount = 0;
            for (var index = 0; index < UVStatusArray.length; index++)
            {
                UVStatusArray[index].UVI = "N/A";
                DBHelper.findSpecificDataInDB("UV", "SiteName", UVStatusArray[index].SiteName, function (err, findData)
                {
                    if (findData)
                    {
                        for (var i = 0; i < UVStatusArray.length; i++) {
                            if (UVStatusArray[i].SiteName == findData.SiteName) {
                                UVStatusArray[i].UVI = findData.UVI;
                                break;
                            }
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
function getPositionAirStatus(response)
{
    DBHelper.getCompleteTableFromDB("AirPollutantSite", function (err, data) {
        if (data) {
            airStatusArray = JSON.parse(data);
            var gotAirCount = 0;
            for (var index = 0; index < airStatusArray.length; index++) {
                airStatusArray[index].Status = "N/A";
                airStatusArray[index].PM2_5 = "N/A";
                DBHelper.findSpecificDataInDB("AirPollutant", "SiteName", airStatusArray[index].SiteName, function (err, findData) {

                    if (findData) {
                        for (var i = 0; i < airStatusArray.length; i++) {
                            if (airStatusArray[i].SiteName == findData.SiteName) {
                                airStatusArray[i].Status = findData.Status;
                                airStatusArray[i].PM2_5 = findData.PM2_5;
                                break;
                            }
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

function generateFinalData(response)
{
    if (alreadtGotAttractionData == true &&
        alreadyGotRealTimeWeatherStatus == true &&
        alreadyGotUVStatus == true &&
        alreadyGotAirStatus == true &&
        attractionArray &&
        realTimeWeatherStatusArray &&
        UVStatusArray &&
        airStatusArray
    )
    {
        // Restore the status of these flags
        alreadtGotAttractionData = false;
        alreadyGotRealTimeWeatherStatus = false;
        alreadyGotUVStatus = false;
        alreadyGotAirStatus = false;

        for (var attractionIndex = 0; attractionIndex < attractionArray.length; attractionIndex++)
        {
            var currentLat = attractionArray[attractionIndex].PY[0] * 1;
            var currentLon = attractionArray[attractionIndex].PX[0] * 1;

            // Find the nearest real time weather status site and keep the data to attraction array
            var minDistance = 999999;
            for (var weatherIndex = 0; weatherIndex < realTimeWeatherStatusArray.length; weatherIndex++)
            {
                var distance = Math.abs(currentLat - realTimeWeatherStatusArray[weatherIndex].lat[0] * 1) + Math.abs(currentLon - realTimeWeatherStatusArray[weatherIndex].lon[0] * 1);
                if (distance < minDistance) {
                    if (realTimeWeatherStatusArray[weatherIndex].weatherElement[4].elementValue[0].value[0] > 0)
                        attractionArray[attractionIndex].Temperature = realTimeWeatherStatusArray[weatherIndex].weatherElement[4].elementValue[0].value[0];

                }
            }

            // Find the nearest UVI site and keep the data to attraction array
            minDistance = 999999;
            for (var UVIndex = 0; UVIndex < UVStatusArray.length; UVIndex++)
            {
                var distance = Math.abs(currentLat - UVStatusArray[UVIndex].TWD97Lat * 1) + Math.abs(currentLon - UVStatusArray[UVIndex].TWD97Lon * 1);
                if (distance < minDistance)
                {
                    attractionArray[attractionIndex].UVI = UVStatusArray[UVIndex].UVI
                }
            }

            // Find the nearest air status site and keep the data to attraction array
            minDistance = 999999;
            for (var airIndex = 0; airIndex < airStatusArray.length; airIndex++) {
                var distance = Math.abs(currentLat - airStatusArray[airIndex].TWD97Lat * 1) + Math.abs(currentLon - airStatusArray[airIndex].TWD97Lon * 1);
                if (distance < minDistance) {
                    attractionArray[attractionIndex].AirStatus = airStatusArray[airIndex].Status;
                    attractionArray[attractionIndex].PM2_5 = airStatusArray[airIndex].PM2_5;
                }
            }


        }

        // Serialize the object to json string
        var jsonString = JSON.stringify(attractionArray);

        // Response the data back to client
        if (response.connection) {
            response.write(jsonString);
            response.end();
        }
    }    
}
exports.getNearByAttraction = getNearByAttraction;