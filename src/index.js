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


const worldData = './static/data/land-10m.json';
const nld = './static/data/nld.json';
const provinceNL = './static/data/provincie_2020.geojson';
const PenRGeo = './static/data/PenR_Geo.geojson';

const openparkingPenR = './static/data/openparkingPenR.csv';


const projection = geoMercator().scale(6000).center([5.11, 52.17]);

const scale = 5000;
const centerLat = 5.5;


console.log(colors.blue)

let width = 975;
let height = 610;


const svg = select('svg').attr('viewBox', [0, 0, width, height]);
const g = svg.append('g');

const PenR = prepCSV(openparkingPenR);
const provinceData = prepJSON(provinceNL)

async function createViz() {
	
	await drawPenR(svg, projection);
	await drawProvinceNL(svg, projection, provinceData);
	console.log(+svg.attr('width'));
};

async function getProvinceData() {
	const data = await prepJSON(provinceNL)
	return data
	
}





const drawPenR = async (svg, projection) => {
	PenR.then((data) => {
	 svg = select('g');	
		svg.selectAll('circle')
			.data(data)
			.enter()
			.append('circle')
			.attr('class', 'circle')
			.attr('r', '1')
			.attr('cx', (d) => projection([d.longitude, d.latitude])[0])
			.attr('cy', (d) => projection([d.longitude, d.latitude])[1])
			.attr('fill', colors.blue)
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