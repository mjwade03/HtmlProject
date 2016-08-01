var queryUVJsonUrl = 'http://opendata.epa.gov.tw/ws/Data/UV/?$orderby=PublishTime%20desc&$skip=0&$top=1000&format=json';
var queryUVSiteJsonUrl = 'http://opendata.epa.gov.tw/ws/Data/UVSite/?$orderby=PublishAgency&$skip=0&$top=1000&format=json';
var alreadyGotUVJson = false;
var alreadyGotUVSiteJson = false;
var UVArray;
var UVSiteArray;

var queryAirPollutantJsonUrl = 'http://opendata.epa.gov.tw/ws/Data/REWXQA/?$orderby=SiteName&$skip=0&$top=1000&format=json';
var queryAirPollutantSiteJsonUrl = 'http://opendata.epa.gov.tw/ws/Data/AQXSite/?$orderby=SiteName&$skip=0&$top=1000&format=json';
var alreadyGotAirPollutantJson = false;
var alreadyGotAirPollutantSiteJson = false;
var AirPollutantArray;
var AirPollutantSiteArray;


// 用於query目前即時的天氣資訊
var queryRealTimeWeatherStatusUrl = 'http://opendata.cwb.gov.tw/opendata/DIV2/O-A0003-001.xml';
var realTimeWeatherStatusDataArray;
var alreadyUpdateRealTimeStatus= false;

// 自訂的Node.js server
var node_jsServerUrl = "http://127.0.0.1:3000/";
var lastLat;
var lastLng;

var weatherIconUrl = 'Image/WeatherIcon/';

var geocoder = null;
var myMap;
var myMarker;
var popup;
var mylatlng;


var currentTemp;
var currentUVStatus;
var cuuentPM2_5;
var currentAirPollutantStatus;

var alreadyGetLocation = false;
function load() {


    loadUVJsonpData();
    loadUVSitenData();
    loadAirPollutantJsonData();
    loadAirPollutantSiteJsonData();

    loadRealTimeWeatherStatusData();

    initMap();
    //getLocation();
}

function initMap() {
    geocoder = new google.maps.Geocoder();
    myMap = new google.maps.Map(document.getElementById('my_map'), {
    center: {lat: 25.04763902653048, lng: 121.51715755462646},
    zoom: 15
    });
    popup = new google.maps.InfoWindow();

    myMarker = new google.maps.Marker({position:myMap.getPosition,map:myMap,title:"You are here!"});

    google.maps.event.addListener(myMap, "click", function (e) {
        mylatlng = e.latLng;
        //設定標註座標
        var currentLng = mylatlng.lng();
        var currentLat = mylatlng.lat();
        document.getElementById('inLatLng').innerHTML = "經緯度: " + e.latLng;
        getWeatherStatus(currentLng, currentLat);
        getAddress2(e.latLng);
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    myMap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    var searchBox = new google.maps.places.SearchBox(input);
    var pacsave = document.getElementById('pac-save');
    myMap.controls[google.maps.ControlPosition.TOP_LEFT].push(pacsave);

    // Bias the SearchBox results towards current map's viewport.
    myMap.addListener('bounds_changed', function() {
        searchBox.setBounds(myMap.getBounds());
    });

    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
        return;
        }

        ShowAddress();
    });
    checkCookie();
}

function getWeatherStatus(currentLng, currentLat) {
    lastLat = currentLat;
    lastLng = currentLng;
    if ((UVArray != null && UVArray.length == 0) || (UVSiteArray != null && UVSiteArray.length == 0) || (AirPollutantArray != null && AirPollutantArray.length == 0) || (AirPollutantSiteArray != null && AirPollutantSiteArray.length == 0)) {
       // alert("Weather data not ready");
    }
    else if (UVArray == null || UVSiteArray == null || AirPollutantArray == null || AirPollutantSiteArray == null)
    {
       // alert("Weather data not ready");
    }
    else {
        var targetUVSiteName;
        var targetAirPollutantSiteName;
        // Find the nearst UV site
        var minUVSiteDistance = 999999999;
        for (var i = 0; i < UVSiteArray.length; i++) {

            var distance = Math.abs(UVSiteArray[i].TWD97Lon - currentLng) + Math.abs(UVSiteArray[i].TWD97Lat - currentLat);
            if (distance < minUVSiteDistance) {
                minUVSiteDistance = distance;
                targetUVSiteName = UVSiteArray[i].SiteName;
            }
        }
        for (var i = 0; i < UVArray.length; i++) {
            if (UVArray[i].SiteName == targetUVSiteName) {
                setCurrentUVInfoTable(UVArray[i]);

                document.getElementById("weatherUVLevel").innerHTML = getUVLevel(UVArray[i].UVI);
                setTextColorByUVLevel(document.getElementById("weatherUVLevel"), UVArray[i].UVI);
                currentUVStatus = getUVLevel(UVArray[i].UVI);
                GetWeatherDataByCountyName(UVArray[i].County);
                break;
            }
        }
        
        // Change the UV drop down list to this station
        var sel = document.getElementById('UVSiteSelect');
        var opts = sel.options;
        
        for (var index = 0; index < opts.length; index++) {
            var opt = opts[index];

            if (opt.value == targetUVSiteName) {
                sel.selectedIndex = index;
                break;
            }
        }



        // Find the nearst air pollutant site
        var minAirPollutantSiteDistance = 999999999;
        if(AirPollutantSiteArray != null){
            for (var i = 0; i < AirPollutantSiteArray.length; i++) {
                var distance = Math.abs(AirPollutantSiteArray[i].TWD97Lon - currentLng) + Math.abs(AirPollutantSiteArray[i].TWD97Lat - currentLat);
                if (distance < minAirPollutantSiteDistance) {
                    minAirPollutantSiteDistance = distance;
                    targetAirPollutantSiteName = AirPollutantSiteArray[i].SiteName;
                }
            }
        }
        if(AirPollutantArray != null){
            for (var i = 0; i < AirPollutantArray.length; i++) {
                ///alert("2: " + AirPollutantArray[i].PM25);
                if (AirPollutantArray[i].SiteName == targetAirPollutantSiteName) {
                    setCurrentAirPollutantInfoTable(AirPollutantArray[i]);

                  // alert( AirPollutantArray[i]["PM2.5"]);

                    document.getElementById("weatherAirStatus").innerHTML = AirPollutantArray[i].Status ? AirPollutantArray[i].Status : "N/A";
                    setTextColorByPSILevel(document.getElementById("weatherAirStatus"), AirPollutantArray[i]["PSI"]);

                    document.getElementById("weatherPM25Level").innerHTML = AirPollutantArray[i]["PM2.5"] ? getPM2_5Level(AirPollutantArray[i]["PM2.5"]) : "N/A";
                    setTextColorByPM2_5Level(document.getElementById("weatherPM25Level"), AirPollutantArray[i]["PM2.5"]);

                    currentAirPollutantStatus = AirPollutantArray[i].Status ? AirPollutantArray[i].Status : "N/A";
                    cuuentPM2_5 = AirPollutantArray[i]["PM2.5"] ? getPM2_5Level(AirPollutantArray[i]["PM2.5"]) : "N/A";
                    GetWeatherDataByCountyName(AirPollutantArray[i].County);
                    break;
                }
            }
        }

        // Change the air pollutant drop down list to this station
        sel = document.getElementById('airPollutantSiteSelect');
        opts = sel.options;

        for (var index = 0; index < opts.length; index++) {
            var opt = opts[index];

            if (opt.value == targetAirPollutantSiteName) {
                sel.selectedIndex = index;
                break;
            }
        }


        updateRealTimeWeatherStatus();
    }
}

// 將經緯度透過 Google map API 反查地址
function getAddress2(latLng){
    geocoder.geocode({
        'latLng': latLng
    }, function(results, status) {
        myMarker.setMap(null);
        if (status == google.maps.GeocoderStatus.OK) {
            if (results) {
                var marker = new google.maps.Marker({
                    position: latLng,
                    map: myMap,
                    title: 'You are here!',
                });
                myMarker = marker;
                marker.addListener("click", function (){
                    popup.open(myMap, myMarker);
                });
                showAddressOfResult(results[0], myMarker);
            }
        } else {
            alert("Reverse Geocoding failed because: " + status);
        }
    });
}

// 設定 marker 的訊息泡泡
function showAddressOfResult(result, marker) {
    myMap.setCenter(marker.getPosition());
    var popupContent = '<b>地址: </b> ' + result.formatted_address + '<br>' +
                        '<b>溫度: </b>' + currentTemp + '<br>' +
                        '<b>紫外線等級: </b>' + currentUVStatus + '<br>' +
                        '<b>PM2.5等級: </b>' + cuuentPM2_5 + '<br>' +
                        '<b>空氣品質: </b>' + currentAirPollutantStatus;
    popup.setContent(popupContent);
    popup.open(myMap, marker);
}

//定位
function getLocation() {
    //alert(alreadyGetLocation + ":" + alreadyUpdateRealTimeStatus + ":" + alreadyGotUVJson + ":" + alreadyGotUVSiteJson + ":" + alreadyGotAirPollutantJson + ":" + alreadyGotAirPollutantSiteJson);
    if (alreadyGetLocation == false &&
        alreadyUpdateRealTimeStatus == true &&
        alreadyGotUVJson == true &&
        alreadyGotUVSiteJson == true &&
        alreadyGotAirPollutantJson == true &&
        alreadyGotAirPollutantSiteJson == true) {
        alreadyGetLocation = true;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            alert("您的瀏覽器不支援定位服務");
        }
    }
}

function showPosition(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    latlon = new google.maps.LatLng(lat, lon)
    getWeatherStatus(lon, lat);
    getAddress2(latlon);
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

function loadJsonpData(targetUrl) {
    $.ajax({
        type: 'GET',
        url: targetUrl,
        dataType: 'jsonp',
        success: function (response) {
            switch (targetUrl) {
                case queryUVJsonUrl:
                    UVArray = response;
                    alreadyGotUVJson = true;
                    updateUVData();
                    break;
                case queryUVSiteJsonUrl:
                    UVSiteArray = response;
                    alreadyGotUVSiteJson = true;
                    updateUVData();
                    break;
                case queryAirPollutantJsonUrl:
                    AirPollutantArray = response;
                    alreadyGotAirPollutantJson = true;
                    updateAirPollutantData();
                    break;
                case queryAirPollutantSiteJsonUrl:
                    AirPollutantSiteArray = response;
                    alreadyGotAirPollutantSiteJson = true;
                    updateAirPollutantData();
                    break;
            }
        }
    });
}

function loadJsonpData2(targetUrl) {
    var BasicQueryUrl = 'https://query.yahooapis.com/v1/public/yql?'
    var query = 'q=' +
        encodeURIComponent('select * from html where ' +
        '  url = "' + targetUrl + '"') + '&format=json';
    $.getJSON(BasicQueryUrl + query, function (data) {
        var jsonString = data.query.results.body.toString();
        var obj = JSON.parse(jsonString);
        switch (targetUrl) {
            case queryUVJsonUrl:
                UVArray = obj;
                alreadyGotUVJson = true;
                updateUVData();
                break;
            case queryUVSiteJsonUrl:
                UVSiteArray = obj;
                alreadyGotUVSiteJson = true;
                updateUVData();
                break;
            case queryAirPollutantJsonUrl:
                //alert("Here: " + obj[0].PM25);
                AirPollutantArray = obj;
                //alert("Here: " + AirPollutantArray[0].PM25);
                alreadyGotAirPollutantJson = true;
                updateAirPollutantData();
                break;
            case queryAirPollutantSiteJsonUrl:
                AirPollutantSiteArray = obj;
                alreadyGotAirPollutantSiteJson = true;
                updateAirPollutantData();
                break;
        }
    });
}


function loadJsonpData3(targetData)
{
    $.ajax({
        type: 'GET',
        url: node_jsServerUrl + targetData,
        success: function (response) {
            switch (targetData) {
                case "UV":
                    UVArray = JSON.parse(response);
                    alreadyGotUVJson = true;
                    updateUVData();
                    break;
                case "UVSite":
                    UVSiteArray = JSON.parse(response);
                    alreadyGotUVSiteJson = true;
                    updateUVData();
                    break;
                case "AirPollutant":
                    AirPollutantArray = response;
                    alreadyGotAirPollutantJson = true;
                    updateAirPollutantData();
                    break;
                case "AirPollutantSite":
                    AirPollutantSiteArray = response;
                    alreadyGotAirPollutantSiteJson = true;
                    updateAirPollutantData();
                    break;
            }
        }
    });
}

function loadUVJsonpData() {
    loadJsonpData2(queryUVJsonUrl);
    //loadJsonpData3("UV");
}

function loadUVSitenData() {
    loadJsonpData2(queryUVSiteJsonUrl);
    //loadJsonpData3("UVSite");
}

function updateUVData() {
    if (alreadyGotUVJson == true && alreadyGotUVSiteJson == true) {
        getLocation();
        for (var i = 0; i < UVArray.length; i++) {
            var site = UVArray[i].SiteName ? UVArray[i].SiteName : "N/A";
            var uvi = UVArray[i].UVI ? UVArray[i].UVI : "N/A";
            var publisher = UVArray[i].PublishAgency ? UVArray[i].PublishAgency : "N/A";
            var place = UVArray[i].County ? UVArray[i].County : "N/A";
            var longitudeWGS84 = UVArray[i].WGS84Lon ? UVArray[i].WGS84Lon : "N/A";
            var latitudeWGS84 = UVArray[i].WGS84Lat ? UVArray[i].WGS84Lat : "N/A";
            var time = UVArray[i].PublishTime ? UVArray[i].PublishTime : "N/A";

            var match = $.grep(UVSiteArray, function (item) {
                return item.SiteName == site;
            });

            var longitudeTWD97;
            var latitudeTW97
            if (match) {
                longitudeTWD97 = match[0].TWD97Lon ? match[0].TWD97Lon : "N/A";
                latitudeTW97 = match[0].TWD97Lat ? match[0].TWD97Lat : "N/A";
            }
            else {
                longitudeTWD97 = "N/A";
                latitudeTW97 = "N/A";
            }

            //addNewUVData(site, uvi, publisher, place, longitudeWGS84, latitudeWGS84, longitudeTWD97, latitudeTW97, time);

            var option = document.createElement("option");
            option.text = "測站: " + site + ", 位於: " + place;
            option.value = site;
            var select = document.getElementById("UVSiteSelect");
            select.appendChild(option);

        }
        // setCurrentUVInfoTable(UVArray[0]);
        getWeatherStatus(121.51715755462646 * 1, 25.04763902653048 * 1);
        //alreadyGotUVJson = false;
        //alreadyGotUVSiteJson = false;
    }
}

function addNewUVData(site, uvi, publisher, place, longitudeWGS84, latitudeWGS84, longitudeTWD97, latitudeTWD97, time) {
    var num = document.getElementById("uvTable").rows.length;

    var Tr = document.getElementById("uvTable").insertRow(num);


    Td = Tr.insertCell(Tr.cells.length);
    Td.innerHTML = site;

    Td = Tr.insertCell(Tr.cells.length);
    Td.innerHTML = place;

    Td = Tr.insertCell(Tr.cells.length);
    Td.innerHTML = uvi;

    Td = Tr.insertCell(Tr.cells.length);
    Td.innerHTML = publisher;



    //Td = Tr.insertCell(Tr.cells.length);
    //Td.innerHTML = longitudeWGS84;

    //Td = Tr.insertCell(Tr.cells.length);
    //Td.innerHTML = latitudeWGS84;

    //Td = Tr.insertCell(Tr.cells.length);
    //Td.innerHTML = longitudeTWD97;

    //Td = Tr.insertCell(Tr.cells.length);
    //Td.innerHTML = latitudeTWD97;

    Td = Tr.insertCell(Tr.cells.length);
    Td.innerHTML = time;
}

function onSelectUVSiteChange() {
    var siteName = document.getElementById("UVSiteSelect").value;
    alert("你選擇了" + siteName + "測站");
    var select;
    for (var i = 0; i < UVArray.length; i++) {
        if (UVArray[i].SiteName == siteName) {
            setCurrentUVInfoTable(UVArray[i]);
            //GetWeatherDataByCountyName(UVArray[i].County);


            var match = $.grep(UVSiteArray, function (item) {
                return item.SiteName == UVArray[i].SiteName;
            });

            var longitudeTWD97;
            var latitudeTW97
            if (match) {
                longitudeTWD97 = match[0].TWD97Lon ? match[0].TWD97Lon : "N/A";
                latitudeTW97 = match[0].TWD97Lat ? match[0].TWD97Lat : "N/A";
            }
            else {
                longitudeTWD97 = "N/A";
                latitudeTW97 = "N/A";
            }
            
            var myLatLng = new google.maps.LatLng(latitudeTW97, longitudeTWD97);
            //myMap.setCenter(myLatLng, 15);
            //myMap.addControl(new GLargeMapControl());
            //myMarker = new GMarker(myLatLng);
            //myMap.addOverlay(myMarker);


            getWeatherStatus(longitudeTWD97, latitudeTW97);
            getAddress2(myLatLng);

            break;
        }
    }
}

function getUVLevel(UVI) {
    var roundUVI = Math.round(UVI);
    if (roundUVI >= 0 && roundUVI <= 2)
        return "低量";
    else if (roundUVI >= 3 && roundUVI <= 5)
        return "中量";
    else if (roundUVI >= 6 && roundUVI <= 7)
        return "高量";
    else if (roundUVI >= 8 && roundUVI <= 10)
        return "過量";
    else if (roundUVI >= 11)
        return "危險";
    else
        return "N/A";
}
function setTextColorByUVLevel(element, UVI)
{
    var roundUVI = Math.round(UVI);
    if (roundUVI >= 0 && roundUVI <= 5)
        element.style.color = "green";
    else if (roundUVI >= 6)
        element.style.color = "red";
    else
        element.style.color = "black";
}
function getPM2_5Level(PM2_5)
{
    if (PM2_5 >= 0 && PM2_5 <= 35)
        return "低";
    else if (PM2_5 >= 36 && PM2_5 <= 53)
        return "中";
    else if (PM2_5 >= 54 && PM2_5 <= 70)
        return "高";
    else if (PM2_5 >= 71)
        return "非常高";
    else
        return "N/A";
}
function setTextColorByPM2_5Level(element, PM2_5)
{
    if (PM2_5 >= 0 && PM2_5 <= 53)
        element.style.color = "green";
    else if (PM2_5 >= 54)
        element.style.color = "red";
    else
        element.style.color = "black";
}
function setTextColorByPSILevel(element, PSI)
{
    if ( PSI <= 100)
        element.style.color = "green";
    else if (PSI >= 101 )
        element.style.color = "red";
    else
        element.style.color = "black";
}
function setCurrentUVInfoTable(currentObject) {
    document.getElementById("currentUVSiteName").innerHTML = currentObject.SiteName ? currentObject.SiteName : "N/A";
    document.getElementById("currentUVValue").innerHTML = currentObject.UVI ? currentObject.UVI : "N/A";
    document.getElementById("currentUVLevel").innerHTML = getUVLevel(currentObject.UVI);
    document.getElementById("currentUVSiteCounty").innerHTML = currentObject.County ? currentObject.County : "N/A";
    document.getElementById("currentUVPublishTime").innerHTML = currentObject.PublishTime ? currentObject.PublishTime : "N/A";
    //document.getElementById("weatherUVLevel").innerHTML = "紫外線等級:" + getUVLevel(currentObject.UVI);
    //GetWeatherDataByCountyName(currentObject.County);
}

function loadAirPollutantJsonData() {
    loadJsonpData2(queryAirPollutantJsonUrl);
}

function loadAirPollutantSiteJsonData() {
    loadJsonpData2(queryAirPollutantSiteJsonUrl);
}

function updateAirPollutantData() {
    if (alreadyGotAirPollutantJson == true && alreadyGotAirPollutantSiteJson == true) {
        getLocation();
        for (var i = 0; i < AirPollutantArray.length; i++) {
            var site = AirPollutantArray[i].SiteName ? AirPollutantArray[i].SiteName : "N/A";
            var place = AirPollutantArray[i].County ? AirPollutantArray[i].County : "N/A";
            var psi = AirPollutantArray[i].PSI ? AirPollutantArray[i].PSI : "N/A";
            var status = AirPollutantArray[i].Status ? AirPollutantArray[i].Status : "N/A";
            var majorPollutant = AirPollutantArray[i].MajorPollutant ? AirPollutantArray[i].MajorPollutant : "N/A";
            var time = AirPollutantArray[i].PublishTime ? AirPollutantArray[i].PublishTime : "N/A";

            var match = $.grep(AirPollutantSiteArray, function (item) {
                return item.SiteName == site;
            });

            var longitudeTWD97;
            var latitudeTWD97
            if (match) {
                longitudeTWD97 = match[0].TWD97Lon ? match[0].TWD97Lon : "N/A";
                latitudeTWD97 = match[0].TWD97Lat ? match[0].TWD97Lat : "N/A";
            }
            else {
                longitudeTWD97 = "N/A";
                latitudeTWD97 = "N/A";
            }

           // addNewAirPollutantTableData(site, place, psi, status, majorPollutant, longitudeTWD97, latitudeTWD97, time);

            var option = document.createElement("option");
            option.text = "測站: " + site + ", 位於: " + place;
            option.value = site;
            var select = document.getElementById("airPollutantSiteSelect");
            select.appendChild(option);

        }
        getWeatherStatus(121.51715755462646 * 1, 25.04763902653048 * 1);
        // setCurrentAirPollutantInfoTable(AirPollutantArray[0]);

        //alreadyGotAirPollutantJson = false;
        //alreadyGotAirPollutantSiteJson = false;
    }
}

function addNewAirPollutantTableData(site, place, psi, status, majorPollutant, longitudeTWD97, latitudeTWD97, time) {
    var num = document.getElementById("airPollutantTable").rows.length;

    var Tr = document.getElementById("airPollutantTable").insertRow(num);


    Td = Tr.insertCell(Tr.cells.length);
    Td.innerHTML = site;

    Td = Tr.insertCell(Tr.cells.length);
    Td.innerHTML = place;

    Td = Tr.insertCell(Tr.cells.length);
    Td.innerHTML = psi;

    Td = Tr.insertCell(Tr.cells.length);
    Td.innerHTML = status;

    Td = Tr.insertCell(Tr.cells.length);
    Td.innerHTML = majorPollutant;

    //Td = Tr.insertCell(Tr.cells.length);
    //Td.innerHTML = longitudeTWD97;

    //Td = Tr.insertCell(Tr.cells.length);
    //Td.innerHTML = latitudeTWD97;

    Td = Tr.insertCell(Tr.cells.length);
    Td.innerHTML = time;
}

function onSelectAirPollutantSiteChange() {
    var siteName = document.getElementById("airPollutantSiteSelect").value;
    alert("你選擇了" + siteName + "測站");
    var select;
    for (var i = 0; i < AirPollutantArray.length; i++) {
        if (AirPollutantArray[i].SiteName == siteName) {
            setCurrentAirPollutantInfoTable(AirPollutantArray[i]);
            //GetWeatherDataByCountyName(AirPollutantArray[i].County);


            var match = $.grep(AirPollutantSiteArray, function (item) {
                return item.SiteName == AirPollutantArray[i].SiteName;
            });

            var longitudeTWD97;
            var latitudeTW97
            if (match) {
                longitudeTWD97 = match[0].TWD97Lon ? match[0].TWD97Lon : "N/A";
                latitudeTW97 = match[0].TWD97Lat ? match[0].TWD97Lat : "N/A";
            }
            else {
                longitudeTWD97 = "N/A";
                latitudeTW97 = "N/A";
            }
            var myLatLng = new google.maps.LatLng(latitudeTW97, longitudeTWD97);
            //myMap.setCenter(myLatLng, 15);
            //myMap.addControl(new GLargeMapControl());
            //myMarker = new GMarker(myLatLng);
            //myMap.addOverlay(myMarker);

            getWeatherStatus(longitudeTWD97, latitudeTW97);
            getAddress2(myLatLng);
            break;
        }
    }
}

function setCurrentAirPollutantInfoTable(currentObject) {
    document.getElementById("currentAirPollutantSiteName").innerHTML = currentObject.SiteName ? currentObject.SiteName : "N/A";
    document.getElementById("currentAirPollutantValue").innerHTML = currentObject.PSI ? currentObject.PSI : "N/A";
    document.getElementById("currentAirPollutantMajorPollutant").innerHTML = currentObject.MajorPollutant ? currentObject.MajorPollutant : "N/A";
    document.getElementById("currentAirPollutantStatus").innerHTML = currentObject.Status ? currentObject.Status : "N/A";
    document.getElementById("currentAirPollutantCounty").innerHTML = currentObject.County ? currentObject.County : "N/A";
    document.getElementById("currentAirPollutantPublishTime").innerHTML = currentObject.PublishTime ? currentObject.PublishTime : "N/A";
    //document.getElementById("weatherAirStatus").innerHTML = currentObject.Status ? "空氣品質: " + currentObject.Status : "空氣品質: N/A";
    //GetWeatherDataByCountyName(currentObject.County);
}



function loadRealTimeWeatherStatusData()
{
    var BasicQueryUrl = 'https://query.yahooapis.com/v1/public/yql?'
    var query = 'q=' +
        encodeURIComponent('select * from html where ' +
        '  url = "http://opendata.cwb.gov.tw/opendata/DIV2/O-A0003-001.xml" and ' +
        'xpath=' + "'" + '//location' + "'") + '&format=json';
    $.getJSON(BasicQueryUrl + query, function (data) {
        var obj = data.query.results.location;

        realTimeWeatherStatusDataArray = obj;
        updateRealTimeWeatherStatus();
    });
}

function updateRealTimeWeatherStatus()
{
    if (realTimeWeatherStatusDataArray != null && lastLng && lastLat)
    {

        var targetTemp;
        var targetObject;
        var minRealTimeWeatherStatusStation = 999999999;
        for (var index = 0; index < realTimeWeatherStatusDataArray.length; index++) {
            var distance = Math.abs(realTimeWeatherStatusDataArray[index].lon - lastLng) + Math.abs(realTimeWeatherStatusDataArray[index].lat - lastLat);
            if (distance < minRealTimeWeatherStatusStation) {
                minRealTimeWeatherStatusStation = distance;
                targetTemp = realTimeWeatherStatusDataArray[index].weatherelement[4].elementvalue.value;
                targetObject = realTimeWeatherStatusDataArray[index];
            }
        }
        var tempString = targetTemp.toString();
        document.getElementById("currentTemp").innerHTML = tempString ;
        currentTemp = tempString + "°C";
        alreadyUpdateRealTimeStatus = true;
        getLocation();

    }

}

function updateLittleHelperContent(helperId)
{
    if (helperId) {
        var BasicQueryUrl = 'https://query.yahooapis.com/v1/public/yql?'
        var query = 'q=' +
            encodeURIComponent('select * from html where ' +
            '  url = "http://opendata.cwb.gov.tw/opendata/MFC/' + helperId + '.xml" and ' +
            'xpath=' + "'" + '//dataset' + "'") + '&format=json';
        $.getJSON(BasicQueryUrl + query, function (data) {
            var obj = data.query.results;
            var helperString="";
            for (var index = 0; index < obj.dataset.parameterset.parameter.length;index++)
            {
                helperString = helperString + obj.dataset.parameterset.parameter[index].parametervalue + '<br />';
            }
            document.getElementById("helperInformation").innerHTML = helperString;

            //realTimeWeatherStatusDataArray = obj;
            //updateRealTimeWeatherStatus();
        });
    }
}

var jsonCity = {
    "results": {
        "table": [
        {
            "city": {
                "id": "KeelungList",
                "name": "基隆市"
            }
        },
        {
            "city": {
                "id": "TaipeiCityList",
                "name": "臺北市"
            }
        },
        {
            "city": {
                "id": "TaipeiList",
                "name": "新北市"
            }
        },
        {
            "city": {
                "id": "TaoyuanList",
                "name": "桃園縣"
            }
        },
        {
            "city": {
                "id": "HsinchuCityList",
                "name": "新竹市"
            }
        },
        {
            "city": {
                "id": "HsinchuList",
                "name": "新竹縣"
            }
        },
        {
            "city": {
                "id": "MiaoliList",
                "name": "苗栗縣"
            }
        },
        {
            "city": {
                "id": "TaichungList",
                "name": "臺中市"
            }
        },
        {
            "city": {
                "id": "ChanghuaList",
                "name": "彰化縣"
            }
        },
        {
            "city": {
                "id": "NantouList",
                "name": "南投縣"
            }
        },
        {
            "city": {
                "id": "YunlinList",
                "name": "雲林縣"
            }
        },
        {
            "city": {
                "id": "ChiayiCityList",
                "name": "嘉義市"
            }
        },
        {
            "city": {
                "id": "ChiayiList",
                "name": "嘉義縣"
            }
        },
        {
            "city": {
                "id": "YilanList",
                "name": "宜蘭縣"
            }
        },
        {
            "city": {
                "id": "HualienList",
                "name": "花蓮縣"
            }
        },
        {
            "city": {
                "id": "TaitungList",
                "name": "臺東縣"
            }
        },
        {
            "city": {
                "id": "TainanList",
                "name": "臺南市"
            }
        },
        {
            "city": {
                "id": "KaohsiungCityList",
                "name": "高雄市"
            }
        },
        {
            "city": {
                "id": "PingtungList",
                "name": "屏東縣"
            }
        },
        {
            "city": {
                "id": "MatsuList",
                "name": "連江縣"
            }
        },
        {
            "city": {
                "id": "KinmenList",
                "name": "金門縣"
            }
        },
        {
            "city": {
                "id": "PenghuList",
                "name": "澎湖縣"
            }
        }
        ]
    }
};

/*透過YQL取得氣象資料*/
function GetWeatherData(cityId) {
    var BasicQueryUrl = 'https://query.yahooapis.com/v1/public/yql?'
    var query = 'q=' +
        encodeURIComponent('select * from html where ' +
        '  url = "http://www.cwb.gov.tw/V7/forecast/f_index.htm" and ' +
        'xpath=' + "'" + '//tr[@id="' + cityId + '"]' + "'") + '&format=json';

    $.getJSON(BasicQueryUrl + query, function (data) {
        var Infohtml = '';
        var ImagUrl = '';
        //取得圖片,在最後一個元素
        var lastImglength = data.query.results.tr.td.length - 1;
        $.each(data.query.results.tr.td, function (i, val) {
            if (val.a.content != undefined) {
                var name = '';
                //alert(val.a.content);
                switch (i) {
                    case 0:
                        name = "縣市";
                        document.getElementById("weatherCounty").innerHTML = name + ": " + val.a.content;
                        break;
                    case 1:
                        name = "溫度";
                        document.getElementById("weatherTemperature").innerHTML = name + ": " + val.a.content;
                        break;
                    case 2:
                        name = "降雨機率";
                        document.getElementById("weatherRainPercentage").innerHTML = name + ": " + val.a.content;
                        break;
                }
                Infohtml += '<td width="100px;"><p>' + name + '</p>' + val.a.content + '</td>';
            }
        });
    });
}

function GetWeatherDataByCountyName(countyName) {
    //for (var i = 0; i < jsonCity.results.table.length; i++) {
    //    if (countyName == jsonCity.results.table[i].city.name) {
    //        //GetWeatherData(jsonCity.results.table[i].city.id);
    //        GetWeatherData(jsonCity.results.table[i].city.id);
    //        break;
    //    }
    //}
    document.getElementById("countyInformation").innerHTML = countyName;
    
    for (var i = 0; i < jsonCity2.results.table.length; i++) {
        if (countyName == jsonCity2.results.table[i].city.name) {
            //GetWeatherData(jsonCity.results.table[i].city.id);
            GetWeatherData2(jsonCity2.results.table[i].city.id);
            updateLittleHelperContent(jsonCity2.results.table[i].city.helperId)
            break;
        }
    }
}

//輸入地址取得位置，顯示地圖與資訊
function ShowAddress() {
    var address = document.getElementById('pac-input').value;
    if (geocoder) {
        geocoder.geocode({
                'address': address
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var marker = new google.maps.Marker({
                    position: results[0].geometry.location,
                    map: myMap,
                    title: 'You are here!',
                    });
                    showAddressOfResult(results[0], marker);
                    var currentLng = results[0].geometry.location.lng();
                    var currentLat = results[0].geometry.location.lat();
                    getWeatherStatus(currentLng, currentLat);
                }
                else {
                    alert("Reverse Geocoding failed because: " + status);
                }
            }
        );
    }
}

function saveAddress(){
    var address = document.getElementById('pac-input').value;
    if(address != ""){
        setCookie("address", address, 365);
    }
}

function setCookie(addr, avalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = addr + "=" + avalue + "; " + expires;
    alert("*"+ avalue +"*紀錄成功!!!");
}

function getCookie(addr) {
    var address = addr + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(address) == 0) {
            return c.substring(address.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var address = getCookie("address");
    if (address != "") {
        document.getElementById('pac-input').value = address;
    }
}

var jsonCity2 = {
    "results": {
        "table": [
        {
            "city": {
                "id": "Keelung_City",
                "name": "基隆市",
                "helperId": "F-C0032-011",
            }
        },
        {
            "city": {
                "id": "Taipei_City",
                "name": "臺北市",
                "helperId": "F-C0032-009",
            }
        },
        {
            "city": {
                "id": "New_Taipei_City",
                "name": "新北市",
                "helperId": "F-C0032-010",
            }
        },
        {
            "city": {
                "id": "Taoyuan_City",
                "name": "桃園市",
                "helperId": "F-C0032-022",
            }
        },
        {
            "city": {
                "id": "Hsinchu_City",
                "name": "新竹市",
                "helperId": "F-C0032-024",
            }
        },
        {
            "city": {
                "id": "Hsinchu_County",
                "name": "新竹縣",
                "helperId": "F-C0032-023",
            }
        },
        {
            "city": {
                "id": "Miaoli_County",
                "name": "苗栗縣",
                "helperId": "F-C0032-020",
            }
        },
        {
            "city": {
                "id": "Taichung_City",
                "name": "臺中市",
                "helperId": "F-C0032-021",
            }
        },
        {
            "city": {
                "id": "Changhua_County",
                "name": "彰化縣",
                "helperId": "F-C0032-028",
            }
        },
        {
            "city": {
                "id": "Nantou_County",
                "name": "南投縣",
                "helperId": "F-C0032-026",
            }
        },
        {
            "city": {
                "id": "Yunlin_County",
                "name": "雲林縣",
                "helperId": "F-C0032-029",
            }
        },
        {
            "city": {
                "id": "Chiayi_City",
                "name": "嘉義市",
                "helperId": "F-C0032-019",
            }
        },
        {
            "city": {
                "id": "Chiayi_County",
                "name": "嘉義縣",
                "helperId": "F-C0032-018",
            }
        },
        {
            "city": {
                "id": "Yilan_County",
                "name": "宜蘭縣",
                "helperId": "F-C0032-013",
            }
        },
        {
            "city": {
                "id": "Hualien_County",
                "name": "花蓮縣",
                "helperId": "F-C0032-012",
            }
        },
        {
            "city": {
                "id": "Taitung_County",
                "name": "臺東縣",
                "helperId": "F-C0032-027",
            }
        },
        {
            "city": {
                "id": "Tainan_City",
                "name": "臺南市",
                "helperId": "F-C0032-016",
            }
        },
        {
            "city": {
                "id": "Kaohsiung_City",
                "name": "高雄市",
                "helperId": "F-C0032-017",
            }
        },
        {
            "city": {
                "id": "Pingtung_County",
                "name": "屏東縣",
                "helperId": "F-C0032-025",
            }
        },
        {
            "city": {
                "id": "Lienchiang_County",
                "name": "連江縣",
                "helperId": "F-C0032-030",
            }
        },
        {
            "city": {
                "id": "Kinmen_County",
                "name": "金門縣",
                "helperId": "F-C0032-014",
            }
        },
        {
            "city": {
                "id": "Penghu_County",
                "name": "澎湖縣",
                "helperId": "F-C0032-015",
            }
        }
        ]
    }
};

var alreadyQueryWeatherData = false;
function GetWeatherData2(cityId) {
    //select * from html  where url='http://www.cwb.gov.tw/V7/forecast/taiwan/Keelung_City.htm' and xpath='//tbody//tr'
    var BasicQueryUrl = 'https://query.yahooapis.com/v1/public/yql?'
    var query = 'q=' +
        encodeURIComponent('select * from html where ' +
        '  url = "http://www.cwb.gov.tw/V7/forecast/taiwan/' + cityId + '.htm"' + ' and ' +
        'xpath=' + "'" + '//tbody//tr' + "'") + '&format=json';

    $.getJSON(BasicQueryUrl + query, function (data) {
        //alert(data.query.results.tr.length);
        document.getElementById("firstWeatherValidity").innerHTML = data.query.results.tr[0].th.content;
        document.getElementById("firstWeatherTemperature").innerHTML = data.query.results.tr[0].td[0];
        /// document.getElementById("firstWeatherStatus").innerHTML = data.query.results.tr[0].td[1].img.title;
        var imgSrc = (data.query.results.tr[0].td[1].img.src).split("/");
        document.getElementById("firstWeatherStatus").src = weatherIconUrl + imgSrc[imgSrc.length - 2] + '/' + imgSrc[imgSrc.length - 1];
        document.getElementById("firstWeatherStatus").title = data.query.results.tr[0].td[1].img.title;
        document.getElementById("firstWeatherComfort").innerHTML = data.query.results.tr[0].td[2];
        document.getElementById("firstWeatherRainPercentage").innerHTML = data.query.results.tr[0].td[3];

        document.getElementById("secondWeatherValidity").innerHTML = data.query.results.tr[1].th.content;
        document.getElementById("secondWeatherTemperature").innerHTML = data.query.results.tr[1].td[0];
        //document.getElementById("secondWeatherStatus").innerHTML = data.query.results.tr[1].td[1].img.title;
        //document.getElementById("secondWeatherStatus").src = 'Image/WeatherIcon/day/01.gif';
        imgSrc = (data.query.results.tr[1].td[1].img.src).split("/");
        document.getElementById("secondWeatherStatus").src = weatherIconUrl + imgSrc[imgSrc.length - 2] + '/' + imgSrc[imgSrc.length - 1];
        document.getElementById("secondWeatherStatus").title = data.query.results.tr[1].td[1].img.title;
        document.getElementById("secondWeatherComfort").innerHTML = data.query.results.tr[1].td[2];
        document.getElementById("secondWeatherRainPercentage").innerHTML = data.query.results.tr[1].td[3];

        document.getElementById("thirdWeatherValidity").innerHTML = data.query.results.tr[2].th.content;
        document.getElementById("thirdWeatherTemperature").innerHTML = data.query.results.tr[2].td[0];
        //document.getElementById("thirdWeatherStatus").innerHTML = data.query.results.tr[2].td[1].img.title;
        //document.getElementById("thirdWeatherStatus").src = 'Image/WeatherIcon/day/01.gif';
        imgSrc = (data.query.results.tr[2].td[1].img.src).split("/");
        document.getElementById("thirdWeatherStatus").src = weatherIconUrl + imgSrc[imgSrc.length - 2] + '/' + imgSrc[imgSrc.length - 1];
        document.getElementById("thirdWeatherStatus").title = data.query.results.tr[2].td[1].img.title;
        document.getElementById("thirdWeatherComfort").innerHTML = data.query.results.tr[2].td[2];
        document.getElementById("thirdWeatherRainPercentage").innerHTML = data.query.results.tr[2].td[3];
        $("#WeatherStatusTable").fadeIn(1000);
        $("#realTimeWeatherStatusTable").fadeIn(1000);
    });
   

}

