var NearByAttractionTableName = "NearByAttraction";
var DBHelper = require("./DBHelper/mongodHelper");
var BufferHelper = require('bufferhelper');
function getNearByAttraction(response, targetLat, targetLon)
{
    fs = require('fs')
    fs.readFile('AdditionalFile/special_poi_sec.xml', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        else
        {            
            // Convert the data from xml to json
            var xml2js = require('xml2js'); // XML2JS Module
            var parser = new xml2js.Parser();
            //var xml = "<root>" + resultString.toString() + "</root>";

            var xml = data.replace(/[\n\r]/g, '\\n')
                .replace(/&/g, "&amp;")
                .replace(/\'/g, '&apos;')
                .replace(/\"/g, '&quot;')
                .replace(/-/g, "&#45;");

            parser.parseString(xml, function (err, result) {
                //console.log(result.cwbopendata.location);
                if (result) {
                    var nearAttractions = [];
                    for (var index = 0; index < result.LIST.ITEM.length; index++)
                    {
                        var currentLat = result.LIST.ITEM[index].PY[0];
                        var currentLon = result.LIST.ITEM[index].PX[0];
                        var distance = Math.abs(currentLat - targetLat) + Math.abs(currentLon - targetLon);
                        if (distance < 0.3) {
                            result.LIST.ITEM[index].Distance = distance;
                            nearAttractions.push(result.LIST.ITEM[index]);
                        }
                    }
                    var jsonString = JSON.stringify(nearAttractions);
                    

                    // Response the data back to client
                    if (response.connection) {
                        response.write(jsonString);
                        response.end();
                    }
                }
                else {
                }

            });
        }
    });
}

exports.getNearByAttraction = getNearByAttraction;