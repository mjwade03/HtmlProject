var WeatherReportTableName = "WeatherReport";
var DBHelper = require("./DBHelper/mongodHelper");

function getWeatherReportData(response, targetCity)
{
    var http = require("http");
    var req = http.get('http://www.cwb.gov.tw/V7/forecast/taiwan/' + targetCity + '.htm', function (res) {
        console.log("");
        console.log("=================================================");
        console.log('Response from weather report request');
        console.log('Status: ' + res.statusCode);
        console.log('Headers: ' + JSON.stringify(res.headers));
        console.log("=================================================");
        console.log("");
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
            
            if (json && json[0].children) {
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
                DBHelper.getDataFromDB(WeatherReportTableName + targetCity, 'Fail to convter data from html to json string', response);
            }

           
        });
    });
    req.on('error', function (e) {
        console.log("");
        console.log("=================================================");
        console.log(WeatherReportTableName + targetCity, 'problem with request: ' + e.message);
        console.log("=================================================");
        console.log("");
    });

    // 加入timeout的機制 若是time則嘗試從資料庫取得最後一筆更新的資料
    req.on('socket', function (socket) {
        socket.setTimeout(10);
        socket.on('timeout', function () {
            console.log("");
            console.log("=================================================");
            console.log('Time out, abort the weather report request and get data from local database');
            console.log("=================================================");
            console.log("");
            DBHelper.getDataFromDB(WeatherReportTableName + targetCity, 'Time out', response);
            req.abort();
            req.end();
        });
    });
}

exports.getWeatherReportData = getWeatherReportData;