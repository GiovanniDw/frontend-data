import { select, csv, scaleLinear, extent, scalePoint, axisLeft, axisBottom, format, text } from 'd3';

const svg = select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

	// d.capacity = +d.capacity;
	// d.minimumHeightInMeters = +d.minimumHeightInMeters;
	// d.openingTimes = +d.openingTimes;
	// d.id = +d.id;

const render = data => {
	const title = "Capaciteit Vs Heights";

	const xValue = (d) => d.capacity;
	const xAxisLabel = 'Capaciteit'

	const yValue = (d) => d.minimumHeightInMeters;
	const circleRadius = 10;
	const yAxisLabel = "Min Hoogte";


	const margin = { top: 50, right: 50, bottom: 50, left: 100 }
	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;

	const xScale = scaleLinear()
		.domain(extent(data, xValue))
		.range([0, innerWidth])
		.nice();

	const yScale = scaleLinear()
		.domain(extent(data, yValue))
		.range([innerHeight, 0])
		.nice()

	const g = svg.append('g')
		.attr('transform', `translate(${margin.left},${margin.top})`);
	
	const xAxis = axisBottom(xScale)
		.tickSize(-innerHeight)
		.tickPadding(15);

	const yAxis = axisLeft(yScale)
		.tickSize(-innerWidth)
		.tickPadding(10);

	const yAxisG = g.append('g').call(yAxis);
	yAxisG.selectAll('.domain').remove();
	
	yAxisG
		.append('text')
		.attr('class', 'axis-label')
		.attr('y', -93)
		.attr('x', -innerHeight / 2)
		.attr('fill', 'black')
		.attr('transform', `rotate(-90)`)
		.attr('text-anchor', 'middle')
		.text(yAxisLabel)

	const xAxisG = g.append('g').call(xAxis)
		.attr('transform', `translate(0,${innerHeight})`);
	
	xAxisG.select('.domain').remove();

	xAxisG.append('text')
		.attr('class', 'axis-label')
		.attr('y', 40)
		.attr('x', innerWidth / 2)
		.attr('fill', 'black')
		.text(xAxisLabel);

	g.selectAll('circle').data(data)
		.enter().append('circle')
		.attr('cy', d => yScale(yValue(d)))
		.attr('cx', d => xScale(xValue(d)))
		.attr('r', circleRadius)
	
	g.append('text')
		.attr('class', 'title')
		.attr('y', -5)
		.text(title)
	
}

csv('./static/data/OpenParking_PnR.csv').then(data => {
	data.forEach(d => {
		d.capacity = +d.capacity;
		d.minimumHeightInMeters = +d.minimumHeightInMeters;
		d.openingTimes = +d.openingTimes;
		d.id = +d.id;
	})
	console.log(data)
	render(data)
})
