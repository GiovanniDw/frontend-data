import { select, csv, scaleLinear, max, scaleBand, axisLeft, axisBottom, format, text } from 'd3';

const svg = select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const render = data => {
	const xValue = (d) => d.Capaciteit;
	const yValue = (d) => d.Provincie;
	const margin = { top: 50, right: 50, bottom: 50, left: 100 }
	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;

	const xScale = scaleLinear()
		.domain([0, max(data, xValue)])
		.range([0, innerWidth]);

	const yScale = scaleBand()
		.domain(data.map(yValue))
		.range([0, innerHeight])
		.padding(0.1)

	const g = svg.append('g')
		.attr('transform', `translate(${margin.left},${margin.top})`);
	
	const xAxis = axisBottom(xScale)
		.tickFormat(format('.2s'))
		.tickSize(-innerHeight);

	g.append('g')
		.call(axisLeft(yScale))
		.selectAll('.domain, .tick line')
		.remove();

	const xAxisG = g.append('g').call(xAxis)
		.attr('transform', `translate(0,${innerHeight})`);
	
	xAxisG.select('.domain').remove();

	xAxisG.append('text')
		.attr('class', 'axis-label')
		.attr('y', 40)
		.attr('x', innerWidth / 2)
		.attr('fill', 'black')
		.text("PenR Capaciteit");

	g.selectAll('rect').data(data)
		.enter().append('rect')
		.attr('y', d => yScale(yValue(d)))
		.attr('width', d => xScale(xValue(d)))
		.attr('height', yScale.bandwidth())
	
	g.append('text')
		.attr('class', 'title')
		.attr('y', -5)
		.text('PenR Capaciteit in provincies')
	
}

csv('./static/data/Provincies_Capaciteit_PenR.csv').then(data => {
	data.forEach(d => {
		console.log(d.Capaciteit = + d.Capaciteit)
		d.Capaciteit = + d.Capaciteit * 1;
	})
	render(data)
})

