import {colors} from '../utilities/colors'

export async function drawPenR(svg, mapSettings, PenRData) {

    const { projection, width, height } = mapSettings

    PenRData.then((data) => {
        const g = svg.select('g');
        const PenRLocation = g
            .append('g')
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
}
