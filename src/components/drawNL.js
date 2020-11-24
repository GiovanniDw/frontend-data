import {
	select,
	geoPath,
	zoom,
	zoomIdentity,
	zoomTransform,
	pointer,
	color,
} from 'd3';

import { feature, mesh, meshArcs } from 'topojson-client';
import { colors } from '../utilities/colors';

export const drawNL = async (svg, mapSettings, nl) => {
	const { projection, width, height } = mapSettings;
	const g = svg.select('g');
	const zoomMap = zoom().scaleExtent([1, 8]).on('zoom', zoomed);
	const path = geoPath();
	const provinces = g.select('g');

	let active = select(null);

	svg.on('click', reset);

	nl.then((data) => {
		const pathGenerator = path.projection(projection);
		// const province = mesh(data, data.objects.provincie_2020, (a,b) => a !== b );
		// const gemeente = feature(data, data.objects.gemeente_2020);
		const gemeente = feature(data, data.objects.gemeente_2020);
		const province = feature(data, data.objects.provincie_2020);
		const provinceBorder = mesh(
			data,
			data.objects.provincie_2020,
			(a, b) => a !== b
		);

		g.append('g')
			.attr('id', 'gemeentes')
			.selectAll('path')
			.data(gemeente.features)
			.enter()
			.append('path')
			.attr('d', pathGenerator)
			.attr('class', 'gemeente-grens')
			.on('click', reset);

		g.append('g')
			.attr('id', 'provinces')
			.selectAll('path')
			.data(province.features)
			.enter()
			.append('path')
			.attr('d', pathGenerator)
			.attr('class', 'province')
			.on('click', clicked);

		g.append('path')
			.datum(provinceBorder)
			.attr('id', 'province-borders')
			.attr('d', pathGenerator);

		svg.call(zoomMap);
	});

	function reset() {
		provinces.transition().style('fill', null).attr('class', null);
		svg.transition()
			.duration(750)
			.call(
				zoomMap.transform,
				zoomIdentity,
				zoomTransform(svg.node()).invert([width / 2, height / 2])
			);
		active.classed('active', false);
		active = select(null);
	}

	function clicked(event, d) {
		const [[x0, y0], [x1, y1]] = path.bounds(d);
		event.stopPropagation();

		if (active.node() === this) reset();

		active.classed('active', false);
		active = select(this).classed('active', true);

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
								Math.max((x1 - x0) / width, (y1 - y0) / height)
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
