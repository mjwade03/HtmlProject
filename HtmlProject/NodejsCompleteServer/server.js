// 最後所有種類的資料都會以json string的形式回傳給提出request的client
// Query來源為Json的資料
var UVData = require("./queryDataHelper/requestUVData");
var UVDataSite = require("./queryDataHelper/requestUVSiteData");
var AirPollutantData = require("./queryDataHelper/requestAirPollutantData");
var AirPollutantDataSite = require("./queryDataHelper/requestAirPollutantSiteData");

// Query來源為xml的資料
var RealTimeWeatherStatusData = require("./queryDataHelper/requestRealTimeWeatherStatusData");
var LittleHelpData = require("./queryDataHelper/requestLittleHelperData");
var NearByAttractionData = require("./queryDataHelper/requestNearByAttraction");

// Query來源為html的資料
var WeatherReportData = require("./queryDataHelper/requestWeatherReportData");
var OneWeekWeatherReportData = require("./queryDataHelper/requestOneWeekWeatherReportData");

// Query來源為csv的資料
var NearByITaiwanData = require("./queryDataHelper/requestNearByITaiwanData");

// Declare express package
var express = require('express');
var app = express();
var mongodb = require("./mongodb");
mongodb.open();

// Login
var AccountData = require("./loginHelper/AccountLogin");

// 提出http request去要資料的time out時間 以ms為單位
var httpRequestTimeout = 2000;



// 顯示主頁面
app.get('/', function (request, response) {
    response.sendFile(__dirname + '/MainPage.html');
    console.log("");
    console.log("=================================================");
    console.log("Receive the request to display html page");
    console.log("=================================================");
    console.log("");
});


// 查詢紫外線資料
app.get('/UV', function (request, response) {
    response.writeHead(200, { "Access-Control-Allow-Origin": "*", "Content-Type": "text/html; charset=utf-8" });
    console.log("");
    console.log("=================================================");
    console.log("Receive the request to query UV data");
    console.log("=================================================");
    console.log("");
    UVData.getUVData(response, httpRequestTimeout);
});


// 查詢紫外線測站地理位置資料
app.get('/UVSite', function (request, response) {
    response.writeHead(200, { "Access-Control-Allow-Origin": "*", "Content-Type": "text/html; charset=utf-8" });
    console.log("");
    console.log("=================================================");
    console.log("Receive the request to query UV site data");
    console.log("=================================================");
    console.log("");
    UVDataSite.getUVSiteData(response, httpRequestTimeout);
});


// 查詢空氣品質資料
app.get('/AirPollutant', function (request, response) {
    response.writeHead(200, { "Access-Control-Allow-Origin": "*", "Content-Type": "text/html; charset=utf-8" });
    console.log("");
    console.log("=================================================");
    console.log("Receive the request to query AirPollutant data");
    console.log("=================================================");
    console.log("");
    AirPollutantData.getAirPollutantData(response, httpRequestTimeout);
});


// 查詢空氣品質測站地理位置資料
app.get('/AirPollutantSite', function (request, response) {
    response.writeHead(200, { "Access-Control-Allow-Origin": "*", "Content-Type": "text/html; charset=utf-8" });
    console.log("");
    console.log("=================================================");
    console.log("Receive the request to query AirPollutant site data");
    console.log("=================================================");
    console.log("");
    AirPollutantDataSite.getAirPollutantSiteData(response, httpRequestTimeout);
});


// 查詢即時天氣資料
app.get('/RealTimeWeatherStatus', function (request, response) {
    response.writeHead(200, { "Access-Control-Allow-Origin": "*", "Content-Type": "text/html; charset=utf-8" });
    console.log("");
    console.log("=================================================");
    console.log("Receive the request to query RealTimeWeatherStatus data");
    console.log("=================================================");
    console.log("");
    RealTimeWeatherStatusData.getRealTimeWeatherStatusData(response, httpRequestTimeout);
});


// 查詢特定縣市天氣小幫手資料
app.get('/LittleHelper', function (request, response) {
    response.writeHead(200, { "Access-Control-Allow-Origin": "*", "Content-Type": "text/html; charset=utf-8" });
    console.log("");
    console.log("=================================================");
    console.log("Receive the request to query LittleHelper data");    
    var ID = request.query.ID;
    console.log("With parameter: " + ID);
    console.log("=================================================");
    console.log("");
    LittleHelpData.getLittleHelperData(response, ID, httpRequestTimeout);
    
});


// 查詢目前以及之後兩個時段的天氣預報資料
app.get('/WeatherReport', function (request, response) {
    response.writeHead(200, { "Access-Control-Allow-Origin": "*", "Content-Type": "text/html; charset=utf-8" });
    console.log("");
    console.log("=================================================");
    console.log("Receive the request to query WeatherReport data");    
    var targetCity = request.query.targetCity;
    console.log("With parameter: " + targetCity);
    console.log("=================================================");
    console.log("");
    WeatherReportData.getWeatherReportData(response, targetCity, httpRequestTimeout);
    
});

// 查詢目前以及之後兩個時段的天氣預報資料
app.get('/OneWeekWeatherReport', function (request, response) {
    response.writeHead(200, { "Access-Control-Allow-Origin": "*", "Content-Type": "text/html; charset=utf-8" });
    console.log("");
    console.log("=================================================");
    console.log("Receive the request to query WeatherReport data");
    var targetCity = request.query.targetCity;
    console.log("With parameter: " + targetCity);
    console.log("=================================================");
    console.log("");
    OneWeekWeatherReportData.getOneWeekWeatherReportData(response, targetCity, httpRequestTimeout);

});

// 根據傳入的經緯度查詢周邊的ITaiwan熱點
app.get('/NearByITaiwan', function (request, response) {
    response.writeHead(200, { "Access-Control-Allow-Origin": "*", "Content-Type": "text/html; charset=utf-8" });
    console.log("");
    console.log("=================================================");
    console.log("Receive the request to query near by iTaiwan data");
    var targetLat = request.query.Lat;
    var targetLon = request.query.Lon;
    console.log("With parameter: " + targetLat + ", " + targetLon);
    console.log("=================================================");
    console.log("");
    NearByITaiwanData.getNearByITaiwanData(response, targetLat, targetLon);

});

// 根據傳入的經緯度查詢周邊的景點
app.get('/NearByAttraction', function (request, response) {
    response.writeHead(200, { "Access-Control-Allow-Origin": "*", "Content-Type": "text/html; charset=utf-8" });
    console.log("");
    console.log("=================================================");
    console.log("Receive the request to query near by attraction data");
    var targetLat = request.query.Lat;
    var targetLon = request.query.Lon;
    console.log("With parameter: " + targetLat + ", " + targetLon);
    console.log("=================================================");
    console.log("");
    NearByAttractionData.getNearByAttraction(response, targetLat, targetLon);
});


// 投影片
app.get('/Slide', function (request, response) {
    response.sendFile(__dirname + '/Slide/天氣概況綜合資訊站.pptx');
    console.log("");
    console.log("=================================================");
    console.log("Receive the request to show slide");
    console.log("=================================================");
    console.log("");
});

// 紀錄登入資料
app.post('/LoginData', function (request, response) {
    var jsonString ="";
    request.on('data', function (chunk) {
        jsonString = jsonString + chunk;
    });

    request.on('end', function () {
        response.writeHead(200, { "Access-Control-Allow-Origin": "*", "Content-Type": "text/html; charset=utf-8" });
        console.log("");
        console.log("=================================================");
        console.log("Receive the request to Login data");
        console.log("=================================================");
        console.log("");
        response.end('Test LoginData'); //作出回應
        AccountData.loginDataToDB("LoginData", jsonString);
    });
});


// 保留做為測試用
app.get('/test', function (request, response) { //我們要處理URL為 "/" 的HTTP GET請求
    response.writeHead(200, { "Access-Control-Allow-Origin": "*", "Content-Type": "text/html; charset=utf-8" });
    console.log("");
    console.log("=================================================");
    console.log("Receive the request to query test data");
    console.log("=================================================");
    console.log("");
    response.end('Test here 2'); //作出回應
});
// 保留做為測試用
app.get('/123456', function (request, response) { //我們要處理URL為 "/" 的HTTP GET請求
    response.writeHead(200, { "Access-Control-Allow-Origin": "*", "Content-Type": "text/html; charset=utf-8" });
    console.log("");
    console.log("=================================================");
    console.log("Receive the request to query test data");
    console.log("=================================================");
    console.log("");
    response.end('Test here 2'); //作出回應
});

app.post('/PostTest', function (request, response) { //我們要處理URL為 "/" 的HTTP GET請求
    response.writeHead(200, { "Access-Control-Allow-Origin": "*", "Content-Type": "text/html; charset=utf-8" });
    var jsonString = "";
    request.on('data', function (chunk) {
        jsonString = jsonString + chunk;
    });

    request.on('end', function () {
        var x = 0;
        x++;
    });

    console.log("");
    console.log("=================================================");
    console.log("Receive the request to query test data");
    console.log("=================================================");
    console.log("");
    response.end('Test here 2'); //作出回應
});


// 將server開在3000 port上
app.listen(3000, function () {
    console.log('HTTP伺服器在 http://127.0.0.1:3000/ 上運行');
});


// 將需要用到的files一起attach上去
app.use('/css', express.static(__dirname + '/css'));
app.use('/JavaScript', express.static(__dirname + '/JavaScript'));
app.use('/Image', express.static(__dirname + '/Image'));
app.use('/subPage', express.static(__dirname + '/subPage'));
app.use('/Slide', express.static(__dirname + '/Slide'));
app.use('/AdditionalFile', express.static(__dirname + '/AdditionalFile'));