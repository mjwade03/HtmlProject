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
    window.location.assign("subPage/NearByInfoPage.html?Lat=" + currentLat + "&Lon=" + currentLng);
}

function secondLevelPageLoad()
{
    var urlinfo = window.location.href;
    var len = urlinfo.length;
    var offset = urlinfo.indexOf("?");
    var newsidinfo = urlinfo.substr(offset + 1, len);
    var newsids = newsidinfo.split("&");
    var newsid = newsids[1];

    var lat = newsids[0].split("=")[1];
    var lon = newsids[1].split("=")[1];
    var x = 0;
    getNearByITaiwanHotSpot(lon, lat);
    getNearByAttraction(lon, lat);
    initSubPageMap(lat, lon);
}
