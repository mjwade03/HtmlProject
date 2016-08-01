var UVData = require("./queryDataHelper/requestUVData");
var UVDataSite = require("./queryDataHelper/requestUVSiteData");
function route(pathname, response) {
    var requestType = pathname.split("&");
    switch (requestType[0])
    {
        case "/UV":
            UVData.getUVData(response);
            break;
        case "/UVSite":
            UVDataSite.getUVSiteData(response);
            //console.log("Route this request: " + requestType[0]);
            break;
        case "/AirPollutant":
            //console.log("Route this request: " + requestType[0]);
            break;
        case "/AirPollutantSite":
            //console.log("Route this request: " + requestType[0]);
            break;
        case "/AirPollutantSite":
           // console.log("Route this request: " + requestType[0]);
            break;
        case "/RealTimeWeatherStatus":
           // console.log("Route this request: " + requestType[0]);
            break;
        case "/LittleHelper":
            console.log("Route this request: " + requestType[0]);
            break;
        default:
            break;
    }
}

exports.route = route;