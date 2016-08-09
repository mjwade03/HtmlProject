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
var alreadyGotRealTimeStatus = false;

// 自訂的Node.js server
var node_jsServerUrl = "http://127.0.0.1:3000/";

// 顯示天氣狀況的icon
var weatherIconUrl = 'Image/WeatherIcon/';

// 台灣的行政區
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

//// Function not used now
//function loadJsonpData(targetUrl) {
//    $.ajax({
//        type: 'GET',
//        url: targetUrl,
//        dataType: 'jsonp',
//        success: function (response) {
//            switch (targetUrl) {
//                case queryUVJsonUrl:
//                    UVArray = response;
//                    alreadyGotUVJson = true;
//                    updateUVData();
//                    break;
//                case queryUVSiteJsonUrl:
//                    UVSiteArray = response;
//                    alreadyGotUVSiteJson = true;
//                    updateUVData();
//                    break;
//                case queryAirPollutantJsonUrl:
//                    AirPollutantArray = response;
//                    alreadyGotAirPollutantJson = true;
//                    updateAirPollutantData();
//                    break;
//                case queryAirPollutantSiteJsonUrl:
//                    AirPollutantSiteArray = response;
//                    alreadyGotAirPollutantSiteJson = true;
//                    updateAirPollutantData();
//                    break;
//            }
//        }
//    });
//}

//function addNewUVData(site, uvi, publisher, place, longitudeWGS84, latitudeWGS84, longitudeTWD97, latitudeTWD97, time) {
//    var num = document.getElementById("uvTable").rows.length;

//    var Tr = document.getElementById("uvTable").insertRow(num);


//    Td = Tr.insertCell(Tr.cells.length);
//    Td.innerHTML = site;

//    Td = Tr.insertCell(Tr.cells.length);
//    Td.innerHTML = place;

//    Td = Tr.insertCell(Tr.cells.length);
//    Td.innerHTML = uvi;

//    Td = Tr.insertCell(Tr.cells.length);
//    Td.innerHTML = publisher;



//    //Td = Tr.insertCell(Tr.cells.length);
//    //Td.innerHTML = longitudeWGS84;

//    //Td = Tr.insertCell(Tr.cells.length);
//    //Td.innerHTML = latitudeWGS84;

//    //Td = Tr.insertCell(Tr.cells.length);
//    //Td.innerHTML = longitudeTWD97;

//    //Td = Tr.insertCell(Tr.cells.length);
//    //Td.innerHTML = latitudeTWD97;

//    Td = Tr.insertCell(Tr.cells.length);
//    Td.innerHTML = time;
//}
//function onSelectUVSiteChange() {
//    var siteName = document.getElementById("UVSiteSelect").value;
//    alert("你選擇了" + siteName + "測站");
//    var select;
//    for (var i = 0; i < UVArray.length; i++) {
//        if (UVArray[i].SiteName == siteName) {
//            setCurrentUVInfoTable(UVArray[i]);
//            //GetWeatherDataByCountyName(UVArray[i].County);


//            var match = $.grep(UVSiteArray, function (item) {
//                return item.SiteName == UVArray[i].SiteName;
//            });

//            var longitudeTWD97;
//            var latitudeTW97
//            if (match) {
//                longitudeTWD97 = match[0].TWD97Lon ? match[0].TWD97Lon : "N/A";
//                latitudeTW97 = match[0].TWD97Lat ? match[0].TWD97Lat : "N/A";
//            }
//            else {
//                longitudeTWD97 = "N/A";
//                latitudeTW97 = "N/A";
//            }

//            var myLatLng = new google.maps.LatLng(latitudeTW97, longitudeTWD97);
//            //myMap.setCenter(myLatLng, 15);
//            //myMap.addControl(new GLargeMapControl());
//            //myMarker = new GMarker(myLatLng);
//            //myMap.addOverlay(myMarker);


//            getWeatherStatus(longitudeTWD97, latitudeTW97);
//            getAddress2(myLatLng);

//            break;
//        }
//    }
//}
//function addNewAirPollutantTableData(site, place, psi, status, majorPollutant, longitudeTWD97, latitudeTWD97, time) {
//    var num = document.getElementById("airPollutantTable").rows.length;

//    var Tr = document.getElementById("airPollutantTable").insertRow(num);


//    Td = Tr.insertCell(Tr.cells.length);
//    Td.innerHTML = site;

//    Td = Tr.insertCell(Tr.cells.length);
//    Td.innerHTML = place;

//    Td = Tr.insertCell(Tr.cells.length);
//    Td.innerHTML = psi;

//    Td = Tr.insertCell(Tr.cells.length);
//    Td.innerHTML = status;

//    Td = Tr.insertCell(Tr.cells.length);
//    Td.innerHTML = majorPollutant;

//    //Td = Tr.insertCell(Tr.cells.length);
//    //Td.innerHTML = longitudeTWD97;

//    //Td = Tr.insertCell(Tr.cells.length);
//    //Td.innerHTML = latitudeTWD97;

//    Td = Tr.insertCell(Tr.cells.length);
//    Td.innerHTML = time;
//}
//function onSelectAirPollutantSiteChange() {
//    var siteName = document.getElementById("airPollutantSiteSelect").value;
//    alert("你選擇了" + siteName + "測站");
//    var select;
//    for (var i = 0; i < AirPollutantArray.length; i++) {
//        if (AirPollutantArray[i].SiteName == siteName) {
//            setCurrentAirPollutantInfoTable(AirPollutantArray[i]);
//            //GetWeatherDataByCountyName(AirPollutantArray[i].County);


//            var match = $.grep(AirPollutantSiteArray, function (item) {
//                return item.SiteName == AirPollutantArray[i].SiteName;
//            });

//            var longitudeTWD97;
//            var latitudeTW97
//            if (match) {
//                longitudeTWD97 = match[0].TWD97Lon ? match[0].TWD97Lon : "N/A";
//                latitudeTW97 = match[0].TWD97Lat ? match[0].TWD97Lat : "N/A";
//            }
//            else {
//                longitudeTWD97 = "N/A";
//                latitudeTW97 = "N/A";
//            }
//            var myLatLng = new google.maps.LatLng(latitudeTW97, longitudeTWD97);
//            //myMap.setCenter(myLatLng, 15);
//            //myMap.addControl(new GLargeMapControl());
//            //myMarker = new GMarker(myLatLng);
//            //myMap.addOverlay(myMarker);

//            getWeatherStatus(longitudeTWD97, latitudeTW97);
//            getAddress2(myLatLng);
//            break;
//        }
//    }
//}
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
        getLocation();
    });
}

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

function loadRealTimeWeatherStatusData() {
    // 原本使用YQL的方法
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

function updateRealTimeWeatherStatus() {
    if (realTimeWeatherStatusDataArray != undefined && lastLng && lastLat) {

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
        document.getElementById("currentTemp").innerHTML = tempString;
        currentTemp = tempString + "°C";
        alreadyGotRealTimeStatus = true;
    }

}

function updateLittleHelperContent(helperId) {
    if (helperId) {
        var BasicQueryUrl = 'https://query.yahooapis.com/v1/public/yql?'
        var query = 'q=' +
            encodeURIComponent('select * from html where ' +
                '  url = "http://opendata.cwb.gov.tw/opendata/MFC/' + helperId + '.xml" and ' +
                'xpath=' + "'" + '//dataset' + "'") + '&format=json';
        $.getJSON(BasicQueryUrl + query, function (data) {
            var obj = data.query.results;
            var helperString = "";
            for (var index = 0; index < obj.dataset.parameterset.parameter.length; index++) {
                helperString = helperString + obj.dataset.parameterset.parameter[index].parametervalue + '<br />';
            }
            document.getElementById("helperInformation").innerHTML = helperString;
        });
    }
}

//// Function not used now end


function getWeatherStatus(currentLng, currentLat) {
    lastLat = currentLat;
    lastLng = currentLng;
    if ((UVArray != undefined && UVArray.length == 0) ||
        (UVSiteArray != undefined && UVSiteArray.length == 0) ||
        (AirPollutantArray != undefined && AirPollutantArray.length == 0) ||
        (AirPollutantSiteArray != undefined && AirPollutantSiteArray.length == 0)) {
        // alert("Weather data not ready");
    }
    else if (UVArray == undefined ||
        UVSiteArray == undefined ||
        AirPollutantArray == undefined ||
        AirPollutantSiteArray == undefined) {
        // alert("Weather data not ready");
    }
    else {
        var targetUVSiteName;
        var targetAirPollutantSiteName;

        // Find the nearest UV site
        var minUVSiteDistance = 999999999;
        for (var i = 0; i < UVSiteArray.length; i++) {
            var distance = Math.abs(UVSiteArray[i].TWD97Lon - currentLng) + Math.abs(UVSiteArray[i].TWD97Lat - currentLat);
            if (distance < minUVSiteDistance) {
                minUVSiteDistance = distance;
                targetUVSiteName = UVSiteArray[i].SiteName;
            }
        }

        // Get the UV status based on the UV site name
        var UVGrepResult = $.grep(UVArray, function (e) { return e.SiteName == targetUVSiteName; });
        if (UVGrepResult.length > 0)
        {
            setCurrentUVInfoTable(UVGrepResult[0]);
            document.getElementById("weatherUVLevel").innerHTML = getUVLevel(UVGrepResult[0].UVI);
            setTextColorByUVLevel(document.getElementById("weatherUVLevel"), UVGrepResult[0].UVI);
            currentUVStatus = getUVLevel(UVGrepResult[0].UVI);
            //GetWeatherDataByCountyName(UVGrepResult[0].County);
        }
        //// Change the UV drop down list to this station
        //var sel = document.getElementById('UVSiteSelect');
        //var opts = sel.options;

        //for (var index = 0; index < opts.length; index++) {
        //    var opt = opts[index];

        //    if (opt.value == targetUVSiteName) {
        //        sel.selectedIndex = index;
        //        break;
        //    }
        //}

        // Find the nearest air pollutant site
        var minAirPollutantSiteDistance = 999999999;
        if (AirPollutantSiteArray != undefined) {
            for (var i = 0; i < AirPollutantSiteArray.length; i++) {
                var distance = Math.abs(AirPollutantSiteArray[i].TWD97Lon - currentLng) + Math.abs(AirPollutantSiteArray[i].TWD97Lat - currentLat);
                if (distance < minAirPollutantSiteDistance) {
                    minAirPollutantSiteDistance = distance;
                    targetAirPollutantSiteName = AirPollutantSiteArray[i].SiteName;
                }
            }
        }

        // Get the air pollutant status based on air pollutant site name
        var AirPollutantGrepResult = $.grep(AirPollutantArray, function (e) { return e.SiteName == targetAirPollutantSiteName; });
        if (AirPollutantGrepResult.length > 0) {
            setCurrentAirPollutantInfoTable(AirPollutantGrepResult[0]);
            document.getElementById("weatherAirStatus").innerHTML = AirPollutantGrepResult[0].Status ? AirPollutantGrepResult[0].Status : "N/A";
            setTextColorByPSILevel(document.getElementById("weatherAirStatus"), AirPollutantGrepResult[0]["PSI"]);

            document.getElementById("weatherPM25Level").innerHTML = AirPollutantGrepResult[0]["PM2_5"] ? getPM2_5Level(AirPollutantGrepResult[0]["PM2_5"]) : "N/A";
            setTextColorByPM2_5Level(document.getElementById("weatherPM25Level"), AirPollutantGrepResult[0]["PM2_5"]);

            currentAirPollutantStatus = AirPollutantGrepResult[0].Status ? AirPollutantGrepResult[0].Status : "N/A";
            cuuentPM2_5 = AirPollutantGrepResult[0]["PM2_5"] ? getPM2_5Level(AirPollutantGrepResult[0]["PM2_5"]) : "N/A";

        }
        //// Change the air pollutant drop down list to this station
        //sel = document.getElementById('airPollutantSiteSelect');
        //opts = sel.options;

        //for (var index = 0; index < opts.length; index++) {
        //    var opt = opts[index];

        //    if (opt.value == targetAirPollutantSiteName) {
        //        sel.selectedIndex = index;
        //        break;
        //    }
        //}


        // Get the weather data based on the county name
        GetWeatherDataByCountyName(AirPollutantGrepResult[0].County);

        // 更新即時氣象資訊(溫度, 紫外線, PM2.5, 空氣品質)
        if (ishttps)
            updateRealTimeWeatherStatus();
        else
            updateRealTimeWeatherStatusByNodeJs();
    }
}

function loadJsonpData3(targetData) {
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
                    AirPollutantArray = JSON.parse(response);
                    alreadyGotAirPollutantJson = true;
                    updateAirPollutantData();
                    break;
                case "AirPollutantSite":
                    AirPollutantSiteArray = JSON.parse(response);
                    alreadyGotAirPollutantSiteJson = true;
                    updateAirPollutantData();
                    break;
                case "RealTimeWeatherStatus":
                    var obj = JSON.parse(response);
                    var arrayObject = obj.cwbopendata;
                    if (arrayObject == undefined)
                        arrayObject = obj[0].cwbopendata;
                    realTimeWeatherStatusDataArray = arrayObject.location;
                    alreadyGotRealTimeStatus = true;
                    break;
                default:
                    break;
            }
            getLocation();
        }
    });
}

//紫外線相關的
function loadUVJsonpData() {
    if (ishttps)
        loadJsonpData2(queryUVJsonUrl);
    else
        loadJsonpData3("UV");
}

function loadUVSitenData() {
    if (ishttps)
        loadJsonpData2(queryUVSiteJsonUrl);
    else
        loadJsonpData3("UVSite");
}

function updateUVData() {
    if (alreadyGotUVJson == true && alreadyGotUVSiteJson == true) {
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
        //getWeatherStatus(121.51715755462646 * 1, 25.04763902653048 * 1);
        //alreadyGotUVJson = false;
        //alreadyGotUVSiteJson = false;
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

function setTextColorByUVLevel(element, UVI) {
    var roundUVI = Math.round(UVI);
    if (roundUVI >= 0 && roundUVI <= 5)
        element.style.color = "green";
    else if (roundUVI >= 6)
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





// 空氣品質相關
function getPM2_5Level(PM2_5) {
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

function setTextColorByPM2_5Level(element, PM2_5) {
    if (PM2_5 >= 0 && PM2_5 <= 53)
        element.style.color = "green";
    else if (PM2_5 >= 54)
        element.style.color = "red";
    else
        element.style.color = "black";
}

function setTextColorByPSILevel(element, PSI) {
    if (PSI <= 100)
        element.style.color = "green";
    else if (PSI >= 101)
        element.style.color = "red";
    else
        element.style.color = "black";
}

function loadAirPollutantJsonData() {
    if (ishttps)
        loadJsonpData2(queryAirPollutantJsonUrl);
    else
        loadJsonpData3("AirPollutant");
}

function loadAirPollutantSiteJsonData() {
    if (ishttps)
        loadJsonpData2(queryAirPollutantSiteJsonUrl);
    else
        loadJsonpData3("AirPollutantSite");
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

            // addNewAirPollutantTableData(site, place, psi, status, majorPollutant, longitudeTWD97, latitudeTWD97, time);

            var option = document.createElement("option");
            option.text = "測站: " + site + ", 位於: " + place;
            option.value = site;
            var select = document.getElementById("airPollutantSiteSelect");
            select.appendChild(option);

        }
        //getWeatherStatus(121.51715755462646 * 1, 25.04763902653048 * 1);
        // setCurrentAirPollutantInfoTable(AirPollutantArray[0]);

        //alreadyGotAirPollutantJson = false;
        //alreadyGotAirPollutantSiteJson = false;
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




// 即時天氣資訊相關
function loadRealTimeWeatherStatusDataByNodeJs() {
    loadJsonpData3("RealTimeWeatherStatus");
}

function updateRealTimeWeatherStatusByNodeJs() {
    if (realTimeWeatherStatusDataArray != undefined && lastLng && lastLat) {

        var targetTemp;
        var minRealTimeWeatherStatusStation = 999999999;
        for (var index = 0; index < realTimeWeatherStatusDataArray.length; index++) {
            var distance = Math.abs(realTimeWeatherStatusDataArray[index].lon[0] - lastLng) + Math.abs(realTimeWeatherStatusDataArray[index].lat[0] - lastLat);
            if (distance < minRealTimeWeatherStatusStation) {
                minRealTimeWeatherStatusStation = distance;
                targetTemp = realTimeWeatherStatusDataArray[index].weatherElement[4].elementValue[0].value[0];
            }
        }
        var tempString = targetTemp.toString();
        document.getElementById("currentTemp").innerHTML = tempString;
        currentTemp = tempString + "°C";
    }
}



// 特定行政區域天氣小幫手資訊相關
function updateLittleHelperContentByNodeJs(helperId) {
    if (helperId) {
        $.ajax({
            type: 'GET',
            url: node_jsServerUrl + "LittleHelper" + "?ID=" + helperId,
            success: function (response) {
                var obj = JSON.parse(response);
                var arrayObject = obj.cwbopendata;
                if (arrayObject == undefined)
                    arrayObject = obj[0].cwbopendata;
                
                var helperString = "";
                for (var index = 0; index < arrayObject.dataset[0].parameterSet[0].parameter.length; index++) {
                    helperString = helperString + arrayObject.dataset[0].parameterSet[0].parameter[index].parameterValue[0] + '<br />';
                }
                document.getElementById("helperInformation").innerHTML = helperString;
            }
        });
    }
}

function GetWeatherDataByCountyName(countyName) {
    document.getElementById("countyInformation").innerHTML = countyName;
    for (var i = 0; i < jsonCity2.results.table.length; i++) {
        if (countyName == jsonCity2.results.table[i].city.name) {

            // 從中央氣象局網頁parse天氣預告的資料
            if (ishttps)
                GetWeatherData2(jsonCity2.results.table[i].city.id);
            else
                GetWeatherDataByNodeJs(jsonCity2.results.table[i].city.id);

            // 取得該縣市的天氣小幫手資訊
            if (ishttps)
                updateLittleHelperContent(jsonCity2.results.table[i].city.helperId);
            else
                updateLittleHelperContentByNodeJs(jsonCity2.results.table[i].city.helperId);
            break;
        }
    }
}

function GetWeatherDataByNodeJs(cityId) {
    $.ajax({
        type: 'GET',
        url: node_jsServerUrl + "WeatherReport" + "?targetCity=" + cityId,
        success: function (response) {
            var obj = JSON.parse(response);
            if (obj[0].children)
            {
                var data = obj[0].children;

                // First time slot
                document.getElementById("firstWeatherValidity").innerHTML = data[0].children[1].children[0].content;
                document.getElementById("firstWeatherTemperature").innerHTML = data[0].children[3].children[0].content;
                var imgSrc = data[0].children[5].children[1].attributes.src.split("/");
                document.getElementById("firstWeatherStatus").src = weatherIconUrl + imgSrc[imgSrc.length - 2] + '/' + imgSrc[imgSrc.length - 1];
                document.getElementById("firstWeatherStatus").title = data[0].children[5].children[1].attributes.title;
                document.getElementById("firstWeatherComfort").innerHTML = data[0].children[7].children[0].content;
                document.getElementById("firstWeatherRainPercentage").innerHTML = data[0].children[9].children[0].content;

                // Second time slot
                document.getElementById("secondWeatherValidity").innerHTML = data[1].children[1].children[0].content;
                document.getElementById("secondWeatherTemperature").innerHTML = data[1].children[3].children[0].content;
                imgSrc = data[1].children[5].children[1].attributes.src.split("/");
                document.getElementById("secondWeatherStatus").src = weatherIconUrl + imgSrc[imgSrc.length - 2] + '/' + imgSrc[imgSrc.length - 1];
                document.getElementById("secondWeatherStatus").title = data[1].children[5].children[1].attributes.title;
                document.getElementById("secondWeatherComfort").innerHTML = data[1].children[7].children[0].content;
                document.getElementById("secondWeatherRainPercentage").innerHTML = data[1].children[9].children[0].content;

                // Third time slot
                document.getElementById("thirdWeatherValidity").innerHTML = data[2].children[1].children[0].content;
                document.getElementById("thirdWeatherTemperature").innerHTML = data[2].children[3].children[0].content;
                imgSrc = data[2].children[5].children[1].attributes.src.split("/");
                document.getElementById("thirdWeatherStatus").src = weatherIconUrl + imgSrc[imgSrc.length - 2] + '/' + imgSrc[imgSrc.length - 1];
                document.getElementById("thirdWeatherStatus").title = data[2].children[5].children[1].attributes.title;
                document.getElementById("thirdWeatherComfort").innerHTML = data[2].children[7].children[0].content;
                document.getElementById("thirdWeatherRainPercentage").innerHTML = data[2].children[9].children[0].content;

                // Fade in the table when data is ready
                $("#WeatherStatusTable").fadeIn(1000);
                $("#realTimeWeatherStatusTable").fadeIn(1000);
            }
        }
    });
}