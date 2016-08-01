var http = require("http");

var url = require("url");

var textResult = "";
function start(route) {
    function onRequest(request, response) {
        if (request.url == '/favicon.ico') {
            response.writeHead(200, { 'Content-Type': 'image/x-icon' });
            response.end(/* icon content here */);
        }
        else {
            var pathname = url.parse(request.url).pathname;
            console.log("Request for " + pathname + " received.");
            response.writeHead(200, { "Content-Type": "text/plain" });
            response.writeHead(200, { "Access-Control-Allow-Origin": "*" });

            textResult = textResult + "Hello World";


            route(pathname, response);

            //var http1 = require("http");
            //var req = http1.get('http://www.cwb.gov.tw/V7/forecast/taiwan/Keelung_City.htm', function (res) {
            //    console.log('Status: ' + res.statusCode);
            //    console.log('Headers: ' + JSON.stringify(res.headers));
            //    res.setEncoding('utf8');
            //    var resultString = "";
            //    res.on('data', function (body) {
            //        resultString = resultString + body;
            //        //console.log(body);
            //        //response.write(body);
            //    });
            //    res.on('end', function () {
            //        console.log(resultString);
            //        console.log('Already end');


            //        var himalaya = require('himalaya');
            //        //var html = require('fs').readFileSync('/webpage.html');
            //        var json = himalaya.parse(resultString);
            //        var jsonString = JSON.stringify(json);
            //        console.log(jsonString);
            //        response.write(jsonString);
            //        response.end();

            //    });
            //});
            //req.on('error', function (e) {
            //    console.log('problem with request: ' + e.message);
            //});
        }

        
    }

    http.createServer(onRequest).listen(3000);
    console.log("Server has started.");
}

exports.start = start;