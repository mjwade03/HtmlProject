﻿var queryUVJsonUrl = 'http://opendata.epa.gov.tw/ws/Data/UV/?$orderby=PublishTime%20desc&$skip=0&$top=1000&format=json';
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
var geocoder = null;

var myMap;
var myMarker;
var popup;

function load() {


    loadUVJsonpData();
    loadUVSitenData();
    loadAirPollutantJsonData();
    loadAirPollutantSiteJsonData();

    initMap();
    getLocation();
    // if (GBrowserIsCompatible()) {
    //     myMap = new GMap2(document.getElementById("my_map"));
    //     var myLatLng = new GLatLng(25.04763902653048, 121.51715755462646);
    //     myMap.setCenter(myLatLng, 15);
    //     myMap.addControl(new GLargeMapControl());
    //     //document.getElementById('inLatLng').value = myLatLng.toString();
    //     document.getElementById('inLatLng').innerHTML = "經緯度: " + myLatLng.toString();

    //     myMarker = new GMarker(myLatLng);
    //     myMap.addOverlay(myMarker);
    //     GEvent.addListener(myMap, "click", function (overlay, point) {
    //         if (point) {
    //             //設定標註座標
    //             var currentLng = point.lng();
    //             var currentLat = point.lat();
    //             myMarker.setLatLng(point);
    //             //document.getElementById('inLatLng').value = point.toString();
    //             document.getElementById('inLatLng').innerHTML = "經緯度: " + point.toString();
    //             getWeatherStatus(currentLng, currentLat);

    //         }
    //     });
    //     geocoder = new GClientGeocoder();
    // }
}

function initMap() {
    geocoder = new google.maps.Geocoder();
    myMap = new google.maps.Map(document.getElementById('my_map'), {
    center: {lat: 25.04763902653048, lng: 121.51715755462646},
    zoom: 15
    });
    popup = new google.maps.InfoWindow();

    // myMarker = new google.maps.Marker(myMap.getPosition);

    // myMap.addOverlay(myMarker);
    // GEvent.addListener(myMap, "click", function (overlay, point) {
    //     if (point) {
    //         //設定標註座標
    //         var currentLng = point.lng();
    //         var currentLat = point.lat();
    //         myMarker.setLatLng(point);
    //         //document.getElementById('inLatLng').value = point.toString();
    //         document.getElementById('inLatLng').innerHTML = "經緯度: " + point.toString();
    //         getWeatherStatus(currentLng, currentLat);

    //     }
    // });
}

function getWeatherStatus(currentLng, currentLat) {
    // getAddress(currentLng, currentLat);
    getAddress2();
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
                document.getElementById("weatherUVLevel").innerHTML = "紫外線等級:" + getUVLevel(UVArray[i].UVI);
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

                    document.getElementById("weatherAirStatus").innerHTML = AirPollutantArray[i].Status ? "空氣品質: " + AirPollutantArray[i].Status : "空氣品質: N/A";
                    document.getElementById("weatherPM25Level").innerHTML = AirPollutantArray[i]["PM2.5"] ? "PM2.5等級: " + getPM2_5Level(AirPollutantArray[i]["PM2.5"]) : "PM2.5等級: N/A";
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
    }
}

function getAddress(currentLng, currentLat) {

    var arrLatLng = eval('[' + currentLat + ',' + currentLng + ']');
    var myLatLng = new google.maps.LatLng(arrLatLng[0], arrLatLng[1]);

    var myGeocoder = new GClientGeocoder();
    myGeocoder.getLocations(myLatLng, function (addresses) {
        if (addresses.Status.code != 200) {
            alert("此座標沒有找到對應的地址 " + myLatLng.toUrlValue());
        } else {
            var result = addresses.Placemark[0];
            myMarker.openInfoWindowHtml(result.address);
            document.getElementById('currentAddress').innerHTML = result.address;
        }
    });
}

function getAddress2(){
    var markerPosition = myMarker.getPosition();

    // 將經緯度透過 Google map API 反查地址
    geocoder.geocode({
        'latLng': markerPosition
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results) {
                showAddressOfResult(results[0], myMarker);
            }
        } else {
            alert("Reverse Geocoding failed because: " + status);
        }
    });
}

// 設定 marker 的訊息泡泡
function showAddressOfResult(result, marker) {
    // alert(result.formatted_address);

    // myMap.setCenter(marker.getPosition());
    // myMarker.openInfoWindowHtml(result.formatted_address);
    // document.getElementById('currentAddress').innerHTML = result.formatted_address;

    var popupContent = '<b>地址: </b> ' + result.formatted_address;
    popup.setContent(popupContent);
    popup.open(myMap, marker);
}

//定位
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("您的瀏覽器不支援定位服務");
    }
}

function showPosition(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    latlon = new google.maps.LatLng(lat, lon)
    myMap = document.getElementById('my_map')
    myMap.style.height = '500px';
    myMap.style.width = '500px';

    var myOptions = {
    center:latlon,zoom:14,
    mapTypeId:google.maps.MapTypeId.ROADMAP,
    mapTypeControl:false,
    navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
    }
    
    myMap = new google.maps.Map(document.getElementById("my_map"), myOptions);
    myMarker = new google.maps.Marker({position:latlon,map:myMap,title:"You are here!"});
    google.maps.event.addListener()
    getAddress2();
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

function loadUVJsonpData() {
    loadJsonpData2(queryUVJsonUrl);
}

function loadUVSitenData() {
    loadJsonpData2(queryUVSiteJsonUrl);
}

function updateUVData() {
    if (alreadyGotUVJson == true && alreadyGotUVSiteJson == true) {
        for (var i = 0; i < UVArray.length; i++) {
            var site = UVArray[i].SiteName ? UVArray[i].SiteName : "N/A";
            var uvi = UVArray[i].UVI ? Math.round(UVArray[i].UVI) : "N/A";
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

            addNewUVData(site, uvi, publisher, place, longitudeWGS84, latitudeWGS84, longitudeTWD97, latitudeTW97, time);

            var option = document.createElement("option");
            option.text = "測站: " + site + ", 位於: " + place;
            option.value = site;
            var select = document.getElementById("UVSiteSelect");
            select.appendChild(option);

        }
        // setCurrentUVInfoTable(UVArray[0]);
        getWeatherStatus(121.51715755462646 * 1, 25.04763902653048 * 1);
        alreadyGotUVJson = false;
        alreadyGotUVSiteJson = false;
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

            var myLatLng = new GLatLng(latitudeTW97, longitudeTWD97);
            myMap.setCenter(myLatLng, 15);
            myMap.addControl(new GLargeMapControl());
            myMarker = new GMarker(myLatLng);
            myMap.addOverlay(myMarker);


            getWeatherStatus(longitudeTWD97, latitudeTW97);

            break;
        }
    }
}

function getUVLevel(UVI) {
    if (UVI >= 0 && UVI <= 2)
        return "低量級";
    else if (UVI >= 3 && UVI <= 5)
        return "中量級";
    else if (UVI >= 6 && UVI <= 7)
        return "高量級";
    else if (UVI >= 8 && UVI <= 10)
        return "過量級";
    else if (UVI >= 11)
        return "危險級";
    else
        return "N/A";
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
function setCurrentUVInfoTable(currentObject) {
    document.getElementById("currentUVSiteName").innerHTML = currentObject.SiteName ? currentObject.SiteName : "N/A";
    document.getElementById("currentUVValue").innerHTML = currentObject.UVI ? Math.round(currentObject.UVI) : "N/A";
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

            addNewAirPollutantTableData(site, place, psi, status, majorPollutant, longitudeTWD97, latitudeTWD97, time);

            var option = document.createElement("option");
            option.text = "測站: " + site + ", 位於: " + place;
            option.value = site;
            var select = document.getElementById("airPollutantSiteSelect");
            select.appendChild(option);

        }
        getWeatherStatus(121.51715755462646 * 1, 25.04763902653048 * 1);
        // setCurrentAirPollutantInfoTable(AirPollutantArray[0]);

        alreadyGotAirPollutantJson = false;
        alreadyGotAirPollutantSiteJson = false;
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
            var myLatLng = new GLatLng(latitudeTW97, longitudeTWD97);
            myMap.setCenter(myLatLng, 15);
            myMap.addControl(new GLargeMapControl());
            myMarker = new GMarker(myLatLng);
            myMap.addOverlay(myMarker);

            getWeatherStatus(longitudeTWD97, latitudeTW97);
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
    document.getElementById("countyInformation").innerHTML = countyName + "天氣狀況";
    
    for (var i = 0; i < jsonCity2.results.table.length; i++) {
        if (countyName == jsonCity2.results.table[i].city.name) {
            //GetWeatherData(jsonCity.results.table[i].city.id);
            GetWeatherData2(jsonCity2.results.table[i].city.id);
            break;
        }
    }
}

//輸入地址取得位置，顯示地圖與資訊
function ShowAddress() {
    var address = document.getElementById('inAddr').value;
    if (geocoder) {
        geocoder.getLatLng(
            address,
            function (point) {
                if (!point) {
                    alert(address + " not found");
                } else {
                    myMap = new GMap2(document.getElementById("my_map"));
                    myMap.setCenter(point, 15);
                    myMap.addControl(new GLargeMapControl());
                    // document.getElementById('inLatLng').value = point.toString();
                    document.getElementById('inLatLng').innerHTML = "Current LatLng: " + point.toString();
                    //設定標註座標
                    var currentLng = point.lng();
                    var currentLat = point.lat();
                    getWeatherStatus(currentLng, currentLat);
                    myMarker = new GMarker(point);
                    myMap.addOverlay(myMarker);

                    GEvent.addListener(myMap, "click", function (overlay, point) {
                        if (point) {
                            //設定標註座標
                            var currentLng = point.lng();
                            var currentLat = point.lat();
                            myMarker.setLatLng(point);
                            //document.getElementById('inLatLng').value = point.toString();
                            document.getElementById('inLatLng').innerHTML = "Current LatLng: " + point.toString();
                            getWeatherStatus(currentLng, currentLat);
                        }
                    });
                }
            }
            );
    }
}

var jsonCity2 = {
    "results": {
        "table": [
        {
            "city": {
                "id": "Keelung_City",
                "name": "基隆市"
            }
        },
        {
            "city": {
                "id": "Taipei_City",
                "name": "臺北市"
            }
        },
        {
            "city": {
                "id": "New_Taipei_City",
                "name": "新北市"
            }
        },
        {
            "city": {
                "id": "Taoyuan_City",
                "name": "桃園縣"
            }
        },
        {
            "city": {
                "id": "Hsinchu_City",
                "name": "新竹市"
            }
        },
        {
            "city": {
                "id": "Hsinchu_County",
                "name": "新竹縣"
            }
        },
        {
            "city": {
                "id": "Miaoli_County",
                "name": "苗栗縣"
            }
        },
        {
            "city": {
                "id": "Taichung_City",
                "name": "臺中市"
            }
        },
        {
            "city": {
                "id": "Changhua_County",
                "name": "彰化縣"
            }
        },
        {
            "city": {
                "id": "Nantou_County",
                "name": "南投縣"
            }
        },
        {
            "city": {
                "id": "Yunlin_County",
                "name": "雲林縣"
            }
        },
        {
            "city": {
                "id": "Chiayi_City",
                "name": "嘉義市"
            }
        },
        {
            "city": {
                "id": "Chiayi_County",
                "name": "嘉義縣"
            }
        },
        {
            "city": {
                "id": "Yilan_County",
                "name": "宜蘭縣"
            }
        },
        {
            "city": {
                "id": "Hualien_County",
                "name": "花蓮縣"
            }
        },
        {
            "city": {
                "id": "Taitung_County",
                "name": "臺東縣"
            }
        },
        {
            "city": {
                "id": "Tainan_City",
                "name": "臺南市"
            }
        },
        {
            "city": {
                "id": "Kaohsiung_City",
                "name": "高雄市"
            }
        },
        {
            "city": {
                "id": "Pingtung_County",
                "name": "屏東縣"
            }
        },
        {
            "city": {
                "id": "Lienchiang_County",
                "name": "連江縣"
            }
        },
        {
            "city": {
                "id": "Kinmen_County",
                "name": "金門縣"
            }
        },
        {
            "city": {
                "id": "Penghu_County",
                "name": "澎湖縣"
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
        document.getElementById("firstWeatherStatus").innerHTML = data.query.results.tr[0].td[1].img.title;
        document.getElementById("firstWeatherComfort").innerHTML = data.query.results.tr[0].td[2];
        document.getElementById("firstWeatherRainPercentage").innerHTML = data.query.results.tr[0].td[3];

        document.getElementById("secondWeatherValidity").innerHTML = data.query.results.tr[1].th.content;
        document.getElementById("secondWeatherTemperature").innerHTML = data.query.results.tr[1].td[0];
        document.getElementById("secondWeatherStatus").innerHTML = data.query.results.tr[1].td[1].img.title;
        document.getElementById("secondWeatherComfort").innerHTML = data.query.results.tr[1].td[2];
        document.getElementById("secondWeatherRainPercentage").innerHTML = data.query.results.tr[1].td[3];

        document.getElementById("thirdWeatherValidity").innerHTML = data.query.results.tr[2].th.content;
        document.getElementById("thirdWeatherTemperature").innerHTML = data.query.results.tr[2].td[0];
        document.getElementById("thirdWeatherStatus").innerHTML = data.query.results.tr[2].td[1].img.title;
        document.getElementById("thirdWeatherComfort").innerHTML = data.query.results.tr[2].td[2];
        document.getElementById("thirdWeatherRainPercentage").innerHTML = data.query.results.tr[2].td[3];

    });


}

