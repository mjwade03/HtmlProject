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



// 顯示主頁面
app.get('/', function (request, response) {
    response.sendFile(__dirname + '/MainPage.html');
    console.log("=================================================");
    console.log("Receive the request to display html page");
    console.log("=================================================");
});


// 查詢
app.get('/UV', function (request, response) { //我們要處理URL為 "/" 的HTTP GET請求
    response.writeHead(200, { "Access-Control-Allow-Origin": "*" });
    console.log("=================================================");
    console.log("Receive the request to query UV data");
    console.log("=================================================");
    UVData.getUVData(response);
});
app.get('/UVSite', function (request, response) { //我們要處理URL為 "/" 的HTTP GET請求
    response.writeHead(200, { "Access-Control-Allow-Origin": "*" });
    console.log("=================================================");
    console.log("Receive the request to query UV site data");
    console.log("=================================================");
    UVDataSite.getUVSiteData(response);
});
app.get('/AirPollutant', function (request, response) { //我們要處理URL為 "/" 的HTTP GET請求
    response.writeHead(200, { "Access-Control-Allow-Origin": "*" });
    console.log("=================================================");
    console.log("Receive the request to query AirPollutant data");
    console.log("=================================================");
    AirPollutantData.getAirPollutantData(response);
});
app.get('/AirPollutantSite', function (request, response) { //我們要處理URL為 "/" 的HTTP GET請求
    response.writeHead(200, { "Access-Control-Allow-Origin": "*" });
    console.log("=================================================");
    console.log("Receive the request to query AirPollutant site data");
    console.log("=================================================");
    AirPollutantDataSite.getAirPollutantSiteData(response);
});
app.get('/RealTimeWeatherStatus', function (request, response) { //我們要處理URL為 "/" 的HTTP GET請求
    response.writeHead(200, { "Access-Control-Allow-Origin": "*" });
    console.log("=================================================");
    console.log("Receive the request to query RealTimeWeatherStatus data");
    console.log("=================================================");
    RealTimeWeatherStatusData.getRealTimeWeatherStatusData(response);
});
app.get('/LittleHelper', function (request, response) { //我們要處理URL為 "/" 的HTTP GET請求
    response.writeHead(200, { "Access-Control-Allow-Origin": "*" });
    console.log("=================================================");
    console.log("Receive the request to query LittleHelper data");    
    var ID = request.query.ID;
    console.log("With parameter: " + ID);
    console.log("=================================================");
    LittleHelpData.getLittleHelperData(response, ID);
    
});
app.get('/WeatherReport', function (request, response) { //我們要處理URL為 "/" 的HTTP GET請求
    response.writeHead(200, { "Access-Control-Allow-Origin": "*" });
    console.log("=================================================");
    console.log("Receive the request to query WeatherReport data");    
    var targetCity = request.query.targetCity;
    console.log("With parameter: " + targetCity);
    console.log("=================================================");
    WeatherReportData.getWeatherReportData(response, targetCity);
    
});
app.get('/test', function (request, response) { //我們要處理URL為 "/" 的HTTP GET請求
    response.writeHead(200, { "Access-Control-Allow-Origin": "*" });
    console.log("=================================================");
    console.log("Receive the request to query test data");
    console.log("=================================================");
    response.end('Test here 2'); //作出回應
});
//server.listen(3000, function () {
app.listen(3000, function () {
    console.log('HTTP伺服器在 http://127.0.0.1:3000/ 上運行');
});

app.use('/css', express.static(__dirname + '/css'));
app.use('/JavaScript', express.static(__dirname + '/JavaScript'));
app.use('/Image', express.static(__dirname + '/Image'));
app.use('/subPage', express.static(__dirname + '/subPage'));