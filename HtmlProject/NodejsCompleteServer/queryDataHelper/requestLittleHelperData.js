﻿function getLittleHelperData(response, targetXml)
{
    var http = require("http");
    var req = http.get('http://opendata.cwb.gov.tw/opendata/MFC/' + targetXml + '.xml', function (res) {
        console.log('Status: ' + res.statusCode);
        console.log('Headers: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        var resultString = "";
        res.on('data', function (body) {
            resultString = resultString + body.toString();
            console.log('Receive data');
            //console.log(body);
            //response.write(body);
        });
        res.on('end', function () {

            console.log('Already end');

            var xml2js = require('xml2js'); // XML2JS Module
            var parser = new xml2js.Parser();
            //var xml = "<root>" + resultString.toString() + "</root>";
            parser.parseString(resultString, function (err, result) {
                //console.log(result.cwbopendata.location);
                response.write(JSON.stringify(result));
                response.end();
            });

        });
    });
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });
}

exports.getLittleHelperData = getLittleHelperData;