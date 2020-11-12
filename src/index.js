import 'regenerator-runtime/runtime';

import {
	select,
	json,
	geoPath,
	geoMercator,
	zoom,
	zoomIdentity,
	zoomTransform,
	pointer,
	csv,
	dsv
} from 'd3';

import { colors } from './utilities/colors'

import { feature } from 'topojson-client';
import { prepCSV, prepDSV, prepJSON } from './utilities/prepData'
import { drawProvinceNL } from './helpers/drawMap'
import { color } from '../static/bundle';

const worldData = './static/data/land-10m.json';
const nld = './static/data/nld.json';
const provinceNL = './static/data/provincie_2020.geojson';
const PenRGeo = './static/data/PenR_Geo.geojson';

const openparkingPenR = './static/data/openparkingPenR.csv';

const scale = 5000;
const centerLat = 5.5;






async function createViz() {
	const provinceData = await getProvinceData()

	drawProvinceNL(provinceNL);
	drawPenR();
	
	
};

async function getProvinceData() {
	const data = await prepJSON(provinceNL)
	return data
	
}



const PenR = prepCSV(openparkingPenR);



// const drawPenR = () => {
// 	json(PenRGeo).then((data) => {
// 		const g = select('g');
// 		const projection = geoMercator()
// 			.scale(6000)
// 			.center([5.11, 52.17]);
// 		const PenR = data.features;
// 			g
// 			.selectAll('circle')
// 			.data(PenR)
// 			.enter()
// 			.append('circle')
// 			.attr('r', 1)
// 			.attr('cx', (d) => projection(d.geometry.coordinates)[0])
// 			.attr('cy', (d) => projection(d.geometry.coordinates)[1])
// 			.append('text').text((d) => d.properties.areadesc)
// 	});
// };


const svg = select('svg')

const g = select('g')



const drawPenR = () => {
	PenR.then((data) => {
		const g = select('g');
		const projection = geoMercator().scale(6000).center([5.11, 52.17]);
		const PenR = data;
		g.selectAll('circle')
			.data(PenR)
			.enter()
			.append('circle')
			.attr('r', 5)
			.attr('cx', (d) => projection([d.longitude, d.latitude])[0])
			.attr('cy', (d) => projection([d.longitude, d.latitude])[1])
			.attr('fill', colors.red )
			.append('text')
			.text((d) => d.areadesc);
		console.log(PenR)
	});
};



// const drawWorld = () => {
// 	g.attr('id', 'world')
// 		.append('path')
// 		.attr('class', 'sphere')
// 		.attr('d', pathGenerator({ type: 'Sphere' }));

// 	json(worldData).then((data) => {
// 		const countries = feature(data, data.objects.countries);
// 		const paths = g.selectAll('path').data(countries.features);

// 		paths
// 			.enter()
// 			.append('path')
// 			.attr('class', 'country')
// 			.attr('d', (d) => pathGenerator(d));
// 	});
// };


createViz();