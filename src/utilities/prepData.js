import { json, csv } from 'd3';

import {removeFalsy, groupBy, toObject} from './transform'

export async function prepJSON(url) {
	let data = await getJSONData(url)
        return data
}
function getJSONData(url) {
	return json(url)
}


export async function prepCSV(url) {
	let data = await getCSVData(url)
	return data;
}

async function getCSVData(url) {
	try {
		const data = await csv(url);
		return data
	} catch (err) {
		console.log(err)
	}
	
}


function getData(url, endPoint) {
    return json(url + endPoint).then(data.results.bindings)
}

function getLocalData(url) {
     return json(url).then()
}

function cleanData(row) {
	let data = {};
	Object.entries(row).forEach(([key, propValue]) => {
		data[key] = propValue.value;
	});
	return data;
}