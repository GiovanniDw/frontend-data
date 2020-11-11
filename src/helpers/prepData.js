import { json } from 'd3';

export async function prepData(url, endPoint) {
    if (endPoint) {
        let data = await getData(url, endPoint);
        return data
    } else {
        let data = await getLocalData(url)
        return
    }
}

function getData(url, endPoint) {
    return json(url + endPoint).then(data.results.bindings)
}

function getLocalData(url) {
     return json(url).then(data.results.bindings);
}