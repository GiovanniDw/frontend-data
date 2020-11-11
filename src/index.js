import {
	select,
	json,
	geoPath,
	geoMercator,
	geoNaturalEarth1,
	geoGnomonic,
	geoMercatorRaw,
	call,
	zoom,
	event,
	create
} from 'd3';
import { geoConicConformalNetherlands } from 'd3-composite-projections';
import { feature, mesh } from 'topojson';

import {prepData} from './helpers/prepData'

import { FileAttachment } from "fs";
import fetch from 'node-fetch';

// const worldData = './static/data/110m.json';
const worldData = './static/data/land-10m.json';
const nld = './static/data/nld.json';
const provinceNL = './static/data/provincie_2020.geojson';
const PenRGeo = './static/data/PenR_Geo.geojson';

const width = 900;
const height = 600;


// const mapDiv = document.getElementById("map")
// const root = document.getElementById("root")
// const svg = select("body").append('svg').attr("width", 900).attr("height", 400);
// const svg = select(root).append('svg').attr('viewBox', [0, 0, width, height]);

const scale = 5000;
const centerLat = 5.5;

const projection = geoMercator();
projection.scale(scale).center([centerLat, 52.1]);
const pathGenerator = geoPath().projection(projection);

// const g = svg.append('g');

// g.append('path')
// 	.attr('class', 'sphere')
// 	.attr('d', pathGenerator({ type: 'Sphere' }));

// json(worldData).then((data) => {
// 	const countries = feature(data, data.objects.countries);

// 	const paths = g.selectAll('path').data(countries.features);

// 	paths
// 		.enter()
// 		.append('path')
// 		.attr('class', 'country')
// 		.attr('d', (d) => pathGenerator(d));
// });
// svg.call(
// 	zoom().on('zoom', () => {
// 		svg.attr('transform', event.transform);
// 	})
// );

const root = document.getElementById('root');
const zoomMap = zoom().scaleExtent([1, 8]).on('zoom', zoomed);

const svg = select("body").append('svg').attr('viewBox', [0, 0, width, height]);

svg.append('rect')
	.attr('class', 'background')
	.attr('width', width)
	.attr('height', height)

const g = svg.append('g');	


// const drawNL = () => {
// 	json(provinceNL).then((error, data) => {
// 	if (error) throw error;
// 		const province = g
// 			.append('g')
// 			.attr('id', 'provincie')
// 			.attr('cursor', 'pointer')
// 			.selectAll('path')
// 			.data(feature(data, data.objects.provincie_2020).features)
// 			.enter()
// 			.append('path')
// 			.attr('d', path)
// 			.join('path')
// 			.on('click', clicked);
			
		
// 		province.append("title").text(d => d.properties.statnaam)

// 		g.append('path')
// 			.attr('fill', 'none')
// 			.attr('stroke', 'white')
// 			.attr('stroke-linejoin', 'round')
// 			.attr(
// 				'd',
// 				path(mesh(data, data.objects.provincie_2020, (a, b) => a !== b))
// 			);
// 				svg.call(zoomMap)
// 	})
// }

// drawNL()

 function zoomed(event) {
		const { transform } = event;
		g.attr('transform', transform);
		g.attr('stroke-width', 1 / transform.k);
 }



const drawWorld = () => {
	g.append('path')
		.attr('class', 'sphere')
		.attr('d', pathGenerator({ type: 'Sphere' }));

	json(worldData).then((data) => {
		console.log(data);
		const countries = feature(data, data.objects.countries);
		console.log(countries);
		const paths = g.selectAll('path').data(countries.features);

		paths
			.enter()
			.append('path')
			.attr('class', 'country')
			.attr('d', (d) => pathGenerator(d));
	});
};

// const province = feature(provinceNLJSON, provinceNLJSON.objects.subunits);

const drawProvinceNL = () => {
	json(provinceNL).then((data) => {
		const province = feature(data, data.objects.provincie_2020);

		const paths = svg.selectAll('path').data(province.features);

		paths
			.enter()
			.append('path')
			.attr('class', 'province')
			.attr('d', (d) => pathGenerator(d))
			
	});
};

const drawPenR = () => {
	json(PenRGeo).then((data) => {
		const PenR = data.features;
		console.log(data);
		svg.selectAll('circle')
			.data(PenR)
			.enter()
			.append('circle')
			.attr('r', 1)
			.attr('cx', (d) => projection(d.geometry.coordinates)[0])
			.attr('cy', (d) => projection(d.geometry.coordinates)[1]);
	});
};




drawProvinceNL();
drawPenR();
drawWorld();


