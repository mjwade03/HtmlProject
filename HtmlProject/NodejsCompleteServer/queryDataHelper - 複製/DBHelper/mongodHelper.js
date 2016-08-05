function getDataFromDB(tableName, reasonToQueryFromDB, response) {

    console.log("Can't get data from internet, get last available data from database");
    console.log(reasonToQueryFromDB);
    console.log("Get data from: " + tableName);
    // Get last available data from local database and response back to client
    var obj = {test:"123", test2:"456"};
    var outString = JSON.stringify(obj);
    response.write(outString);
    response.end();
}

function saveDataToDB(tableName, dataString)
{
    var obj = JSON.parse(dataString);
    console.log("Update data to DB: " + tableName);
}

exports.getDataFromDB = getDataFromDB;
exports.saveDataToDB = saveDataToDB;