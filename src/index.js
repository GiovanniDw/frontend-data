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
	dsv,
} from 'd3';

import {
	prepCSV,
	prepDSV,
	prepJSON,
	combineDatasets,
} from './utilities/prepData';
import { drawProvinceNL, drawPenR, drawNL } from './components';

const provinceNL = './static/data/provincie_2020.topojson';
const nldJSON = './static/data/nl_2020.json';
const gemeenteNL = './static/data/gemeente_2020.topojson';
const openparkingPenR = './static/data/openparkingPenR.csv';

const geoGemeente = 'https://cartomap.github.io/nl/wgs84/gemeente_2020.geojson';
const geoProvincie =
	'https://cartomap.github.io/nl/wgs84/provincie_2020.geojson';

const scale = 6000;
const centerLat = 5.5;

let width = 800;
let height = 600;

const mapSettings = {
	width: width,
	height: height,
	projection: geoMercator().scale(scale).center([5.5584, 52.20936]),
	title: 'P+R Mogelijkheden per profincie.',
};

select(window).on('resize', update());

function update() {
	width = window.innerWidth;
	height = window.innerHeight;
}

const svg = select('svg')
	.attr('viewBox', [0, 0, 800, 600])
	.attr('width', '100%')
	.attr('height', '100%');

svg.append('g').attr('id', 'nl');




const PenRData = prepCSV(openparkingPenR);
const provinceData = prepJSON(provinceNL);
const gemeenteData = prepJSON(gemeenteNL);
const nlData = prepJSON(nldJSON);

async function combineNLData() {
	const data = await combineDatasets(provinceData, gemeenteData);
	return data;
}

async function createViz() {
	// await drawProvinceNL(svg, mapSettings, nlData);
	drawNL(svg, mapSettings, nlData);
	await drawPenR(svg, mapSettings, PenRData);

	// update()
}

createViz();
