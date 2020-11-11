import { json } from 'd3';

export async function prepData(url) {
        let data = await getLocalData(url)
        return data
    }

function getData(url, endPoint) {
    return json(url + endPoint).then(data.results.bindings)
}

function getLocalData(url) {
     return json(url).then(data => data.results.bindings);
}