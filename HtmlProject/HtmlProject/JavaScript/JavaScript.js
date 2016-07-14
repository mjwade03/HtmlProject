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
var geocoder = null;

var myMap;
var myMarker;

function load() {

    loadUVJsonpData();
    loadUVSitenData();
    loadAirPollutantJsonData();
    loadAirPollutantSiteJsonData();


    if (GBrowserIsCompatible()) {
        myMap = new GMap2(document.getElementById("my_map"));
        var myLatLng = new GLatLng(25.04763902653048, 121.51715755462646);
        myMap.setCenter(myLatLng, 15);
        myMap.addControl(new GLargeMapControl());
        //document.getElementById('inLatLng').value = myLatLng.toString();
        document.getElementById('inLatLng').innerHTML = "經緯度: " + myLatLng.toString();

        myMarker = new GMarker(myLatLng);
        myMap.addOverlay(myMarker);
        GEvent.addListener(myMap, "click", function (overlay, point) {
            if (point) {
                //設定標註座標
                var currentLng = point.lng();
                var currentLat = point.lat();
                myMarker.setLatLng(point);
                //document.getElementById('inLatLng').value = point.toString();
                document.getElementById('inLatLng').innerHTML = "經緯度: " + point.toString();
                getWeatherStatus(currentLng, currentLat);

            }
        });
        geocoder = new GClientGeocoder();
    }
}

function getWeatherStatus(currentLng, currentLat) {
    getAddress(currentLng, currentLat);
    if (UVArray.length == 0 || UVSiteArray.length == 0 || AirPollutantArray.length == 0 || AirPollutantSiteArray.length == 0) {
        alert("Weather data not ready");
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
                GetWeatherDataByCountyName(UVArray[i]);
                break;
            }
        }

        // Find the nearst air pollutant site
        var minAirPollutantSiteDistance = 999999999;
        for (var i = 0; i < AirPollutantSiteArray.length; i++) {
            var distance = Math.abs(AirPollutantSiteArray[i].TWD97Lon - currentLng) + Math.abs(AirPollutantSiteArray[i].TWD97Lat - currentLat);
            if (distance < minAirPollutantSiteDistance) {
                minAirPollutantSiteDistance = distance;
                targetAirPollutantSiteName = AirPollutantSiteArray[i].SiteName;
            }
        }
        for (var i = 0; i < AirPollutantArray.length; i++) {
            if (AirPollutantArray[i].SiteName == targetAirPollutantSiteName) {
                setCurrentAirPollutantInfoTable(AirPollutantArray[i]);
                GetWeatherDataByCountyName(AirPollutantArray[i].County);
                break;
            }
        }
    }
}

function getAddress(currentLng, currentLat) {

    var arrLatLng = eval('[' + currentLat + ',' + currentLng + ']');
    var myLatLng = new GLatLng(arrLatLng[0], arrLatLng[1]);

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

function loadUVJsonpData() {
    loadJsonpData(queryUVJsonUrl);
}

function loadUVSitenData() {
    loadJsonpData(queryUVSiteJsonUrl);
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

    Td = Tr.insertCell(Tr.cells.length);
    Td.innerHTML = longitudeTWD97;

    Td = Tr.insertCell(Tr.cells.length);
    Td.innerHTML = latitudeTWD97;

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
            GetWeatherDataByCountyName(UVArray[i]);
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

function setCurrentUVInfoTable(currentObject) {
    document.getElementById("currentUVSiteName").innerHTML = currentObject.SiteName ? currentObject.SiteName : "N/A";
    document.getElementById("currentUVValue").innerHTML = currentObject.UVI ? currentObject.UVI : "N/A";
    document.getElementById("currentUVLevel").innerHTML = getUVLevel(currentObject.UVI);
    document.getElementById("currentUVSiteCounty").innerHTML = currentObject.County ? currentObject.County : "N/A";
    document.getElementById("currentUVPublishTime").innerHTML = currentObject.PublishTime ? currentObject.PublishTime : "N/A";
    document.getElementById("weatherUVLevel").innerHTML = "紫外線等級:" + getUVLevel(currentObject.UVI);
    //GetWeatherDataByCountyName(currentObject.County);
}

function loadAirPollutantJsonData() {
    loadJsonpData(queryAirPollutantJsonUrl);
}

function loadAirPollutantSiteJsonData() {
    loadJsonpData(queryAirPollutantSiteJsonUrl);
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

    Td = Tr.insertCell(Tr.cells.length);
    Td.innerHTML = longitudeTWD97;

    Td = Tr.insertCell(Tr.cells.length);
    Td.innerHTML = latitudeTWD97;

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
            GetWeatherDataByCountyName(AirPollutantArray[i].County);
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
    document.getElementById("weatherAirStatus").innerHTML = currentObject.Status ? "空氣品質: " + currentObject.Status : "空氣品質: N/A";
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
        document.getElementById("weatherValidity").innerHTML = data.query.results.tr[0].th.content;
        document.getElementById("weatherTemperature").innerHTML = "溫度: " + data.query.results.tr[0].td[0];
        document.getElementById("weatherRainPercentage").innerHTML = "降雨機率: " + data.query.results.tr[0].td[3];

    });


}

