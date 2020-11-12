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

import { prepCSV, prepDSV, prepJSON } from './utilities/prepData'
import { drawProvinceNL, drawPenR } from './components'

const provinceNL = './static/data/provincie_2020.geojson';
const openparkingPenR = './static/data/openparkingPenR.csv';


const scale = 5000;
const centerLat = 5.5;

// const getSize = {
// 	width = 


// // }
let width = window.innerWidth
let height = window.innerHeight

const mapSettings = {
	width: width,
	height: height,
	projection: geoMercator().scale(5000).center([5.5584, 52.2093656]),
};

select(window).on('resize', update);


function update() {
	width = window.innerWidth
	height = window.innerHeight

console.log(width)

}

const svg = select('svg').attr('viewBox', [0,0,900,600]).attr('width', "100%").attr('height', "100%");

const g = svg.append('g').attr("id", 'nl');

const PenRData = prepCSV(openparkingPenR);
const provinceData = prepJSON(provinceNL)

async function createViz() {
	
	await drawPenR(svg, mapSettings, PenRData);
	await drawProvinceNL(svg, mapSettings, provinceData);


};

createViz();