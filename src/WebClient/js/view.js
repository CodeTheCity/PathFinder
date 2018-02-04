/* View Previous Route script
*
*
*/
var map;
var infowindow;
var infowindows = [];
var markers = [];
var directionsService;
var directionsDisplay;
var ratings = [];
var tourID = 1;
var waypointsURL = 'https://ctc12.azurewebsites.net/api/Waypoints/tour/' + tourID;
var toursURL = 'https://ctc12.azurewebsites.net/api/tours';
console.log(waypointsURL);


$(document).ready(function () {

    $('#route').hide();


    pullTours();

    pullWaypoints(waypointsURL).then(() => {
        directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer({map: map});

    calculateAndDisplayRoute(directionsDisplay, directionsService);
    google.maps.event.trigger(map, 'resize');
});

    //Change locations
    $('#tours').change(function () {
        clearRoute();

        var tour = $('#tours option:selected').text();
        tourID = $('#tours option:selected').val();

        console.log(tourID);

        waypointsURL = 'https://ctc12.azurewebsites.net/api/Waypoints/tour/' + tourID;
        console.log(waypointsURL);

        pullWaypoints(waypointsURL).then(() => {
            directionsService = new google.maps.DirectionsService;
        directionsDisplay = new google.maps.DirectionsRenderer({map: map});

        calculateAndDisplayRoute(directionsDisplay, directionsService);
        google.maps.event.trigger(map, 'resize');
    });

        $('#tour-name').html(tour);

    });

    //Redirect to display page with route id on start route clicked
    $('#start-form').on('submit', function () {
        window.location.replace('../display/?id=' + $('#tours').val());
        return false;
    });

});

function pullTours() {
    $.getJSON(toursURL, function (data) {
        var items = [];

        $.each(data, function (key, val) {

            var name = val.Name;
            var id = val.TourId;
            console.log(name);
            $('#tours').append('<option value="' + id + '">' + name + '</option>');

        });

        var tour = $('#tours option:selected').text();


        $('#tour-name').html(tour);

    });
}

// function pullWaypoints(){
function pullWaypoints(waypointsURL) {
    return new Promise((resolve) => {

        //a 	b 	c 	d 	e 	f 	g 	h 	i 	j 	k 	l 	m 	n 	o 	p 	q 	r 	s 	t 	u 	v 	w 	x 	y 	z
        //letter array for easily identify the  names
        var letter = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        var letterCount = 0;
    var count = 0;
    $.getJSON(waypointsURL, function (data) {



        $.each(data, function (key, val) {
            if (count < 15) {
                //items.push(key, val);
                var lat = val.Latitude;
                var lng = val.Longitude;
                var name = val.Name;
                var url = val.Url;
                var hasFee = val.HasFee;
                var isAccessible = val.IsAccessible;
                var hasParking = val.HasParking;
                console.log(name);

                infowindows.push({
                    Name: name,
                    url: url,
                    hasFee: hasFee,
                    isAccessible: isAccessible,
                    hasParking: hasParking
                });

                var location = new google.maps.LatLng(+lat, +lng); //convert lat + lng into location


                $('#route-list').append('<li><span style="color:green;">' + letter[letterCount] + ': </span>' + name + '</li>');

                //add marker details to marker array
                markers.push({
                    location: location,
                    stopover: true
                });

                letterCount++;

            }
            console.log(count);
            count++;

        });

        // shuffleArray(markers);

        if(markers.length >= 15)
        {
           markers = markers.slice(0,14);
        }

        resolve();
     });
    });
}


function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}


    /*
    * Google maps
    * */
    function initMap() {

        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 0, lng: 0},
            zoom: 2,
            fullscreenControl: true
        });

        // Add custom map controls to the map
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('controls-select-container'));

    }
