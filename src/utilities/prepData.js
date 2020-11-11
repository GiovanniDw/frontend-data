import { json, csv } from 'd3';

import {removeFalsy, groupBy} from './transform'

export async function prepJSON(url) {
    let data = await getJSONData(url)
    
        removeFalsy(data)

        return data
}

export async function prepCSV(url) {
	let data = await getCSVData(url);
	return data;
}

function getData(url, endPoint) {
    return json(url + endPoint).then(data.results.bindings)
}

function getLocalData(url) {
     return json(url).then()
}

function getJSONData(url) {
	return json(url).then();
}

function getCSVData(url) {
	return csv(url)
}

