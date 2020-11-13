import { json, csv } from 'd3';

import { feature } from 'topojson-client';


import {removeFalsy, groupBy, toObject, slugify, uniqueObjects} from './transform'

export async function prepJSON(url) {
	let data = await getJSONData(url)
	
        return data
}
function getJSONData(url) {
	return json(url)
}


export async function prepCSV(url) {
	let data = await getCSVData(url)
	
	uniqueObjects(data);
	return data;
}

async function getCSVData(url) {
	try {
		const data = await csv(url);
		return data
	} catch (err) {
		
	}
	
}
export const combineDatasets = (f, s) => {

	console.log(f)

	// const first = await handleTopoJson(f);
	// const second = await handleTopoJson(s);
	// const combinedData = {}
}


function handleTopoJson(file) {
	try {
file.then((data) => {
	const newData = feature(data, data.objects[0]);
	return newData
})
	} catch (err) {
console.error(err);
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


