var srcLng;
var srcLat;

var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var oldDirections = [];
var currentDirections = null;
var currentDirectionsTravelMode = google.maps.DirectionsTravelMode.DRIVING;
var currentTargetPosition;
function initSubPageMap(currentLat, currentLon) {
    srcLng = currentLon;
    srcLat = currentLat;
    geocoder = new google.maps.Geocoder();
    myMap = new google.maps.Map(document.getElementById('my_map'), {
        center: { lat: currentLat*1, lng: currentLon*1 },
        zoom: 13,
        mapTypeControlOptions: {
            position: google.maps.ControlPosition.LEFT_BOTTOM
        }
    });

    directionsDisplay = new google.maps.DirectionsRenderer({
        'map': myMap,
        'preserveViewport': true,
        'draggable': true
    });

    directionsDisplay.setPanel(document.getElementById("directions_panel"));

    google.maps.event.addListener(directionsDisplay, 'directions_changed',
        function () {
            if (currentDirections) {
                oldDirections.push(currentDirections);
            }
            currentDirections = directionsDisplay.getDirections();
        });

    popup = new google.maps.InfoWindow();

    setSubPageMarkerWithTimeoutAndImage(currentLat * 1, currentLon * 1, "Your position", "Your position", 'Image/you-are-here.png', 100, 50, 50, true);

    //setSubPageMarkerWithTimeout(currentLat * 1, currentLon * 1, "Current position", 200);

    $("li").click(function (e) {
        e.preventDefault();
        $("li").removeClass("selected");
        $(this).addClass("selected");
        var value = $(this)[0].id;

        switch (value) {
            case "DRIVING":
                currentDirectionsTravelMode = google.maps.DirectionsTravelMode.DRIVING;
                break;
            case "BICYCLING":
                currentDirectionsTravelMode = google.maps.DirectionsTravelMode.BICYCLING;
                break;
            case "TRANSIT":
                currentDirectionsTravelMode = google.maps.DirectionsTravelMode.TRANSIT;
                break;
            case "WALKING":
                currentDirectionsTravelMode = google.maps.DirectionsTravelMode.WALKING;
                break;
        }
        calcRoute(new google.maps.LatLng(srcLat, srcLng), currentTargetPosition, currentDirectionsTravelMode);
    });
}

function calcRoute(pFrom, pEnd, targetTravelMode) {

    var start = pFrom;
    var end = pEnd;
    var request = {
        origin: start,		//起始地
        destination: end,	//目的地
        travelMode: targetTravelMode //旅行工具 WALKING | DRIVING
    };
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            document.getElementById('emptyResultDiv').style.display = 'none';
            document.getElementById('directions_panel').style.display = 'block';
            //alert(directionsDisplay.getDirections().routes[0].legs[0].start_address);//起點地點：330台灣桃園縣桃園市興華路23號
            //alert(directionsDisplay.getDirections().routes[0].legs[0].end_address);		//alert(directionsDisplay.getDirections().routes[0].legs[0].distance.text);//24.8公里
            //alert(directionsDisplay.getDirections().routes[0].legs[0].duration.text);//31分鐘
            //alert(directionsDisplay.getDirections().routes[0].copyrights);//地圖資料 2011 Kingway
            //alert(directionsDisplay.getDirections().routes[0].legs[0].steps[0].instructions);//朝<b>西北</b>，走<b>興華路</b>，往<b>大智路</b>前進
            //alert(directionsDisplay.getDirections().routes[0].legs[0].steps[0].distance.text);//0.3公里

        }
        else
        {
            document.getElementById('emptyResultDiv').style.display = 'block';
            document.getElementById('directions_panel').style.display = 'none';
        }
    });

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
        
        google.maps.event.addListener(marker, 'click', function () {
            popup.setContent(this.buborek);
            popup.open(myMap, this);
            $("#DirectionMethodDiv").fadeIn(1000);

            //document.getElementById('drivingBtn').checked = true;                                   
            currentTargetPosition = this.position;
            calcRoute(new google.maps.LatLng(srcLat, srcLng), this.position, google.maps.DirectionsTravelMode.DRIVING);

        });
    }, timeout);


}



function onDirectiveTypeClick(sender) {
    switch (sender.value)
    {
        case "DRIVING":
            currentDirectionsTravelMode = google.maps.DirectionsTravelMode.DRIVING;
            break;
        case "BICYCLING":
            currentDirectionsTravelMode = google.maps.DirectionsTravelMode.BICYCLING;
            break;
        case "TRANSIT":
            currentDirectionsTravelMode = google.maps.DirectionsTravelMode.TRANSIT;
            break;
        case "WALKING":
            currentDirectionsTravelMode = google.maps.DirectionsTravelMode.WALKING;
            break;
    }
    calcRoute(new google.maps.LatLng(srcLat, srcLng), currentTargetPosition, currentDirectionsTravelMode);
}