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
                response.write(jsonString);
            }
            else {
                console.log('Fail to convter data from html to json string');
            }

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
            console.log('Time out, abort the weather report request and get data from local database');
            req.abort();

            // Try to get data from local database
            response.write("Request already timeout");
            response.end();
        });
    });
}

exports.getWeatherReportData = getWeatherReportData;