﻿function initMap() {
    geocoder = new google.maps.Geocoder();
    myMap = new google.maps.Map(document.getElementById('my_map'), {
        center: { lat: 25.04763902653048, lng: 121.51715755462646 },
        zoom: 15,
        mapTypeControlOptions: {
            position: google.maps.ControlPosition.LEFT_BOTTOM
        }
    });
    popup = new google.maps.InfoWindow();

    myMarker = new google.maps.Marker({ position: myMap.getPosition, map: myMap, title: "You are here!" });

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
    var pacload = document.getElementById('pac-load');
    myMap.controls[google.maps.ControlPosition.TOP_LEFT].push(pacload);

    // Bias the SearchBox results towards current map's viewport.
    myMap.addListener('bounds_changed', function () {
        searchBox.setBounds(myMap.getBounds());
    });

    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        ShowAddress();
    });
    // checkCookie();
}

// 將經緯度透過 Google map API 反查地址
function getAddress2(latLng) {
    geocoder.geocode({
        'latLng': latLng
    }, function (results, status) {
        myMarker.setMap(undefined);
        if (status == google.maps.GeocoderStatus.OK) {
            if (results) {
                var marker = new google.maps.Marker({
                    position: latLng,
                    map: myMap,
                    title: 'You are here!',
                });
                myMarker = marker;
                marker.addListener("click", function () {
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
        alreadyGotRealTimeStatus == true &&
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


    getWeatherStatus(lon, lat);

    latlon = new google.maps.LatLng(lat, lon)
    getWeatherStatus(lon, lat);
    getAddress2(latlon);
}

function showError(error) {
    switch (error.code) {
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

//輸入地址取得位置，顯示地圖與資訊
function ShowAddress() {
    var address = document.getElementById('pac-input').value;
    if(address.length > 0){
        if (geocoder) {
            geocoder.geocode({
                'address': address
            }, function (results, status) {
                myMarker.setMap(undefined);
                if (status == google.maps.GeocoderStatus.OK) {
                    var marker = new google.maps.Marker({
                        position: results[0].geometry.location,
                        map: myMap,
                        title: 'You are here!',
                    });
                    myMarker = marker;
                    marker.addListener("click", function () {
                        popup.open(myMap, myMarker);
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
}

function saveAddress() {
    var address = document.getElementById('pac-input').value;
    if (address != "") {
        setCookie("address", address, 365);
    }
    else
        alert("請輸入地點!!!");
}

function loadAddress() {
    checkCookie();
    ShowAddress();
}

function setCookie(addr, avalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = addr + "=" + avalue + "; " + expires;
    alert("*" + avalue + "*紀錄成功!!!");
}

function getCookie(addr) {
    var address = addr + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
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
    else
        alert("無紀錄!!!");
}
