import {
	select,
	geoPath,
	zoom,
	zoomIdentity,
	zoomTransform,
	pointer,
	color,
} from 'd3';

import { feature, mesh } from 'topojson-client';
import { colors } from '../utilities/colors';

export const drawProvinceNL = async (svg, mapSettings, nl) => {
const {projection, width, height} = mapSettings
	const g = svg.select('g');
	const provinces = g
	const gemeentes = g
	const zoomMap = zoom().scaleExtent([1, 8]).on('zoom', zoomed);
	const path = geoPath();
	svg.on('click', reset);

	nl.then((data) => {
		const pathGenerator = path.projection(projection);
		const province = feature(data, data.objects.provincie_2020);
		const gemeente = feature(data, data.objects.gemeente_2020);


	

		g.append('g')
			.attr('id', 'gemeentes')
			.selectAll('path')
			.data(gemeente.features)
			.attr('class', "gemeente")
			.enter()
			.append('path')
			.attr('d', (d) => pathGenerator(d))
			.attr('stroke', null);

			g.append('g')
				.attr('id', 'provinces')
				.attr('cursor', 'pointer')
				.selectAll('path')
				.data(province.features)
				.attr('stroke', colors.light)
				.attr('class', 'province')
				.enter()
				.append('path')
				.attr('fill', colors.green)
				.attr('id', (d) => d.properties.statnaam)
				.attr('class', 'province')
				.on('click', clicked)
				.attr('d', (d) => pathGenerator(d));
		
		svg.call(zoomMap);
		// svg.selectAll('.active').attr('class', 'null').on('click', reset);
	});
	


		function reset() {
			select(this)
				.transition()
				.attr('fill', null)
			svg.transition()
				.duration(750)
				// .attr('fill', null)
				.call(
					zoomMap.transform,
					zoomIdentity,
					zoomTransform(svg.node()).invert([width / 2, height / 2])
				);
		}

	
		function clicked(event, d) {
			const [[x0, y0], [x1, y1]] = path.bounds(d);
			event.stopPropagation();

				g.select('.gemeentes')
				.select('path')
				.transition()
				.duration(1000)
				.style('fill', colors.red)
				.style('stroke', colors.darkGray);

			select(this)
				.transition()
				.style('fill-opacity', '0.5')
				.attr('class', 'active')
				
				

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

};