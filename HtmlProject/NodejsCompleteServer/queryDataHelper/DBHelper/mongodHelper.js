var mongodb = require("../../mongodb");
function getDataFromDB(tableName, reasonToQueryFromDB, response) {

    console.log("Can't get data from internet, get last available data from database");
    console.log(reasonToQueryFromDB);
    console.log("Get data from: " + tableName);
    // Get last available data from local database and response back to client

    mongodb.getDBToData(tableName, function (err, data) {
        if (!err) {

            if (data.length > 2 && response.connection) {
                response.write(data);
                response.end();
            }
        }
    });

}

function saveDataToDB(tableName, dataString)
{
    mongodb.SetDataToDB(tableName, dataString);
}

exports.getDataFromDB = getDataFromDB;
exports.saveDataToDB = saveDataToDB;