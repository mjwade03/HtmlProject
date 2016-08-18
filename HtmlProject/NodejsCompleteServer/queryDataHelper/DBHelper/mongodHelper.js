var mongodb = require("../../mongodb");
function getDataFromDB(tableName, reasonToQueryFromDB, response) {
    console.log("");
    console.log("=================================================");
    console.log("Can't get data from internet, get last available data from database");
    console.log(reasonToQueryFromDB);
    console.log("Get data from: " + tableName);

    // Get last available data from local database and response back to client

    mongodb.getDBToData(tableName, function (err, data) {
        if (!err) {

            if (data.length > 2 && response.connection) {
                console.log("Send the data back to client");
                response.write(data);
                response.end();
            }
            else
            {
                console.log("Don't send the data back to client");
            }
        }
    });
    console.log("=================================================");
    console.log("");
}

function saveDataToDB(tableName, dataString)
{
    if (dataString && dataString.length > 2)
    {
        mongodb.SetDataToDB(tableName, dataString);
    }
}

exports.getDataFromDB = getDataFromDB;
exports.saveDataToDB = saveDataToDB;