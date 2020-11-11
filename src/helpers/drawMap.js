import { geoPath, json } from 'd3';
// import { feature } from 'topojson';
import { prepData } from '../utilities/prepData'


export async function drawWorld() {
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

export const drawProvinceNL = (provinceNL) => {
	json(provinceNL).then((data) => {
		const province = feature(data, data.objects.provincie_2020);
		const paths = svg.selectAll('path').data(province.features);
		paths
			.enter()
			.append('path')
			.attr('class', 'province')
			.attr('d', (d) => pathGenerator(d));
	});
};