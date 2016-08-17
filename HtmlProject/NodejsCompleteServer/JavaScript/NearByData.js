var NearByHotSpotArray;
var NearByAttractionArray;

function getNearByITaiwanHotSpot(lon, lat)
{
    $.ajax({
        type: 'GET',
        url: node_jsServerUrl + "NearByITaiwan?Lat=" + lat + "&Lon=" + lon,
        success: function (response) {
            NearByHotSpotArray = JSON.parse(response);

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

        }
    });
}