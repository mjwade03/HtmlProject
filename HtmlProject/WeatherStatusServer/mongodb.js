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

function findAll(tbName, callback) {
    getConnection(function (err, db) {
        if (!err) {
            var cursor = db.collection(tbName).find();
            //cursor.toArray(function (err, docs) {
            //    callback(err, docs);
            //});
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



exports.open = open;
exports.insert = insert;
exports.updata = update;
exports.remove = remove;
exports.find = find;
exports.findAll = findAll;