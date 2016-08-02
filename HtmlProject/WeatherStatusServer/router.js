﻿// 來源為Json的資料
var UVData = require("./queryDataHelper/requestUVData");
var UVDataSite = require("./queryDataHelper/requestUVSiteData");
var AirPollutantData = require("./queryDataHelper/requestAirPollutantData");
var AirPollutantDataSite = require("./queryDataHelper/requestAirPollutantSiteData");

// 來源為xml的資料
var RealTimeWeatherStatusData = require("./queryDataHelper/requestRealTimeWeatherStatusData");
var LittleHelpData = require("./queryDataHelper/requestLittleHelperData");

// 來源為html的資料
var WeatherReportData = require("./queryDataHelper/requestWeatherReportData");

var MainPage = require("./queryDataHelper/displayMainPage");

function route(pathname, response) {
    var requestType = pathname.split("&");
    switch (requestType[0])
    {
        case "/UV":
            UVData.getUVData(response);
            break;
        case "/UVSite":
            UVDataSite.getUVSiteData(response);
            //console.log("Route this request: " + requestType[0]);
            break;
        case "/AirPollutant":
            AirPollutantData.getAirPollutantData(response);
            //console.log("Route this request: " + requestType[0]);
            break;
        case "/AirPollutantSite":
            AirPollutantDataSite.getAirPollutantSiteData(response);
            //console.log("Route this request: " + requestType[0]);
            break;
        case "/RealTimeWeatherStatus":
            RealTimeWeatherStatusData.getRealTimeWeatherStatusData(response);
           // console.log("Route this request: " + requestType[0]);
            break;
        case "/LittleHelper":
            var targetXml = requestType[1].split("=")[1];
            LittleHelpData.getLittleHelperData(response, targetXml);
            console.log("Route this request: " + requestType[0]);
            console.log("With parameter: " + targetXml);
            break;
        case "/WeatherReport":
            var targetCity = requestType[1].split("=")[1];
            WeatherReportData.getWeatherReportData(response, targetCity);
            console.log("Route this request: " + requestType[0]);
            console.log("With parameter: " + targetCity);
            break;
        case "/MainPage":
            MainPage.getMainPage(response);
            break;
        default:
            break;
    }
}

exports.route = route;