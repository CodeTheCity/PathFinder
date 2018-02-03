/**
 * Created by Andrew Tait on 16/04/2016.
 * Display Map Javascript file
 * CASA - Pub Crawl Web app
 */


//Global variables
var map;
var crawlName;
var crawlLocation;
var fireBaseID; //Firebase push ID
var casaDataRef = new Firebase('https://casa-pubcrawl.firebaseio.com/routes'); //Live site
var markers = [];
var directionsService;
var directionsDisplay;
var route;
var placesNames = [];
var defaultCenter;
/*
* Current URL Structure:
*
* ./Display/?id=UNIQUE_FIREBASE_ID - gives you firebase id for route, places and waypoint info
*
* */

//Function used to get value from URL parameter, takes in field name as input
function GetURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');

    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
}


//Run setup function bellow
setup();


function setup()
{
    //check for id field..
    fireBaseID = GetURLParameter("id");
    getFireBaseDB(fireBaseID);
}


//Get unique ID from URL to access firebase DB
function getFireBaseDB(ID)
{
    /*Crawl Information Fetch from firebase STARTS*/
    casaDataRef.child(ID).on("value", function(snapshot) {

        var nameSnapshot = snapshot.child("crawlName");
        crawlName  = nameSnapshot.val();
        var locationSnapShot = snapshot.child("crawlLocation");
        crawlLocation = locationSnapShot.val();

        //Set crawl name and location to info and ratings boxes
        $(".crawlname").html(crawlName);
        $(".crawlLocation").html(crawlLocation);

    });

    /*Crawl Information Fetch from firebase ENDS*/

    /*Crawl Waypoints Fetch from firebase STARTS*/
    casaDataRef.child(ID).child('waypoints').on('value', function (snapshot) {
        snapshot.forEach(function(childSnapshot) {

            var data = childSnapshot.exportVal();
            //rebuild location
            var lat = data.lat;
            var lng =  data.lng;
            var location = new google.maps.LatLng(+lat, +lng); //convert lat + lng into location
            var stopover = data.stopover;
            var name = data.PubName;

            //add marker details to marker array
            markers.push({
                location: location,
                stopover: stopover
            });
            //get placenames for all pubs
            placesNames.push({
                pubName: name
            })
        });
        /*Crawl Waypoints Fetch from firebase ENDS*/
        
        calculateAndDisplayRoute(directionsDisplay, directionsService);
        google.maps.event.trigger(map, 'resize');

        //Display first pub's tweets
        $("#TweetName").html("Current Pub: "+ placesNames[0].pubName);
        displayTweets(placesNames[0].pubName);

    });
}

//Display google maps (initial setup - callback function)
function initMap() {
    var myCenter;
    var myOptions = {
        center: {lat: 0, lng: 0},
        zoom: 14,
        styles: [{
            featureType: 'poi',
            stylers: [{visibility: 'off'}]  // Turn off points of interest.
        }, {
            featureType: 'transit.station',
            stylers: [{visibility: 'off'}]  // Turn off bus stations, train stations, etc.
        }],
        fullscreenControl: true
    };

    //Create new map
    map = new google.maps.Map(document.getElementById('map'), myOptions);
    //Related map services
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer({map: map});
    geocoder = new google.maps.Geocoder;


    //Add pub next buttoned to the top right of the map (overlay)
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(document.getElementById('pubNext'));

    /*Listeners*/

    /*Next pub event */
    var count = 0;
    google.maps.event.addDomListener(document.getElementById("pubNext"), "click", function(ev) {
        $('#pubNext').val("Next Pub"); //
        var max  = markers.length+ 1;

        if(count <= markers.length)
        {
            //Get default map center to reset if required
            if(count == 0)
            {   
                defaultCenter =map.getCenter();
            }

            //Display current pub in tweets section
            $("#TweetName").html("Current Pub: "+ placesNames[count].pubName);
            //Get tweets from curret pub on crawl
            displayTweets(placesNames[count].pubName);
            //get latitude and longitude from route leg
            var nextPub = new google.maps.LatLng(+route.legs[count].start_location.lat(), +route.legs[count].start_location.lng());

            //Center and zoom on next pub
            map.setCenter(nextPub);
            map.setZoom(16);
            count++;
        }
        else if(count == max)
        {
            //Remove next pub and replace with ratings button
            map.controls[google.maps.ControlPosition.TOP_RIGHT].pop(document.getElementById('pubNext'));
            toggle_visibility('ratings');
            map.controls[google.maps.ControlPosition.TOP_RIGHT].push(document.getElementById('ratings'));
            
            //Display current pub in tweets section
            $("#TweetName").html("Current Pub: "+ placesNames[count].pubName);

            displayTweets(placesNames[count].pubName)

            //Go to final pub on the crawl
            //get latitude and longitude from route leg
            var nextPub = new google.maps.LatLng(route.legs[count-1].end_location.lat(), +route.legs[count-1].end_location.lng());
            map.setCenter(nextPub);
            map.setZoom(16);
            count++;
        }
    });
}


//Ratings Box Popup
function toggle_visibility(id) {
    var e = document.getElementById(id);

    if(e.style.display == 'block')
        e.style.display = 'none';
    else
        e.style.display = 'block';
}


/*Twitter Display tweets based on place name as keyword*/
function displayTweets(placeName)
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var tweets = JSON.parse(xhttp.responseText);
            var tweetstring = "";
            
            if(tweets.length > 0)
            {
                //Limit tweets by 5 and display in list
                for (var i = 0; i < 5; i++) {
                    
                    tweetstring += "<blockquote class='tweet'><p>" + tweets[i].name + "</p>";
                    
                    //Split up tweet content
                    var words = tweets[i].text.split(/\s+/);
                    
                    //Loop through tweet content and display links
                    for (var i=0; i<words.length; i++) {
                        var word = words[i];
                        if (word.substr(0, 7) == 'http://' || word.substr(0, 8) == 'https://') {
                            words[i] = '<a href="'+word+'">'+word+'</a> ';
                        }
                    }
                    //Join all words and links together
                    var text = words.join(' ');
                    tweetstring += "<p>" + text + "</p></blockquote>";

                }
                //Display Tweets
                document.getElementById("twitter").innerHTML = tweetstring;
            }
            else //No tweets? Then display relevant message
            {
                document.getElementById("twitter").innerHTML = "No tweets found for this pub";
            }

        }
    };
    //Send request to Node server
    xhttp.open("GET", "http://rgunodeapp.azurewebsites.net/?q="+placeName, true);
    xhttp.send();
}

// Add rating to route on fire base

$(document).ready(function(){
    //Check if rating submit button has been clicked.
    $('#RatingSubmit').on("click", function()
    {
        //call rating function bellow
        addRating();
        //Done with rating? Then redirect user to home page
        window.location.replace('../');
    });

});

// Add rating from pop up div to firebase
function addRating() {
    //Get value from dropdown
    var rating = $('#Rating').val();
    //Push rating into firebase
    var ratingRef = casaDataRef.child(fireBaseID);
    casaDataRef.child(fireBaseID).child('ratings').push({crawlRating: rating});
    //close popup div
    toggle_visibility('popupBoxTwoPosition');
}
