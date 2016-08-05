﻿var WeatherReportTableName = "WeatherReport";
var DBHelper = require("./DBHelper/mongodHelper");

function getWeatherReportData(response, targetCity)
{
    var http = require("http");
    var req = http.get('http://www.cwb.gov.tw/V7/forecast/taiwan/' + targetCity + '.htm', function (res) {
        console.log('Status: ' + res.statusCode);
        console.log('Headers: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        var resultString = "";
        res.on('data', function (body) {
            resultString = resultString + body;
            console.log('Receive data');
        });
        res.on('end', function () {
            console.log('Data ended');

            var startIndex = resultString.search('<tbody><tr>');
            var endIndex = resultString.search('</tr></tbody>');
            var SOI = resultString.substring(startIndex, endIndex + 13);

            // Parse the html code to json string
            var himalaya = require('himalaya');
            var json = himalaya.parse(SOI);
            
            if (json) {
                var jsonString = JSON.stringify(json);

                // Write the data into db with table name
                DBHelper.saveDataToDB(WeatherReportTableName + targetCity, jsonString);

                // Response the data back to client
                if (response.connection)
                {
                    response.write(jsonString);
                    response.end();
                }
            }
            else {
                DBHelper.getDataFromDB(WeatherReportTableName, 'Fail to convter data from html to json string', response);
            }

           
        });
    });
    req.on('error', function (e) {
        console.log(WeatherReportTableName, 'problem with request: ' + e.message);
    });

    // 加入timeout的機制 若是time則嘗試從資料庫取得最後一筆更新的資料
    req.on('socket', function (socket) {
        socket.setTimeout(10);
        socket.on('timeout', function () {
            console.log('Time out, abort the weather report request and get data from local database');
            DBHelper.getDataFromDB(WeatherReportTableName, 'Time out', response);
            req.abort();
        });
    });
}

exports.getWeatherReportData = getWeatherReportData;