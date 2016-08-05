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
function load()
{    
    var ishttps = 'https:' == document.location.protocol ? true : false;

    if (ishttps) {
        console.log("This page running in https");
        //alert("In https");
    } else {
        console.log("This page running in http");
        alert("In http");
    }


    loadUVJsonpData();
    loadUVSitenData();
    loadAirPollutantJsonData();
    loadAirPollutantSiteJsonData();

    //loadRealTimeWeatherStatusData();
    loadRealTimeWeatherStatusDataByNodeJs();

    initMap();
    //getLocation();
}

function onClick() {
    window.location.assign("subPage/HTML1.html");
}
