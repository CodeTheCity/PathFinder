var waypoints;
var placeNames = [];
/*
 * Clear all of the markers of the map and clear the pub list
 * */
function clearRoute(){
    if(typeof directionsDisplay !== 'undefined'){
        directionsDisplay.setMap(null);
    }
    if(typeof findMarkers != 'undefined'){
        for(i = 0;i<findMarkers.length;i++){
            findMarkers[i].setMap(null);
        }
        findMarkers = [];
    }
    markers = [];
    placeNames = [];
    $('#route-list').empty();
}


/*
 *  Populate the select tag "num-pubs" with the number of pubs specified
 */
function populateNumPubs(pubs) {
    for (i = 1; i <= pubs; i++) {
        //set the default select option to 5
        if(i == 5){
            $('#num-pubs').append('<option value="' + i + '" selected="selected">' + i + '</option>')
        }
        else{
            $('#num-pubs').append('<option value="' + i + '">' + i + '</option>')
        }

    }
}

/*
 * Search for pubs around a specific area
 * takes in the place you'd like to search and the number of pubs that you would like
 * */
function searchRadius(place,numPubs,radius,mapMarkers){
    clearRoute();
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);

    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer({map: map});

    //letter array for easily identify the pub names
    var letter = ["A","B","C","D","E","F","G","H","I","J"];

    service.nearbySearch({
        location: place,
        radius: radius,
        types: ['bar']//night_club
    }, function(response, status){
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < numPubs; i++) {

                if(mapMarkers == true) {
                    addMarker(response[i].geometry.location, map, response[i]);
                    // markers.push({
                    //     location: response[i].geometry.location,
                    //     stopover: true,
                    //     name: response[i].name
                    // });
                }
                else{
                    markers.push({
                        location: response[i].geometry.location,
                        stopover: true
                    });
                    placeNames.push({
                        pubName: response.items[i].name
                    })

                    $('#route-list').append('<li><span style="color:green;">' + letter[i] + ':</span> ' + response[i].name + '</li>');
                    $('#route').show();
                }

            }
            map.setCenter(place);
            //map.setZoom(13);
            if(mapMarkers == false) {
                calculateAndDisplayRoute(directionsDisplay, directionsService);
            }
        }
        else{
            window.alert("Nearby search failed");
            $('#route').hide();
        }
    });
}

/*
* 
* */
function calculateAndDisplayRoute(directionsDisplay, directionsService) {
    //first copy markers to waypoints array
    waypoints = [];
    waypoints = jQuery.extend([], markers);
    //set the start and end location of the route based on the markers
    var start = markers[0].location;
    var end = markers[markers.length-1].location;


    //remove the first and last locations for using the rest as waypoints
    markers.shift();
    markers.pop();

    // Retrieve the start and end locations and create a DirectionsRequest using
    // WALKING directions.
    directionsService.route({
        origin: start,
        destination: end,
        waypoints: markers,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.WALKING
    }, function(response, status) {
        // Route the directions and pass the response to a function to create
        // markers for each step.
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            for(i = 0; i < response.routes;i++)
            {
                console.log(infowindows[i].Name);

                // response.routes[i].location
                // marker.info = new google.maps.InfoWindow({
                //     content: '<b>Name: </b> ' + infowindows[i].name
                // });
                //
                // console.log("Info windows");
                // console.log(infowindows[i]);
                //
                // google.maps.event.addListener(marker, 'click', function() {
                //     marker.info.open(map, marker);
                // });
            }
            window.location.hash = 'route';
            route = response.routes[0];


        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

// Adds a marker to the map.
function addMarker(location, map, pub) {

    var marker = new google.maps.Marker({
        position: location,
        map: map,
        animation: google.maps.Animation.DROP,
        title: pub.name
    });

    findMarkers.push(marker);

    //used for checking if the pub has a rating or not
    var rating = pub.rating;

    if(typeof rating === 'undefined'){
        rating = "No Rating";
    }

    // This event listener opens an info window
    marker.addListener('click', function() {

        var mar = this;

        infowindow.setContent(
            '<b>' + pub.name + '</b></br>'
            +'Rating: ' + rating + '</br>'
            // +'Open Hours: ' + pub.opening_hours[0] + '</br>'
            +'<input class="button button-blackboard markerbut" id="marker-add" type="button" value="Add Pub" >');
        infowindow.open(map, marker);
        $('#marker-add').on("click",function () {
            $(this).hide();
            addPub(location,pub.name);
        });
    });

}

function createMarker(latlng, title, content) {

    var marker = new google.maps.Marker({
        position: latlng,
        title: title,
        map: map
    });

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(content);
        infowindow.open(map, marker);
    });
}


function addPub(publoc,pubname){

    placeNames.push({
        pubName: pubname
    })

    markers.push({
        location: publoc,
        stopover: true
    });

    $('#route-list').append('<li>' + pubname + '</li>');
    $('#route').show();
}

function push(){

    //waypoints = [];
    //waypoints = jQuery.extend([], markers);
    console.log(waypoints);
    var crawlName = $('.crawlname').val();
    var crawlLocation = $('#location-search').val();

    var newPush = casaDataRef.push({ crawlName: crawlName, crawlLocation: crawlLocation});
    var newKey = newPush.key();

    //Get waypoints and store in firebase
    for (i = 0; i < waypoints.length; i++) {
        casaDataRef.child(newKey).child('waypoints').child(i).set({lat: waypoints[i].location.lat(),lng:waypoints[i].location.lng(), stopover: waypoints[i].stopover, PubName: placeNames[i].pubName});
    }

    return newKey;
}
