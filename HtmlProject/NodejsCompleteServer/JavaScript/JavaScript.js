// Map的部分
var lastLat;
var lastLng;
var geocoder = null;
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

function load()
{    
    loadUVJsonpData();
    loadUVSitenData();
    loadAirPollutantJsonData();
    loadAirPollutantSiteJsonData();

    loadRealTimeWeatherStatusData();
    //loadRealTimeWeatherStatusDataByNodeJs();

    initMap();
    //getLocation();
}

function onClick() {
    window.location.assign("subPage/HTML1.html");
}
