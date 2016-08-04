﻿function getUVSiteData(response)
{
    var http = require("http");
    var req = http.get('http://opendata.epa.gov.tw/ws/Data/UVSite/?$orderby=PublishAgency&$skip=0&$top=1000&format=json', function (res) {
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
            response.write(resultString);
            response.end();

        });
    });
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    // 加入timeout的機制 若是time則嘗試從資料庫取得最後一筆更新的資料
    req.on('socket', function (socket) {
        socket.setTimeout(4000);
        socket.on('timeout', function () {
            console.log('Time out, abort the UV site request and get data from local database');
            req.abort();

            // Try to get data from local database
            response.write("Request already timeout");
            response.end();
        });
    });
}

exports.getUVSiteData = getUVSiteData;