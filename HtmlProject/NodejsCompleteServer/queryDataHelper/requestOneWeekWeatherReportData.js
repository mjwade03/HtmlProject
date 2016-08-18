var OneWeekWeatherReportTableName = "OneWeekWeatherReport";
var DBHelper = require("./DBHelper/mongodHelper");

function getOneWeekWeatherReportData(response, targetCity, httpRequestTimeout)
{
    var http = require("http");
    var req = http.get('http://www.cwb.gov.tw/V7/forecast/taiwan/inc/city/' + targetCity + '.htm', function (res) {
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

            var startIndex = resultString.search('<table');
            var endIndex = resultString.search('table>');
            var SOI = resultString.substring(startIndex, endIndex + 6);
            var outString = SOI.replace(/\n\t\t\t\t/g, "")
                .replace(/\n\t\t\t/g, "");
            // Parse the html code to json string
            var himalaya = require('himalaya');
            var json = himalaya.parse(outString);
            
            if (json && json[0].children) {
                var jsonString = JSON.stringify(json);

                // Write the data into db with table name
                DBHelper.saveDataToDB(OneWeekWeatherReportTableName + targetCity, jsonString);

                // Response the data back to client
                if (response.connection)
                {
                    response.write(jsonString);
                    response.end();
                }
            }
            else {
                DBHelper.getDataFromDB(OneWeekWeatherReportTableName + targetCity, 'Fail to convter data from html to json string', response);
            }

           
        });
    });
    req.on('error', function (e) {
        console.log("");
        console.log("=================================================");
        console.log(OneWeekWeatherReportTableName + targetCity, 'problem with request: ' + e.message);
        console.log("=================================================");
        console.log("");
        DBHelper.getDataFromDB(WeatherReportTableName + targetCity, 'Socket error', response);
    });

    // 加入timeout的機制 若是time則嘗試從資料庫取得最後一筆更新的資料
    req.on('socket', function (socket) {
        socket.setTimeout(httpRequestTimeout);
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

exports.getOneWeekWeatherReportData = getOneWeekWeatherReportData;