var AirPollutantTableName = "AirPollutant";
var DBHelper = require("./DBHelper/mongodHelper");
function getAirPollutantData(response, httpRequestTimeout)
{
    var http = require("http");
    var req = http.get('http://opendata.epa.gov.tw/ws/Data/REWXQA/?$orderby=SiteName&$skip=0&$top=1000&format=json', function (res) {
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

            // Replace the dot in json string
            var outString = resultString.replace(/\PM2.5/g, 'PM2_5');

            // Write the data into db with table name
            DBHelper.saveDataToDB(AirPollutantTableName, outString);

            // Response the data back to client
            response.write(outString);
            response.end();

        });
    });
    req.on('error', function (e) {
        DBHelper.getDataFromDB(AirPollutantTableName, 'problem with request: ' + e.message, response);
    });

    // 加入timeout的機制 若是time則嘗試從資料庫取得最後一筆更新的資料
    req.on('socket', function (socket) {
        socket.setTimeout(httpRequestTimeout);
        socket.on('timeout', function () {
            console.log('Time out, abort the air pollutant request and get data from local database');
            req.abort();
        });
    });
}



exports.getAirPollutantData = getAirPollutantData;