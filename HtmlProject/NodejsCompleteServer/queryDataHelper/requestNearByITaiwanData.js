var WeatherReportTableName = "NearByITaiwan";
var DBHelper = require("./DBHelper/mongodHelper");
var BufferHelper = require('bufferhelper');

//function getNearByITaiwanData(response, httpRequestTimeout)
//{
//    var http = require("http");
//    var req = http.get('http://itaiwan.gov.tw/func/hotspotlist.csv', function (res) {
//        console.log("");
//        console.log("=================================================");
//        console.log('Response from near by iTaiwan request');
//        console.log('Status: ' + res.statusCode);
//        console.log('Headers: ' + JSON.stringify(res.headers));
//        console.log("=================================================");
//        console.log("");
//        //res.setEncoding(nu);
//        var bufferHelper = new BufferHelper();
//        var resultString = "";
//        res.on('data', function (body) {
//            resultString = resultString + body;
//            console.log('Receive data');
//        });
//        res.on('end', function () {
//            console.log('Data ended');
            
//            var resultString2 = iconv.decode(new Buffer(resultString), "big5");
//            var result = ConvertCSV2JsonObject(resultString2);
//            var jsonString = JSON.stringify(result);
//            // Response the data back to client
//            if (response.connection) {
//                response.write(jsonString);
//                response.end();
//            }
//        });
//    });
//    req.on('error', function (e) {
//        console.log("");
//        console.log("=================================================");
//        //console.log(WeatherReportTableName + targetCity, 'problem with request: ' + e.message);
//        console.log("=================================================");
//        console.log("");
//    });

//    // 加入timeout的機制 若是time則嘗試從資料庫取得最後一筆更新的資料
//    req.on('socket', function (socket) {
//        socket.setTimeout(httpRequestTimeout*100);
//        socket.on('timeout', function () {
//            console.log("");
//            console.log("=================================================");
//            console.log('Time out, abort the weather report request and get data from local database');
//            console.log("=================================================");
//            console.log("");
//            //DBHelper.getDataFromDB(WeatherReportTableName + targetCity, 'Time out', response);
//            req.abort();
//            req.end();
//        });
//    });
//}
function getNearByITaiwanData(response, httpRequestTimeout)
{
    var iconv = require('iconv-lite');
    var request = require('request');
    request({ url: 'http://itaiwan.gov.tw/func/hotspotlist.csv', encoding: null }, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            var str = iconv.decode(new Buffer(body), "big5");
            var result = ConvertCSV2JsonObject(str);
            var jsonString = JSON.stringify(result);
            //console.log(str);
            response.write(jsonString);
            response.end();
            
        }
    });
}
function ConvertCSV2JsonObject(csvString)
{
    var lines = csvString.split("\n");

    var result = [];

    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {

        var obj = {};
        var currentline = lines[i].split(",");

        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);

    }

    //return result; //JavaScript object
    return result; //JSON
}

exports.getNearByITaiwanData = getNearByITaiwanData;