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
} from 'd3';
import { geoConicConformalNetherlands } from 'd3-composite-projections';
import { feature } from 'topojson';

const worldData = './static/data/110m.json';
const nld = './static/data/nld.json';

const width = window.innerWidth;
const height = window.innerHeight;

const mapDiv = document.getElementById('map');
const svg = select(mapDiv).append('svg');

const scale = 8500;
const centerLat = 5.5;

const projection = geoMercator();
const pathGenerator = geoPath().projection(projection);

const g = svg.append('g');

// g.append('path')
// 	.attr('class', 'sphere')
// 	.attr('d', pathGenerator({ type: 'Sphere' }));

const drawWorldMap = () => {
	g.append('path')
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
	svg.call(
		zoom().on('zoom', () => {
			svg.attr('transform', event.transform);
		})
	);
};

const reSize = () => {
	const width = mapDiv.clientWidth;
	const height = mapDiv.clientHeight;

	svg.attr('width', width).attr('height', height);
};
drawWorldMap();
reSize();
window.addEventListener('resize', reSize);

// json(nld)
// 	.then(data => {
// 		console.log(data.objects);
// 		const province = feature(data, data.objects.subunits);
// 		console.log(province.features);

// 		const paths = svg.selectAll('path')
// 			.data(province.features);

// 		paths.enter().append('path')
// 			.attr('d', d => pathGenerator(d))
// 			})
