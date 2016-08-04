var server = require("./WeatherDataQueryServer");
var router = require("./router");
 var mongodb = require("./mongodb");

server.start(router.route);
 mongodb.open();