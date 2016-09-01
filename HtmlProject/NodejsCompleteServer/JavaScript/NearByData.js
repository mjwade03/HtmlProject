// 鄰近的iTaiwan熱點
var NearByHotSpotArray;

// 鄰近的景點
var NearByAttractionArray;

function getNearByITaiwanHotSpot(lon, lat)
{
    var result = getCookie("currentUser");
    if (result == "") {
        result = "123456789";
    }
    $.ajax({
        type: 'GET',
        url: node_jsServerUrl + "NearByITaiwan?id=" + result + "&Lat=" + lat + "&Lon=" + lon,
        success: function (response) {
            NearByHotSpotArray = JSON.parse(response);
            for (var index = 0; index < NearByHotSpotArray.length; index++)
            {
                var contentString = '<b>單位名稱: </b> ' + NearByHotSpotArray[index].Name + '<br>' +
                    '<b>地址: </b>' + NearByHotSpotArray[index].Address + '<br>';
                if (NearByHotSpotArray[index].isBookmark)
                    contentString += "<a target='_parent' style='font-size:120%;' href='javascript: void(0)' onclick=\"RemoveBookmark('" + NearByHotSpotArray[index].Name + ',' + false + "')\">★移除紀錄</a>";
                else
                    contentString += "<a target='_parent' style='font-size:120%;' href='javascript: void(0)' onclick=\"AddITaiwanBookmark('" +
                        NearByHotSpotArray[index].Name + ',' + NearByHotSpotArray[index].Lat + ',' + NearByHotSpotArray[index].Lon + "')\">★紀錄地點</a>" + '<br>';

                setSubPageMarkerWithTimeoutAndImage(NearByHotSpotArray[index].Lat, NearByHotSpotArray[index].Lon, NearByHotSpotArray[index].Name, contentString, 'Image/iTaiwan2.png', index * 50, 30, 30, false, false);      
            }
        }
    });
}

function getNearByAttraction(lon, lat)
{
    var result = getCookie("currentUser");
    if (result == "") {
        result = "123456789";
    }
    $.ajax({
        type: 'GET',
        url: node_jsServerUrl + "NearByAttraction?id=" + result + "&Lat=" + lat + "&Lon=" + lon,
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
                    '<b>空氣品質: </b> ' + NearByAttractionArray[index].AirStatus + '<br>';
                if (NearByAttractionArray[index].isBookmark)
                    contentString += "<a target='_parent' style='font-size:120%;' href='javascript: void(0)' onclick=\"RemoveBookmark('" + NearByAttractionArray[index].NAME[0] + ',' + false + "')\">★移除紀錄</a>";
                else
                    contentString += "<a target='_parent' style='font-size:120%;' href='javascript: void(0)' onclick=\"AddAttractionBookmark('" +
                    NearByAttractionArray[index].NAME[0] + ',' + NearByAttractionArray[index].PY[0] * 1 + ',' + NearByAttractionArray[index].PX[0] * 1 + ',' +
                    NearByAttractionArray[index].Temperature + ',' + getUVLevel(NearByAttractionArray[index].UVI) + ',' +
                    getPM2_5Level(NearByAttractionArray[index].PM2_5) + ',' + NearByAttractionArray[index].AirStatus + "')\">★紀錄地點</a>" + '<br>';

                setSubPageMarkerWithTimeoutAndImage(NearByAttractionArray[index].PY[0] * 1, NearByAttractionArray[index].PX[0] * 1, NearByAttractionArray[index].NAME[0], contentString, 'Image/attraction.png', index * 50, 50, 50, false, false);
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
        url: node_jsServerUrl + "GetNearLocationBookmarks?id=" + result + "&Addr=" + '' + "&Lat=" + '' + "&Lon=" + '',
        success: function (response) {
            bookmarks = JSON.parse(response);
            for (var index = 0; index < bookmarks.length; index++) {
                var contentString = '<b>地點: </b> ' + bookmarks[index].Addr + '<br>'+
                '<b style="color:blue; font-size:120%;">即時天氣資訊</b><br>' +
                    '<b>溫度: </b> ' + bookmarks[index].Temperature + '<br>' +
                    '<b>紫外線: </b> ' + getUVLevel(bookmarks[index].UVI) + '<br>' +
                    '<b>PM2.5: </b> ' + getPM2_5Level(bookmarks[index].PM2_5) + '<br>' +
                    '<b>空氣品質: </b> ' + bookmarks[index].AirStatus + '<br>' +
                    "<a target='_parent' style='font-size:120%;' href='javascript: void(0)' onclick=\"RemoveBookmark('" + bookmarks[index].Addr + ',' + true + ',' + "Bookmark" + "')\">★移除紀錄</a>";

                setSubPageMarkerWithTimeoutAndImage(bookmarks[index].Lat, bookmarks[index].Lon, bookmarks[index].Addr, contentString, 'Image/Favorites-icon.png', index * 50, 30, 30, false, true);
            }
        }
    });
}

function checkLocation1(addr, lat, lon, callback) {
    var result = getCookie("currentUser");
    if (result == "") {
        result = "123456789";
    }
    $.ajax({
        type: 'GET',
        url: node_jsServerUrl + "GetLocationBookmarks?id=" + result + "&Addr=" + addr + "&Lat=" + lat + "&Lon=" + lon,
        success: function (response) {
            if (response && response.length > 2) {
                callback(true);
            }
            else
                callback(false);
        }
    });
}

function AddITaiwanBookmark(currentData) {
    var result = getCookie("currentUser");
    if (result == "") {
        result = "123456789";
    }
    var dataArray = currentData.split(",");
    $.ajax({
        type: 'GET',
        url: node_jsServerUrl + "AddLocationBookmark?id=" + result + "&Addr=" + dataArray[0] + "&Lat=" + dataArray[1] + "&Lon=" + dataArray[2],
        success: function (response) {
            generate('success', dataArray[0] + ' - 紀錄成功!!!');
            var contentString = '<b>地點: </b> ' + dataArray[0] + '<br>' +
                "<a target='_parent' style='font-size:120%;' href='javascript: void(0)' onclick=\"RemoveBookmark('" + dataArray[0] + "')\">★移除紀錄</a>";

            setSubPageMarkerWithTimeoutAndImage(dataArray[1], dataArray[2], dataArray[0], contentString, 'Image/Favorites-icon.png', 1000, 30, 30, false, true);

            for (var index = 0; index < NearByHotSpotArray.length; index++) {
                if (dataArray[0] == NearByHotSpotArray[index].Name) {
                    var contentString = '<b>單位名稱: </b> ' + NearByHotSpotArray[index].Name + '<br>' +
                        '<b>地址: </b>' + NearByHotSpotArray[index].Address + '<br>';

                    NearByHotSpotArray[index].isBookmark = true;
                    contentString += "<a target='_parent' style='font-size:120%;' href='javascript: void(0)' onclick=\"RemoveBookmark('" + NearByHotSpotArray[index].Name + ',' + false + "')\">★移除紀錄</a>";

                    currentMarker.setMap(undefined);
                    setSubPageMarkerWithTimeoutAndImage(NearByHotSpotArray[index].Lat, NearByHotSpotArray[index].Lon, NearByHotSpotArray[index].Name, contentString, 'Image/iTaiwan2.png', index * 50, 30, 30, false, false);      

                    break;
                }
            }
        }
    });
}

function AddAttractionBookmark(currentData) {
    var result = getCookie("currentUser");
    if (result == "") {
        result = "123456789";
    }
    var dataArray = currentData.split(",");

    $.ajax({
        type: 'GET',
        url: node_jsServerUrl + "AddLocationBookmark?id=" + result + "&Addr=" + dataArray[0] + "&Lat=" + dataArray[1] + "&Lon=" + dataArray[2],
        success: function (response) {
            generate('success', dataArray[0] + ' - 紀錄成功!!!');
            var contentString = '<b>地點: </b> ' + dataArray[0] + '<br>' +
                '<b style="color:blue; font-size:120%;">即時天氣資訊</b><br>' +
                '<b>溫度: </b> ' + dataArray[3] + '<br>' +
                '<b>紫外線: </b> ' + dataArray[4] + '<br>' +
                '<b>PM2.5: </b> ' + dataArray[5] + '<br>' +
                '<b>空氣品質: </b> ' + dataArray[6] + '<br>' +
                "<a target='_parent' style='font-size:120%;' href='javascript: void(0)' onclick=\"RemoveBookmark('" + dataArray[0] + "')\">★移除紀錄</a>";

            setSubPageMarkerWithTimeoutAndImage(dataArray[1], dataArray[2], dataArray[0], contentString, 'Image/Favorites-icon.png', 1000, 30, 30, false, true);
            for (var index = 0; index < NearByAttractionArray.length; index++) {
                if (dataArray[0] == NearByAttractionArray[index].NAME[0]) {
                    var contentString = '<b style="color:red; font-size:150%;">' + NearByAttractionArray[index].NAME[0] + '</b>' + '<br>' +
                        NearByAttractionArray[index].DESCRIPTION[0] + '<br><br>' +
                        '<b style="color:blue; font-size:120%;">景點資訊</b><br>' +
                        '<b>地址: </b> ' + NearByAttractionArray[index].ADD[0] + '<br>' +
                        '<b>開放時間: </b> ' + NearByAttractionArray[index].OPENTIME[0] + '<br><br>' +

                        '<b style="color:blue; font-size:120%;">即時天氣資訊</b><br>' +
                        '<b>溫度: </b> ' + NearByAttractionArray[index].Temperature + '<br>' +
                        '<b>紫外線: </b> ' + getUVLevel(NearByAttractionArray[index].UVI) + '<br>' +
                        '<b>PM2.5: </b> ' + getPM2_5Level(NearByAttractionArray[index].PM2_5) + '<br>' +
                        '<b>空氣品質: </b> ' + NearByAttractionArray[index].AirStatus + '<br>';
                    NearByAttractionArray[index].isBookmark = true;
                    contentString += "<a target='_parent' style='font-size:120%;' href='javascript: void(0)' onclick=\"RemoveBookmark('" + NearByAttractionArray[index].NAME[0] + ',' + false + "')\">★移除紀錄</a>";

                    currentMarker.setMap(undefined);
                    setSubPageMarkerWithTimeoutAndImage(NearByAttractionArray[index].PY[0] * 1, NearByAttractionArray[index].PX[0] * 1, NearByAttractionArray[index].NAME[0], contentString, 'Image/attraction.png', index * 50, 50, 50, false, false);

                    break;
                }
            }
        }
    });
}

function RemoveBookmark(currentData) {

    var result = getCookie("currentUser");
    if (result == "") {
        result = "123456789";
    }
    var dataArray = currentData.split(",");

    $.ajax({
        type: 'GET',
        url: node_jsServerUrl + "RemoveLocationBookmark?id=" + result + "&Addr=" + dataArray[0] + "&Lat=" + '' + "&Lon=" + '',
        success: function (response) {
            generate('success', dataArray[0] + ' - 移除紀錄成功!!!');
            if (dataArray[1] == true)
                currentMarker.setMap(undefined);
            else {
                for (var index = 0; index < bookmarkMarkerArray.length; index++) {
                    if (bookmarkMarkerArray[index].title == dataArray[0]) {
                        bookmarkMarkerArray[index].setMap(undefined);
                        bookmarkMarkerArray.splice(index, 1);
                        break;
                    }
                }
            }
            for (var index = 0; index < NearByHotSpotArray.length; index++) {
                if (currentMarker.title == NearByHotSpotArray[index].Name) {
                    var contentString = '<b>單位名稱: </b> ' + NearByHotSpotArray[index].Name + '<br>' +
                        '<b>地址: </b>' + NearByHotSpotArray[index].Address + '<br>';
                    NearByHotSpotArray[index].isBookmark = true;
                    contentString += "<a target='_parent' style='font-size:120%;' href='javascript: void(0)' onclick=\"AddITaiwanBookmark('" +
                        NearByHotSpotArray[index].Name + ',' + NearByHotSpotArray[index].Lat + ',' + NearByHotSpotArray[index].Lon + "')\">★紀錄地點</a>" + '<br>';

                    currentMarker.setMap(undefined);
                    setSubPageMarkerWithTimeoutAndImage(NearByHotSpotArray[index].Lat, NearByHotSpotArray[index].Lon, NearByHotSpotArray[index].Name, contentString, 'Image/iTaiwan2.png', index * 50, 30, 30, false, false);
                    break;
                }
            }
            for (var index = 0; index < NearByAttractionArray.length; index++) {
                if (currentMarker.title == NearByAttractionArray[index].NAME[0]) {
                    var contentString = '<b style="color:red; font-size:150%;">' + NearByAttractionArray[index].NAME[0] + '</b>' + '<br>' +
                        NearByAttractionArray[index].DESCRIPTION[0] + '<br><br>' +
                        '<b style="color:blue; font-size:120%;">景點資訊</b><br>' +
                        '<b>地址: </b> ' + NearByAttractionArray[index].ADD[0] + '<br>' +
                        '<b>開放時間: </b> ' + NearByAttractionArray[index].OPENTIME[0] + '<br><br>' +

                        '<b style="color:blue; font-size:120%;">即時天氣資訊</b><br>' +
                        '<b>溫度: </b> ' + NearByAttractionArray[index].Temperature + '<br>' +
                        '<b>紫外線: </b> ' + getUVLevel(NearByAttractionArray[index].UVI) + '<br>' +
                        '<b>PM2.5: </b> ' + getPM2_5Level(NearByAttractionArray[index].PM2_5) + '<br>' +
                        '<b>空氣品質: </b> ' + NearByAttractionArray[index].AirStatus + '<br>';
                    NearByAttractionArray[index].isBookmark = true;
                    contentString += "<a target='_parent' style='font-size:120%;' href='javascript: void(0)' onclick=\"AddAttractionBookmark('" +
                        NearByAttractionArray[index].NAME[0] + ',' + NearByAttractionArray[index].PY[0] * 1 + ',' + NearByAttractionArray[index].PX[0] * 1 + ',' +
                        NearByAttractionArray[index].Temperature + ',' + getUVLevel(NearByAttractionArray[index].UVI) + ',' +
                        getPM2_5Level(NearByAttractionArray[index].PM2_5) + ',' + NearByAttractionArray[index].AirStatus + "')\">★紀錄地點</a>" + '<br>';

                    currentMarker.setMap(undefined);
                    setSubPageMarkerWithTimeoutAndImage(NearByAttractionArray[index].PY[0] * 1, NearByAttractionArray[index].PX[0] * 1, NearByAttractionArray[index].NAME[0], contentString, 'Image/attraction.png', index * 50, 50, 50, false, false);
                    break;
                }
            }

            directionsDisplay.set('directions', null);
            document.getElementById('DirectionMethodDiv').style.display = 'none';
        }
    });
}

