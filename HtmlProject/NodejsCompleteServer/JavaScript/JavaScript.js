// Map的部分
var lastLat;
var lastLng;
var geocoder = undefined;
var myMap;
var myMarker;
var popup;
var mylatlng;

//天氣資訊的部分
var currentTemp;
var currentUVStatus;
var cuuentPM2_5;
var currentAirPollutantStatus;

var alreadyGetLocation = false;

var dataSource;
var ishttps = 'https:' == document.location.protocol ? true : false;

function load()
{    


    if (ishttps) {
        console.log("This page running in https");
    } else {
        console.log("This page running in http");
    }


    loadUVJsonpData();
    loadUVSitenData();
    loadAirPollutantJsonData();
    loadAirPollutantSiteJsonData();

    if (ishttps)
        loadRealTimeWeatherStatusData();
    else
        loadRealTimeWeatherStatusDataByNodeJs();

    initMap();
    //getLocation();
}

function onClick() {
    window.location.assign("subPage/HTML1.html");
}
