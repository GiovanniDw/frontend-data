
import { feature } from 'topojson-client';


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

import {colors} from '../utilities/colors'

// export async function drawWorld() {
// 	g.append('path')
// 		.attr('class', 'sphere')
// 		.attr('d', pathGenerator({ type: 'Sphere' }));

// 	json(worldData).then((data) => {
// 		console.log(data);
// 		const countries = feature(data, data.objects.countries);
// 		console.log(countries);
// 		const paths = g.selectAll('path').data(countries.features);

// 		paths
// 			.enter()
// 			.append('path')
// 			.attr('class', 'country')
// 			.attr('d', (d) => pathGenerator(d));
// 	});
// };

// // const province = feature(provinceNLJSON, provinceNLJSON.objects.subunits);

// export const drawProvinceNL = (provinceNL) => {
// 	json(provinceNL).then((data) => {
// 		const province = feature(data, data.objects.provincie_2020);
// 		const paths = svg.selectAll('path').data(province.features);
// 		paths
// 			.enter()
// 			.append('path')
// 			.attr('class', 'province')
// 			.attr('d', (d) => pathGenerator(d));
// 	});
// };



export const drawProvinceNL = async (svg, projection,  provinceData) => {
	provinceData.then((data) => {
		console.log(data);
		let width = 975;
		let height = 610;
		const zoomMap = zoom().scaleExtent([1, 8]).on('zoom', zoomed);
		const path = geoPath();
		svg.on('click', reset);
		const g = svg.select('g')
		
		const pathGenerator = path.projection(projection);
		const provinceData = feature(data, data.objects.provincie_2020);

		const provinces = g
			.attr('fill', null)
			.attr('id', 'nl')
			.attr('cursor', 'pointer')
			.selectAll('path')
			.data(provinceData.features)
			.attr('class', 'province')
			.enter()
			.append('path')
			.attr('id', (d) => d.properties.statnaam)
			.attr('d', path)
			.on('click', clicked)
			.attr('d', (d) => pathGenerator(d));

		provinces.append('title').text((d) => d.properties.statnaam);

		svg.call(zoomMap);

		svg.select('#provinces path.active')
			.attr('class', 'null')
			.on('click', reset);

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

			provinces.transition().duration(1000)
				.style('fill', colors.darkGray)
				.attr('class', null);

			select(this)
				.transition()
				.style('fill', colors.lightGreen)
				.style('stroke', colors.darkGray)
				.attr('class', 'active')
				.selectAll('.active')
				.on('click', reset);

			svg.selectAll('path');
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