var AirPollutantSiteTableName = "AirPollutantSite";
var DBHelper = require("./DBHelper/mongodHelper");

function getAirPollutantSiteData(response, httpRequestTimeout)
{
    var http = require("http");
    var req = http.get('http://opendata.epa.gov.tw/ws/Data/AQXSite/?$orderby=SiteName&$skip=0&$top=1000&format=json', function (res) {
        console.log("");
        console.log("=================================================");
        console.log('Response from air pollutant site request');
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

            // Write the data into db with table name
            DBHelper.saveDataToDB(AirPollutantSiteTableName, resultString);

            // Response the data back to client
            if (response.connection)
            {
                response.write(resultString);
                response.end();
            }
        });
    });
    req.on('error', function (e) {
        console.log("");
        console.log("=================================================");
        console.log('getAirPollutantSiteData, problem with request: ' + e.message);
        console.log("=================================================");
        console.log("");
    });

    // 加入timeout的機制 若是time則嘗試從資料庫取得最後一筆更新的資料
    req.on('socket', function (socket) {
        socket.setTimeout(httpRequestTimeout);
        socket.on('timeout', function () {
            console.log("");
            console.log("=================================================");
            console.log('Time out, abort the air pollutant site request and get data from local database');  
            console.log("=================================================");
            console.log("");
            DBHelper.getDataFromDB(AirPollutantSiteTableName, 'Time out', response);          
            req.abort();
            req.end();
        });
    });
}

exports.getAirPollutantSiteData = getAirPollutantSiteData;