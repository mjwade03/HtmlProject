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

                setSubPageMarkerWithTimeoutAndImage(NearByHotSpotArray[index].Lat, NearByHotSpotArray[index].Lon, NearByHotSpotArray[index].Name, contentString, 'Image/iTaiwan2.png', index * 100, 30, 30, false);      
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
                var contentString = '<b>景點名稱: </b> ' + NearByAttractionArray[index].NAME[0] + '<br>' +
                    '<b>地址: </b> ' + NearByAttractionArray[index].ADD[0] + '<br>' +
                    '<b>開放時間: </b> ' + NearByAttractionArray[index].OPENTIME[0] + '<br><br>' +
                    NearByAttractionArray[index].DESCRIPTION[0];
                setSubPageMarkerWithTimeoutAndImage(NearByAttractionArray[index].PY[0] * 1, NearByAttractionArray[index].PX[0] * 1, NearByAttractionArray[index].NAME[0], contentString, 'Image/attraction.png', index * 100, 50, 50, false);
            }
        }
    });
}