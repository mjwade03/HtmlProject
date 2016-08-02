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
            //console.log(body);
            //response.write(body);
        });
        res.on('end', function () {
            console.log('Already end');


            var startIndex = resultString.search('<tbody><tr>');
            var endIndex = resultString.search('</tr></tbody>');
            var SOI = resultString.substring(startIndex, endIndex + 13);

            var himalaya = require('himalaya');
            var json = himalaya.parse(SOI);
            var jsonString = JSON.stringify(json);
            console.log(jsonString);
            response.write(jsonString);
            response.end();

        });
    });
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });
}
function censor(censor) {
    var i = 0;

    return function (key, value) {
        if (i !== 0 && typeof (censor) === 'object' && typeof (value) == 'object' && censor == value)
            return '[Circular]';

        if (i >= 29) // seems to be a harded maximum of 30 serialized objects?
            return '[Unknown]';

        ++i; // so we know we aren't using the original object anymore

        return value;
    }
}
exports.getWeatherReportData = getWeatherReportData;