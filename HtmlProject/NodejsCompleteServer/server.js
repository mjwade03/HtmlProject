var http = require('http');
var express = require('express');
var path = require('path');


// 來源為Json的資料
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




var app = express();


//var server = http.createServer(app);




app.get('/', function (request, response) { //我們要處理URL為 "/" 的HTTP GET請求
    response.sendFile(__dirname + '/MainPage.html');
});



app.get('/UV', function (request, response) { //我們要處理URL為 "/" 的HTTP GET請求
    response.writeHead(200, { "Access-Control-Allow-Origin": "*" });
    UVData.getUVData(response);
});
app.get('/UVSite', function (request, response) { //我們要處理URL為 "/" 的HTTP GET請求
    response.writeHead(200, { "Access-Control-Allow-Origin": "*" });
    UVDataSite.getUVSiteData(response);
});
app.get('/AirPollutant', function (request, response) { //我們要處理URL為 "/" 的HTTP GET請求
    response.writeHead(200, { "Access-Control-Allow-Origin": "*" });
    AirPollutantData.getAirPollutantData(response);
});
app.get('/AirPollutantSite', function (request, response) { //我們要處理URL為 "/" 的HTTP GET請求
    response.writeHead(200, { "Access-Control-Allow-Origin": "*" });
    AirPollutantDataSite.getAirPollutantSiteData(response);
});
app.get('/RealTimeWeatherStatus', function (request, response) { //我們要處理URL為 "/" 的HTTP GET請求
    response.writeHead(200, { "Access-Control-Allow-Origin": "*" });
    RealTimeWeatherStatusData.getRealTimeWeatherStatusData(response);
});
app.get('/LittleHelper', function (request, response) { //我們要處理URL為 "/" 的HTTP GET請求
    response.writeHead(200, { "Access-Control-Allow-Origin": "*" });
    var ID = request.query.ID;
    LittleHelpData.getLittleHelperData(response, ID);
    console.log("With parameter: " + ID);
});
app.get('/WeatherReport', function (request, response) { //我們要處理URL為 "/" 的HTTP GET請求
    response.writeHead(200, { "Access-Control-Allow-Origin": "*" });
    var targetCity = request.query.targetCity;
    WeatherReportData.getWeatherReportData(response, targetCity);
    console.log("With parameter: " + targetCity);
});
app.get('/test', function (request, response) { //我們要處理URL為 "/" 的HTTP GET請求
    response.writeHead(200, { "Access-Control-Allow-Origin": "*" });
    response.end('Test here 2'); //作出回應
});
//server.listen(3000, function () {
app.listen(3000, function () {
    console.log('HTTP伺服器在 http://127.0.0.1:3000/ 上運行');
});
app.use('/css', express.static(__dirname + '/css'));
app.use('/JavaScript', express.static(__dirname + '/JavaScript'));
app.use('/Image', express.static(__dirname + '/Image'));
//app.use(express.static(path.join(__dirname, 'css')));
//app.use(express.static(path.join(__dirname, 'JavaScript')));
//app.use(express.static(path.join(__dirname, 'Image')));