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

    // For test only
    mongodb.find(tableName, "SiteName", "斗六", function (err, data)
    {

        if (data)
        {
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Find data in table start");
            console.log(tableName);
            console.log(data.SiteName);
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Find data in table end");
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

function getCompleteTableFromDB(tableName, callback)
{
    mongodb.getDBToData(tableName, callback);
}
function findSpecificDataInDB(tableName, fieldName, fieldValue, callback)
{
    mongodb.find(tableName, fieldName, fieldValue, callback);
}
exports.getDataFromDB = getDataFromDB;
exports.saveDataToDB = saveDataToDB;
exports.saveDataToDB = saveDataToDB;

exports.getCompleteTableFromDB = getCompleteTableFromDB;
exports.findSpecificDataInDB = findSpecificDataInDB;