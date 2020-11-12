import {
	select,
	geoPath,
	zoom,
	zoomIdentity,
	zoomTransform,
	pointer,
} from 'd3';

import { feature } from 'topojson-client';
import { colors } from '../utilities/colors';

export const drawProvinceNL = async (svg, mapSettings, provinceData) => {
	
const {projection, width, height} = mapSettings

	provinceData.then((data) => {
		let width = 975;
		let height = 610;
		const zoomMap = zoom().scaleExtent([1, 8]).on('zoom', zoomed);
		const path = geoPath();
		svg.on('click', reset);
		const g = svg.select('g')
		
		const pathGenerator = path.projection(projection);
		const provinceData = feature(data, data.objects.provincie_2020);

		const provinces = g
			.append('g')
			.attr('id', 'provinces')
			.attr('fill', null)
			.attr('cursor', 'pointer')
			.selectAll('path')
			.data(provinceData.features)
			.attr('class', 'province')
			.enter()
			.append('path')
			.attr('id', (d) => d.properties.statnaam)
			.on('click', clicked)
			.attr('d', (d) => pathGenerator(d))

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