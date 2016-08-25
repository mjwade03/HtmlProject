var mongo = require('mongodb');
var Server = mongo.Server;
var Db=mongo.Db;

var server = new Server('localhost',27017,{auto_reconnect:true});
var db = new Db('Weather',server);
var db_singleton = null;

var getConnection = function getConnection(callback) {
    if (db_singleton) {
        callback(null, db_singleton);
    }
    else {
        db.open(function (err, db) {
            if (!err) {
                db_singleton = db;
                console.log("mongodb are connected");
            }
            else {
                console.log("Error creating new connection " + err);
            }
            callback(err, db_singleton);
            return;
        });
    }
}

function open(){
    db.open(function(err,db){
        if (!err) {
            db_singleton = db;
            console.log("mongodb are connected");
        }
        else{
            console.log("mongodb connect is Failed");
        }
    });
}

function insert(tbName, data) {
    getConnection(function (err, db) {
        if (!err) {
            db.collection(tbName, function (err, collection) {
                if (!err) {
                    collection.insert(data);
                    console.log(tbName + " insert success!");
                }
                else {
                    console.log("ErrorMessage:" + err.message);
                }
            });
        }
    });
}

function update(tbName, querykey, updata) {
    getConnection(function (err, db) {
        if (!err) {
            db.collection(tbName, function (err, collection) {
                if (!err) {
                    collection.update(querykey, { '$set': { updata } });
                    console.log(tbName + " update success!");
                }
                else {
                    console.log("ErrorMessage:" + err.message);
                }
            });
        }
    });
}

function remove(tbName, querykey) {
    getConnection(function (err, db) {
        if (!err) {
            db.collection(tbName, function (err, collection) {
                if (!err) {
                    collection.remove(querykey);
                    console.log(tbName + " remove success!");
                }
                else {
                    console.log("ErrorMessage:" + err.message);
                }
            });
        }
    });
}


function find(tbName, queryField, queryValue, callback) {
    getConnection(function (err, db) {
        if (!err) {
            db.collection(tbName, function(err, collection) {
                var query_doc = { 'SiteName' : queryValue };
                collection.findOne(query_doc, function (err, item) {
                    if (!err) {
                        console.log(tbName + " find success!");
                        callback(err, item);
                    }
                    else {
                        console.log("TableName:" + tbName + "query:" + querykey + "is not Find!!!");
                        console.log("ErrorMessage:" + err.message);
                        callback(err, null);
                    }
                });
            });
        }
        else
            callback(err, null);
    });
}

function findField(tbName, queryField, callback) {
    getConnection(function (err, db) {
        if (!err) {
            db.collection(tbName, function (err, collection) {
                collection.findOne(queryField, function (err, item) {
                    if (!err) {
                        console.log(tbName + " find success!");
                        callback(err, item);
                    }
                    else {
                        console.log("TableName:" + tbName + "query:" + queryField + "is not Find!!!");
                        console.log("ErrorMessage:" + err.message);
                        callback(err, null);
                    }
                });
            });
        }
        else
            callback(err, null);
    });
}

function findId(tbName, querykey, callback) {
    getConnection(function (err, db) {
        if (!err) {
            db.collection(tbName, function (err, collection) {
                //var query_doc = { 'id': queryValue };
                collection.findOne(querykey, function (err, item) {
                    if (!err) {
                        console.log(tbName + " find success!");
                        callback(err, item);
                    }
                    else {
                        console.log("TableName:" + tbName + "query:" + querykey + "is not Find!!!");
                        console.log("ErrorMessage:" + err.message);
                        callback(err, null);
                    }
                });
            });
        }
        else
            callback(err, null);
    });
}

function updateId(tbName, querykey, updata) {
    getConnection(function (err, db) {
        if (!err) {
            db.collection(tbName, function (err, collection) {
                if (!err) {
                    //collection.update(updata);
                    collection.update(querykey, updata, function (err, item) {
                        if (!err) {
                            console.log(tbName + " update success!");
                        }
                        else
                            console.log("ErrorMessage:" + err.message);
                    });
                }
                else {
                    console.log("ErrorMessage:" + err.message);
                }
            });
        }
    });
}

function replaceId(tbName, querykey, updata) {
    getConnection(function (err, db) {
        if (!err) {
            db.collection(tbName, function (err, collection) {
                if (!err) {
                    collection.replaceOne(querykey, updata, function (err, item) {
                        if (!err) {
                            console.log(tbName + " replace success!");
                        }
                        else
                            console.log("ErrorMessage:" + err.message);
                    });
                }
                else {
                    console.log("ErrorMessage:" + err.message);
                }
            });
        }
    });
}

function findAll(tbName, callback) {
    getConnection(function (err, db) {
        if (!err) {
            var cursor = db.collection(tbName).find();
            if(cursor != null){
                console.log(tbName + " findAll success!");
                callback(null, cursor);
            }
            else{
                console.log("TableName:" + tbName + " is not Find!!!");
                console.log("ErrorMessage:" + err.message);
                callback(err, null);
            }
        }
        else
            callback(err, null);
    });
}

function SetDataToDB(tableName, jsonString) {
    var result = JSON.parse(jsonString);
    remove(tableName);
    insert(tableName, result);
}

function getDBToData(tableName, callback) {
    findAll(tableName, function (err, data) {
        if (!err) {
            data.toArray(function(err, docs){
                if (!err) {
                    var jsonString = JSON.stringify(docs);
                    callback(err, jsonString);
                }
                else
                    callback(err, null);
            });
        }
     });
}


exports.open = open;
exports.insert = insert;
exports.update = update;
exports.updateId = updateId;
exports.replaceId = replaceId;
exports.remove = remove;
exports.find = find;
exports.findField = findField;
exports.findId = findId;
exports.findAll = findAll;
exports.SetDataToDB = SetDataToDB;
exports.getDBToData = getDBToData;