var currentLng;
var currentLat;
var lastMarker;
function initSubPageMap(currentLat, currentLon) {
    geocoder = new google.maps.Geocoder();
    myMap = new google.maps.Map(document.getElementById('my_map'), {
        center: { lat: currentLat*1, lng: currentLon*1 },
        zoom: 13,
        mapTypeControlOptions: {
            position: google.maps.ControlPosition.LEFT_BOTTOM
        }
    });
    popup = new google.maps.InfoWindow();

    setSubPageMarkerWithTimeoutAndImage(currentLat * 1, currentLon * 1, "Your position", "Your position", 'Image/you-are-here.png', 100, 50, 50, true);

    //setSubPageMarkerWithTimeout(currentLat * 1, currentLon * 1, "Current position", 200);
}
function setSubPageMarkerWithTimeout(lat, lon, displayContent, timeout) {

    window.setTimeout(function () {
        var myLatlng = new google.maps.LatLng(lat, lon);
        var marker = new google.maps.Marker({
            position: myLatlng,
            title: displayContent
        });

        // To add the marker to the map, call setMap();
        marker.setMap(myMap);


        var popupContent = '123Test';
        popup.setContent(popupContent);
        popup.open(myMap, marker);
    }, timeout);


}

function setSubPageMarkerWithTimeoutAndImage(lat, lon, displayTitle, displayContent, image, timeout, iconWidth, iconHeight, openPopUp) {

    window.setTimeout(function () {
        var resizeImage = {
            url: image,
            scaledSize: new google.maps.Size(iconHeight, iconWidth)
        };
        var myLatlng = new google.maps.LatLng(lat, lon);
        var marker = new google.maps.Marker({
            position: myLatlng,
            title: displayTitle,
            icon: resizeImage,
            buborek: displayContent 
        });

        // To add the marker to the map, call setMap();
        marker.setMap(myMap);

        if (openPopUp == true)
        {
            popup.setContent(displayContent);
            popup.open(myMap, marker);
        }

        var contentString = displayContent;

        lastMarker = marker;
        google.maps.event.addListener(marker, 'click', function () {
            popup.setContent(this.buborek);
            popup.open(myMap, this);

        });
    }, timeout);


}
