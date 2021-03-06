const Promise = require('bluebird');
const request = Promise.promisify(require("request"));
const fs = require('fs');

// https://githubt.com/watty62/PlaqueScraper/
var scrape_url = 'https://raw.githubusercontent.com/watty62/PlaqueScraper/master/plaques.json';


function get_data(uri) {
	return new Promise((resolve, reject) => {
		request({ uri: uri, followAllRedirects: true })
			.then(response => {
				body = JSON.parse(response.body);
				resolve(body.plaques);
			})
			.catch(error => {
				reject(error);
			});
	});
};

get_data(scrape_url)
	.then(data => {
		return new Promise((resolve, reject) => {
			var scrapedata = [];

			for (var i = data.length - 1; i >= 0; i--) {

				// These properties are not defined in the original data set, so they reamin false yet defined to align with our data schema
				var disabled_access = false;
				var parking = false;

				// Image tag to be appended to description property
				var image = '<img src="https://raw.githubusercontent.com/watty62/PlaqueScraper/master/photos/' + data[i].photos[0] + '" alt="' + data[i].name + '" />';

				if (data[i].latitude !== "" || data[i].longitude !== "") {
					scrapedata.push({
						Name: data[i].name,
						Description: image + "<br>" + data[i].type,
						Category: 'Plaques',
						Latitude: data[i].latitude,
						Longitude: data[i].longitude,
						Url: null,
						HasFee: false,
						TelephoneNumber: null,
						IsAccessible: disabled_access,
						HasParking: parking
					});
				}
			}
			resolve(scrapedata);
		})

	})
	.then(scrapedata => {
		fs.writeFile('data/plaques.json', JSON.stringify(scrapedata) );
		console.log(scrapedata);
	});