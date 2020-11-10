const fetch = require('node-fetch');
const fs = require('fs');
// const data = "https://opendata.rdw.nl/resource/ixf8-gtwq.json"
const url = 'https://opendata.rdw.nl/resource/';

// const gebruiksdoel = 'qidm-7mkf.json';
// const tijdvak = 'ixf8-gtwq.json';
// const verkooppunt = "fk68-nf2y.json"
// const specificatiesParkeergebied = 'b3us-f26s.json';
const betaalmethodeGebied = 'r3rs-ibz5.json';
// const regeling = 'yefi-qfiq.json';
// const specialeDag = 'hpi4-mynq.json';
// const areaManager = '2uc2-nnv3.json';
const GeoPenR = '6wzd-evwu.json';
const endPoint = GeoPenR;

// fetch(url + endPoint)
// 	.then(responseStatus)
// 	.then(readResponseJSON)
// 	.then((result) => {
// 		logResult(result);
// 	})
// 	.catch((error) => {
// 		console.error('Can not fetch becasuse: ' + error);
// 	});

// function responseStatus(response) {
// 	if (response.status >= 200 && response.status < 300) {
// 		console.log(response);
// 		return Promise.resolve(response);
// 	} else {
// 		return Promise.reject(new Error(response.statusText));
// 	}
// }

// function readResponseJSON(response) {
// 	return response.json();
// }

// function logResult(result) {
// 	console.log(result);
// 	return result;

// }

async function parseData() {
	const timeframesResponse = await fetch(
		'https://opendata.rdw.nl/resource/ixf8-gtwq.json'
	);
	const areamanagersResponse = await fetch(
		'https://opendata.rdw.nl/resource/2uc2-nnv3.json'
	);

	const timeframes = await timeframesResponse.json();
	const areamanagers = await areamanagersResponse.json();

	const result = timeframes.map((timeframe) => {
		const areamanager = areamanagers.find(
			(areamanager) =>
				timeframe.areamanagerid === areamanager.areamanagerid
		);

		timeframe.areamanager = areamanager;
		console.log(timeframe);
		return timeframe;
	});

	writeFileSync('./result.json', JSON.stringify(result, null, 4));
}

parseData();
