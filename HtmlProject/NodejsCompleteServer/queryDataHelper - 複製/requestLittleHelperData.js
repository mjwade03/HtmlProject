var LittleHelperTableName = "LittleHelper";
var DBHelper = require("./DBHelper/mongodHelper");

function getLittleHelperData(response, targetXml, httpRequestTimeout)
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
        });
        res.on('end', function () {

            console.log('Data ended');

            // Convert the data from xml to json
            var xml2js = require('xml2js'); // XML2JS Module
            var parser = new xml2js.Parser();
            //var xml = "<root>" + resultString.toString() + "</root>";
            parser.parseString(resultString, function (err, result) {
                //console.log(result.cwbopendata.location);
                if (result) {
                    var jsonString = JSON.stringify(result);

                    // Replace the dollar sign in json string
                    var outString = jsonString.replace("$", "cwbversion");
                    // Write the data into db with table name
                    DBHelper.saveDataToDB(LittleHelperTableName + "_" + targetXml, outString);

                    // Response the data back to client
                    response.write(outString);
                }
                else
                {
                    // Get last available data from db
                    DBHelper.getDataFromDB(LittleHelperTableName + "_" + targetXml, 'Fail to convter data from xml to json string', response);
                }
                response.end();
            });

        });
    });
    req.on('error', function (e) {
        DBHelper.getDataFromDB(LittleHelperTableName + "_" + targetXml, 'problem with request: ' + e.message, response);
    });

    // 加入timeout的機制 若是time則嘗試從資料庫取得最後一筆更新的資料
    req.on('socket', function (socket) {
        socket.setTimeout(httpRequestTimeout);
        socket.on('timeout', function () {
            console.log('Time out, abort the little helper request and get data from local database');
            req.abort();
        });
    });
}

exports.getLittleHelperData = getLittleHelperData;