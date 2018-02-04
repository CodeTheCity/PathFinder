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


$(document).ready(function(){

    $('#route').hide();


    pullTours();

    pullWaypoints.then(() => {
        directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer({map: map});

    calculateAndDisplayRoute(directionsDisplay, directionsService);
    google.maps.event.trigger(map, 'resize');
});

    //Change locations
    $('#tours').change(function(){
        clearRoute();

        var tour = $('#tours option:selected').text();
        tourID = $('#tours option:selected').val();

        console.log(tourID);

        waypointsURL =  'https://ctc12.azurewebsites.net/api/Waypoints/tour/' + tourID;
        console.log(waypointsURL);

        pullWaypoints.then(() => {
        $('#tour-name').html(tour);
        directionsService = new google.maps.DirectionsService;
        directionsDisplay = new google.maps.DirectionsRenderer({map: map});

        calculateAndDisplayRoute(directionsDisplay, directionsService);
        google.maps.event.trigger(map, 'resize');
    });





    });

    //Redirect to display page with route id on start route clicked
    $('#start-form').on('submit',function()
    {
        window.location.replace('../display/?id=' + $('#tours').val());
        return false;
    });

});

function pullTours(){
    $.getJSON(toursURL, function( data ) {
        var items = [];

        $.each( data, function( key, val ) {

            var name = val.Name;
            var id = val.TourId;
            console.log(name);
            $('#tours').append('<option value="' + id + '">' + name + '</option>');

        });

        var tour =$('#tours option:selected').text();


        $('#tour-name').html(tour);

    });
}

// function pullWaypoints(){
 var pullWaypoints = new Promise(function (resolve) {
     //letter array for easily identify the  names
     var letter = ["A","B","C","D","E","F","G","H","I","J"];
     var letterCount = 0;

     $.getJSON(waypointsURL, function( data ) {

         $.each(data, function( key, val ) {
             //items.push(key, val);
             var lat = val.Latitude;
             var lng =  val.Longitude;
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
         });
         resolve();
     });

 });



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
