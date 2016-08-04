var mongo = require('mongodb');
var Server = mongo.Server;
var Db=mongo.Db;

var server = new Server('localhost',27017,{auto_reconnect:true});
var db = new Db('Weather',server);

var db_singleton = null;

var getConnection = function getConnection(callback) {
    if(db_singleton){
        callback(null, db_singleton);
    }
    else{
        db.open(function(err,db){
            if(!err){
                db_singleton = db;
                console.log("mongodb are connected");
            }
            else{
                console.log("Error creating new connection " + err);
            }
            callback(err, db_singleton);
            return;
        });
    }
}

module.exports = getConnection;