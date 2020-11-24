import { group, rollups } from 'd3';

import { colors } from '../utilities/colors';

export const drawPenR = async (svg, mapSettings, PenRData) => {
	const { projection, width, height } = mapSettings;
	const g = svg.select('g');
	PenRData.then((data) => {
		console.log(data);

		const groupByProvince = group(data, (d) => d.province);
		const groupByCity = group(data, (d) => d.city);
		console.log(groupByProvince);
		console.log(groupByCity);
		g.append('g')
			.attr('id', 'p_r_locations')
			.selectAll('circle')
			.data(data)
			.enter()
			.append('circle')
			.attr('class', 'circle')
			.attr('r', '1')
			.attr('cx', (d) => projection([d.longitude, d.latitude])[0])
			.attr('cy', (d) => projection([d.longitude, d.latitude])[1])
			.attr('fill', colors.blue)
			.append('title')
			.text((d) => d.name);
	});
};
