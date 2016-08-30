// 鄰近的iTaiwan熱點
var NearByHotSpotArray;

// 鄰近的景點
var NearByAttractionArray;

function getNearByITaiwanHotSpot(lon, lat)
{
    $.ajax({
        type: 'GET',
        url: node_jsServerUrl + "NearByITaiwan?Lat=" + lat + "&Lon=" + lon,
        success: function (response) {
            NearByHotSpotArray = JSON.parse(response);
            for (var index = 0; index < NearByHotSpotArray.length; index++)
            {
                var contentString = '<b>單位名稱: </b> ' + NearByHotSpotArray[index].Name + '<br>' +
                    '<b>地址: </b>' + NearByHotSpotArray[index].Address;

                setSubPageMarkerWithTimeoutAndImage(NearByHotSpotArray[index].Lat, NearByHotSpotArray[index].Lon, NearByHotSpotArray[index].Name, contentString, 'Image/iTaiwan2.png', index * 50, 30, 30, false);      
            }
        }
    });
}

function getNearByAttraction(lon, lat)
{
    $.ajax({
        type: 'GET',
        url: node_jsServerUrl + "NearByAttraction?Lat=" + lat + "&Lon=" + lon,
        success: function (response) {
            NearByAttractionArray = JSON.parse(response);
            for (var index = 0; index < NearByAttractionArray.length; index++) {
                var contentString = '<b style="color:red; font-size:150%;">' + NearByAttractionArray[index].NAME[0] + '</b>' + '<br>' +
                    NearByAttractionArray[index].DESCRIPTION[0] + '<br><br>' +
                    '<b style="color:blue; font-size:120%;">景點資訊</b><br>' +
                    '<b>地址: </b> ' + NearByAttractionArray[index].ADD[0] + '<br>' +
                    '<b>開放時間: </b> ' + NearByAttractionArray[index].OPENTIME[0] + '<br><br>' +

                    '<b style="color:blue; font-size:120%;">即時天氣資訊</b><br>' +
                    '<b>溫度: </b> ' + NearByAttractionArray[index].Temperature + '<br>' +
                    '<b>紫外線: </b> ' + getUVLevel(NearByAttractionArray[index].UVI) + '<br>' +
                    '<b>PM2.5: </b> ' + getPM2_5Level(NearByAttractionArray[index].PM2_5) + '<br>' +
                    '<b>空氣品質: </b> ' + NearByAttractionArray[index].AirStatus;
                    
                    
                setSubPageMarkerWithTimeoutAndImage(NearByAttractionArray[index].PY[0] * 1, NearByAttractionArray[index].PX[0] * 1, NearByAttractionArray[index].NAME[0], contentString, 'Image/attraction.png', index * 50, 50, 50, false);
            }
        }
    });
}

function getNearByBookMarks() {
    var result = getCookie("currentUser");
    if (result == "") {
        result = "123456789";
    }
    $.ajax({
        type: 'GET',
        url: node_jsServerUrl + "GetLocationBookmarks?id=" + result + "&Addr=" + '' + "&Lat=" + '' + "&Lon=" + '',
        success: function (response) {
            bookmarks = JSON.parse(response);
            for (var index = 0; index < bookmarks.length; index++) {
                var contentString = '<b>地點: </b> ' + bookmarks[index].Addr + '<br>';

                setSubPageMarkerWithTimeoutAndImage(bookmarks[index].Lat, bookmarks[index].Lon, bookmarks[index].Addr, contentString, 'Image/Favorites-icon.png', index * 50, 30, 30, false);
            }
        }
    });
}