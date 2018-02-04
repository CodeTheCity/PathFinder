const Promise = require('bluebird');
const request = Promise.promisify(require("request"));
const fs = require('fs');

var scrape_url = 'https://www.visitscotland.com/data/search/results?cat=castles&cat=monumentsruins&loc=Aberdeenshire+Castle+Trail&locpoly=51&locprox=0&prodtypes=acti%2Cattr%2Creta%2Ctour';


function get_data(uri) {
	return new Promise((resolve, reject) => {
		request({ uri: uri, followAllRedirects: true })
			.then(response => {
				body = JSON.parse(response.body);
				resolve(body.data.products);
			})
			.catch(error => {
				reject(error);
			});
	});
}

get_data(scrape_url).then(data => {
	return new Promise((resolve, reject) => {
		var castles = [];

		for (var i = data.length - 1; i >= 0; i--) {

			if (data[i].category === "Castles" ) {

				var disabled_access = false;
				var parking = false;

				if (data[i].facilities !== "") {
					let facilities = data[i].facilities.split(',');
	
					if (facilities.indexOf('dsblaccess')) {
						disabled_access = true;
					}


					if (facilities.indexOf('parking')) {
						parking = true;
					}				
				} 

				

				castles.push({
					Name: data[i].name,
					Description: data[i].description,
					Category: data[i].category,
					Latitude: data[i].latitude,
					Longitude: data[i].longitude,
					Url: data[i].website,
					HasFee: data[i].price,
					TelephoneNumber: null,
					IsAccessible: disabled_access,
					HasParking: parking
				});
			}
		}


		resolve(castles);
	}).then(castles => {
		console.log(castles);
		fs.writeFile('castles.json', JSON.stringify(castles) );
		console.log(castles.length);
	});

});