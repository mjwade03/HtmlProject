﻿function getAirPollutantData(response)
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
                    //console.log(body);
                    //response.write(body);
                });
                res.on('end', function () {
                    console.log('Already end');
                    response.write(resultString);
                    response.end();

                });
            });
            req.on('error', function (e) {
                console.log('problem with request: ' + e.message);
            });
}

exports.getAirPollutantData = getAirPollutantData;