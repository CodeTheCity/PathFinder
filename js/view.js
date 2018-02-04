 /* View Previous Route script
 *
 *
 */
var map;
var infowindow;
var markers = [];
var directionsService;
var directionsDisplay;
var ratings = [];

 var waypointURL = 'https://ctc12.azurewebsites.net/api/waypoint';
 var toursURL = 'https://ctc12.azurewebsites.net/api/tours';

 var jsonString =  jQuery.parseJSON('[{"Name":"Kildrummy Castle","Description":"Discover the imposing 13th century stronghold of the Earls of Mar.","Category":"Castles","Latitude":57.2354,"Longitude":-2.8999,"Url":"https://www.historicenvironment.scot/visit-a-place/places/kildrummy-castle/","HasFee":"3","TelephoneNumber":null,"IsAccessible":true,"HasParking":false},{"Name":"Huntly Castle","Description":"A magnificent ruin of a castle from the 12th-century motte to the palace block erected in the 16th and 17th centuries by the Gordon family.","Category":"Castles","Latitude":57.4554,"Longitude":-2.78045,"Url":"https://www.historicenvironment.scot/visit-a-place/places/huntly-castle/","HasFee":"3.60","TelephoneNumber":null,"IsAccessible":true,"HasParking":false},{"Name":"Tolquhon Castle","Description":"Explore the impressive ruins of this fairytale castle set in the stunning Grampian countryside.","Category":"Castles","Latitude":57.3518,"Longitude":-2.2133,"Url":"https://www.historicenvironment.scot/visit-a-place/places/tolquhon-castle/","HasFee":"3","TelephoneNumber":null,"IsAccessible":true,"HasParking":true},{"Name":"Fyvie Castle, Garden & Estate","Description":"A magnificent fortress in the heart of Aberdeenshire, Fyvie Castle’s 800-year history is rich in legends, folklore and even ghost stories. Discover the amazing collection of antiquities, armour and lavish oil paintings. Stroll around the picturesque loch, or visit the restored glass-roofed racquets court and ice house.","Category":"Castles","Latitude":57.4483,"Longitude":-2.3951,"Url":"http://www.nts.org.uk/Property/Fyvie-Castle/","HasFee":null,"TelephoneNumber":null,"IsAccessible":true,"HasParking":false},{"Name":"Craigievar Castle","Description":"If fairytales were real, all castles would look like Craigievar. Discover the beautiful property said to be the inspiration for Disney’s Cinderella Castle. Admire an impressive collection of artefacts and art – including Raeburn portraits, armour and weapons – or enjoy a peaceful stroll around the garden and estate.","Category":"Castles","Latitude":57.17439,"Longitude":-2.7193,"Url":"http://www.nts.org.uk/Property/Craigievar-Castle/","HasFee":null,"TelephoneNumber":null,"IsAccessible":true,"HasParking":true},{"Name":"Delgatie Castle Estate Trust","Description":"Dating from about 1050, Delgatie is a uniquely Scottish Castle. It is the home of the late Captain and Mrs Hay of Delgatie, and is the Clan Hay Centre.","Category":"Castles","Latitude":57.54817,"Longitude":-2.41282,"Url":"http://www.delgatiecastle.com","HasFee":null,"TelephoneNumber":null,"IsAccessible":false,"HasParking":false}]');


$(document).ready(function(){

    $('#route').hide();


    pullTours();
    pullWaypoints();

    //Change locations
    $('#tours').change(function(){
        // clearRoute();

        var tour =$('#tours option:selected').text();


        $('#tour-name').html(tour);
        // pullRoutes($('#pub-locations option:selected').text());
    });



    //Redirect to display page with route id on start route clicked
    $('#start-form').on('submit',function()
    {
        window.location.replace('../display/?id=' + $('#pub-routes').val());
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

function pullWaypoints(){

    //letter array for easily identify the  names
    var letter = ["A","B","C","D","E","F","G","H","I","J"];
    var letterCount = 0;

        $.each(jsonString, function( key, val ) {
            //items.push(key, val);
            var lat = val.Latitude;
            var lng =  val.Longitude;
            var name = val.Name;
            console.log(name);
            console.log(lat);
            var location = new google.maps.LatLng(+lat, +lng); //convert lat + lng into location


            $('#route-list').append('<li><span style="color:green;">' + letter[letterCount] + ': </span>' + name + '</li>');

            //add marker details to marker array
            markers.push({
                location: location,
                stopover: true
            });

            letterCount++;
        });



    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer({map: map});

    calculateAndDisplayRoute(directionsDisplay, directionsService);
    google.maps.event.trigger(map, 'resize');

}

/*
 * Gets locations from firebase to fill the location combo box
 * */
function pullLocations() {

    var locations = [];

    casaDataRef.once("value", function(snapshot) {

        snapshot.forEach(function (childSnapshot) {

            var routeData = childSnapshot.val();
            var routeKey = childSnapshot.key();

            var loc = locations.indexOf(routeData.crawlLocation);

            if(locations[loc] !== routeData.crawlLocation){
                locations.push(routeData.crawlLocation);
                $('#pub-locations').append('<option value="' + routeData.crawlLocation + '">' + routeData.crawlLocation + '</option>');
            }

        });
        pullRoutes();
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

}

/*
 * Gets routes from firebase to fill the routes combo box
 * */
function pullRoutes() {

    $('#pub-routes').empty();

    var location =  $('#pub-locations option:selected').text();

    casaDataRef.once("value", function(snapshot) {

        snapshot.forEach(function (childSnapshot) {

            var routeData = childSnapshot.val();
            var routeKey = childSnapshot.key();

            if(location == routeData.crawlLocation){
                $('#pub-routes').append('<option value="' + routeKey + '">' + routeData.crawlName + '</option>');
            }

        });
        pullRouteInfo();
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

/*
* Get the crawl information for displaying below the map
* */
function pullRouteInfo(){


    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer({map: map});
    var hasRatings;
    casaDataRef.once("value", function(snapshot) {
        var crawl = snapshot.child($('#pub-routes').val()).val();
        var rating = snapshot.child($('#pub-routes').val());
        console.log("Rating"+rating);
        //Check if route has rating
        hasRatings = rating.hasChild("ratings");
        if(!hasRatings)
        {
            //No rating? then display this..
            $('#crawl-rating').html("No Rating");
        }
        $('#crawl-name').html(crawl.crawlName);

    }, function (errorObject) {
    });


/*  Ratings*/

    //If route does have ratings..
    if(hasRatings != false)
    {
        ratings = []; //clear any previous ratings first..
        //Cycle through all the ratings for this route
        casaDataRef.child($('#pub-routes').val()).child('ratings').on('value', function (snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var data = childSnapshot.exportVal();
                var rating = data.crawlRating;
                //push to ratings array
                ratings.push(rating);
            });
            var total = 0;
            //total/count all ratings for route
            for(var i = 0; i < ratings.length; i++) {
                total +=  parseInt(ratings[i]);
                console.log("Total:" + total);
            }
            console.log("Rating Length " + ratings.length);
            //calculate average rating for route
            var avg =Math.round((total / ratings.length));
            console.log("Average: " + avg);
            //Display average rating
            $('#crawl-rating').html (avg);
        });
        console.log("Rating Length " + ratings.length);
    }


    //letter array for easily identify the pub names
    var letter = ["A","B","C","D","E","F","G","H","I","J"];
    var letterCount = 0;

    casaDataRef.child($('#pub-routes').val()).child('waypoints').on('value', function (snapshot) {

        snapshot.forEach(function(childSnapshot) {

            var data = childSnapshot.exportVal();
            //rebuild location
            var lat = data.lat;
            var lng =  data.lng;
            var location = new google.maps.LatLng(+lat, +lng); //convert lat + lng into location
            var stopover = data.stopover;
            var name = data.PubName;

            console.log(name);

            $('#route-list').append('<li><span style="color:green;">' + letter[letterCount] + ': </span>' + name + '</li>');

            //add marker details to marker array
            markers.push({
                location: location,
                stopover: stopover
            });

            letterCount++;
        });
        /*Crawl Waypoints Fetch from firebase ENDS*/

        calculateAndDisplayRoute(directionsDisplay, directionsService);
        google.maps.event.trigger(map, 'resize');

    });
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
