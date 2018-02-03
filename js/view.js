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

var casaDataRef = new Firebase('https://casa-pubcrawl.firebaseio.com/routes'); //Live site

$(document).ready(function(){

    $('#route').hide();

    pullLocations();

    //Change locations
    $('#pub-locations').change(function(){
        clearRoute();
        pullRoutes($('#pub-locations option:selected').text());
    });

    //Change route
    $('#pub-routes').change(function(){
        clearRoute();
        pullRouteInfo();
    });

    //Redirect to display page with route id on start route clicked
    $('#start-form').on('submit',function()
    {
        window.location.replace('../display/?id=' + $('#pub-routes').val());
        return false;
    });

});


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