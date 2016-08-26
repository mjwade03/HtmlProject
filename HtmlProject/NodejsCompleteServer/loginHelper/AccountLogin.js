var mongodb = require("../mongodb");

function loginDataToDB(response, tableName, dataString) {
    if (dataString && dataString.length > 2) {
        var data = JSON.parse(dataString);
        var querykey = { 'id': data.id };
        mongodb.findField(tableName, querykey, function (err, item) {
            if (!err && item != null) {
                console.log(item);
                mongodb.updateId(tableName, querykey, JSON.parse(dataString));
            }
            else {
                mongodb.insert(tableName, JSON.parse(dataString));
            }
        });
    }
    response.end('LoginData finished!');
}




exports.loginDataToDB = loginDataToDB;

