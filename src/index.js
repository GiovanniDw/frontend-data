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
	csv
} from 'd3';

import { feature } from 'topojson-client';
import {prepCSV, prepData, prepJSON} from './utilities/prepData'
// const worldData = './static/data/110m.json';
const worldData = './static/data/land-10m.json';
const nld = './static/data/nld.json';
const provinceNL = './static/data/provincie_2020.geojson';
const PenRGeo = './static/data/PenR_Geo.geojson';

const openParkingPenR = './static/data/OpenParking_PnR.csv';

const scale = 5000;
const centerLat = 5.5;

const createViz = () => {
	drawProvinceNL();
	drawPenR();
	
	
};



const newData = prepCSV(openParkingPenR);


newData.then(data => {
	feature(data, data.objects)
})

console.log(newData)




const drawProvinceNL = () => {
	json(provinceNL).then((data) => {
		let width = 975;
		let height = 610;
		const zoomMap = zoom().scaleExtent([1, 8]).on('zoom', zoomed);
		const path = geoPath();

		const svg = select('svg')
			.attr('viewBox', [0, 0, width, height])
			.on('click', reset);

		const g = svg.append('g');

		const projection = geoMercator().scale(6000).center([5.11, 52.17]);
		const pathGenerator = path.projection(projection);
		const provinceData = feature(data, data.objects.provincie_2020);
		

		const provinces = g
			.append('g')
			.attr('fill', '#777')
			.attr('id', 'provinces')
			.attr('cursor', 'pointer')
			.selectAll('path')
			.data(provinceData.features)
			.attr('class', 'province')
			.attr('id', (d) => d.properties.statnaam)
			.enter()
			.append('path')
			.attr('d', path)
			.on('click', clicked)
			.attr('d', (d) => pathGenerator(d));

		provinces.append('title').text((d) => d.properties.statnaam);

		svg.call(zoomMap);

		function reset() {
			provinces.transition().style('fill', null);
			svg.transition()
				.duration(750)
				.call(
					zoomMap.transform,
					zoomIdentity,
					zoomTransform(svg.node()).invert([width / 2, height / 2])
				);
		}

		function clicked(event, d) {
			const [[x0, y0], [x1, y1]] = path.bounds(d);
			event.stopPropagation();
			provinces.transition().style('opacity', '0.5');
			select(this).transition().style('fill', 'red');
			svg.selectAll("path").classed('active')
			svg.transition()
				.duration(750)
				.call(
					zoomMap.transform,
					zoomIdentity
						.translate(width / 2, height / 2)
						.scale(
							Math.min(
								8,
								0.9 /
									Math.max(
										(x1 - x0) / width,
										(y1 - y0) / height
									)
							)
						)
						.translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
					pointer(event, svg.node())
				);
		}
		function zoomed(event) {
			const { transform } = event;
			g.attr('transform', transform);
			g.attr('stroke-width', 1 / transform.k);
		}
	});
};

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





const drawPenR = () => {
	csv(openParkingPenR).then((data) => {
		const g = select('g');
		const projection = geoMercator().scale(6000).center([5.11, 52.17]);
		const PenR = data;
		g.selectAll('circle')
			.data(PenR)
			.enter()
			.append('circle')
			.attr('r', 1)
			// .attr('cx', (d) => projection(d.latitude))
			// .attr('cy', (d) => projection(d.longitude))
			.append('text')
			.text((d) => d.areadesc);
	});
};

createViz();

const drawWorld = () => {
	g.attr('id', 'world')
		.append('path')
		.attr('class', 'sphere')
		.attr('d', pathGenerator({ type: 'Sphere' }));

	json(worldData).then((data) => {
		const countries = feature(data, data.objects.countries);
		const paths = g.selectAll('path').data(countries.features);

		paths
			.enter()
			.append('path')
			.attr('class', 'country')
			.attr('d', (d) => pathGenerator(d));
	});
};
