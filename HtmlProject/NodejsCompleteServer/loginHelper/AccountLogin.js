var mongodb = require("../mongodb");

function loginDataToDB(tableName, dataString) {
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
            //紀錄最新登入者
            var currentlogin = { 'currentUser': data.id };
        });
    }
}




exports.loginDataToDB = loginDataToDB;

