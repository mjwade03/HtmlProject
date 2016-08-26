var mongodb = require("../mongodb");
var tableName = "Bookmark";

function addLocation(response, targetid, targetAddr, targetLat, targetLon) {
    var data = {
        id : targetid,
        Addr: targetAddr,
        Lat: targetLat,
        Lon: targetLon
    };
    
    var querykey = { 'Addr': data.Addr };
    mongodb.findField(tableName, querykey, function (err, item) {
        if (!err && item != null) {
            console.log(item);
            mongodb.updateId(tableName, querykey, data);
        }
        else {
            mongodb.insert(tableName, data);
        }
        response.end('AddLocation Finished!');
    });
}

function removeLocation(response, targetid, targetAddr, targetLat, targetLon) {
    var data = {
        id: targetid,
        Addr: targetAddr,
        Lat: targetLat,
        Lon: targetLon
    };
    var querykey = data;
    mongodb.remove(tableName, querykey);
    response.end('RemoveLocation Finished!');
}

function getLocationBookmark(response, targetid, targetAddr, targetLat, targetLon) {
    var data = {};
    if (targetid)
        data.id = targetid;
    if (targetAddr)
        data.Addr = targetAddr;
    if (targetLat)
        data.Lat = targetLat;
    if (targetLon)
        data.Lon = targetLon;
    var querykey = data;
    mongodb.findDatas(tableName, querykey, function (err, item) {
        if (!err && item != null) {
            console.log(item);
            var jsonString = JSON.stringify(item);
            response.write(jsonString);
        }
        else
            response.write("");
        response.end();
    });
}


exports.addLocation = addLocation;
exports.removeLocation = removeLocation;
exports.getLocationBookmark = getLocationBookmark;