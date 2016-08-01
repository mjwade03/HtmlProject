var server = require("./WeatherDataQueryServer");
var router = require("./router");

server.start(router.route);