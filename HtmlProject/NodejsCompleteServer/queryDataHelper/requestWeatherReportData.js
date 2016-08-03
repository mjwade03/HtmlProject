function getWeatherReportData(response, targetCity) {
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

            var himalaya = require('himalaya');
            var json = himalaya.parse(SOI);
            var jsonString = JSON.stringify(json);
            response.write(jsonString);
            response.end();
        });
    });
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });
}

exports.getWeatherReportData = getWeatherReportData;