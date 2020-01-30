// @TODO: YOUR CODE HERE!

//build the empty svg 
const svgWidth = 800;
const svgHeight = 600;

const margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 60
};

const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;


//put it on the page
const svg = d3.select('#scatter')
.append('svg')
.attr('width', svgWidth)
.attr('height', svgHeight);

const chartGroup = svg.append('g')
.attr('transform', `translate(${margin.left}, ${margin.top})`);


//read the data
d3.csv('assets/data/data.csv').then(function(data) {

    //create scatter plot between two variables
    //x variables: poverty rate, median age, median hh income
    //y variables: obesity rate, smoker rate, no-healthcare rate

    //start with poverty vs obesity
    
    //ensure data is numeric
    data.forEach(row => {
        row.poverty = +row.poverty;
        row.obesity = +row.obesity;
    });

    //create offsets so datapoints don't totally fill the graph space
    pOff = d3.deviation(data, d => d.poverty)/2;
    oOff = d3.deviation(data, d => d.obesity)/2;

    //create scales for each variable
    const povertyScale = d3.scaleLinear()
    .domain([d3.max(data, d => d.poverty) + pOff, d3.min(data, d => d.poverty) - pOff])
    .range([chartHeight, 0]);
    
    const obesityScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.obesity) - oOff, d3.max(data, d => d.obesity) + oOff])
    .range([chartHeight, 0]);                    
    
    //create circles
    const circlesGroup = chartGroup.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', d => povertyScale(d.poverty))
    .attr('cy', d => obesityScale(d.obesity))
    .attr('r', 11)
    .attr('class', 'stateCircle')
    .attr('opacity', '0.6');


    // * Include state abbreviations in the circles.
    //this is just drawing text over the circles
    //look into 
    const stateLabels = chartGroup.selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .attr('x', d => povertyScale(d.poverty) - 6)
    .attr('y', d => obesityScale(d.obesity) + 3)
    .attr('fill', 'gray')
    .attr('text-anchor', 'center')
    .attr('font-size', 9)
    .text(d => d.abbr);

    
    //create tooltips
    const tooltip = d3.tip()
    .offset([20, -60])
    .html(d => {
        return `<strong>${d.state}:</strong><br>Poverty: ${d.poverty}<br>Obesity: ${d.obesity}`;
    })
    .attr('class', 'd3-tip');

    //add tooltips to chart
    chartGroup.call(tooltip);
    
    //create mouseover listeners to display and hide tooltip
    circlesGroup.on('mouseover', function(d) {
        tooltip.show(d, this);
    });

    stateLabels.on('mouseover', function(d) {
        tooltip.show(d, this);
    });

    circlesGroup.on('mouseout', function(d) {
        tooltip.hide(d);
    });

    stateLabels.on('mouseout', function(d) {
        tooltip.hide(d);
    });

    //create axes
    const xAxis = d3.axisBottom(povertyScale);
    const yAxis = d3.axisLeft(obesityScale);

    //add axes to chart
    chartGroup.append('g').call(xAxis)
    .attr('transform', `translate(0, ${chartHeight})`);
    chartGroup.append('g').call(yAxis);

    //crate labels for the axes
    chartGroup.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.right)
    .attr('x', 0 - (chartHeight / 2) - margin.top)
    .attr('class', 'axisText')
    .text('Obesity Rate (%)');

    chartGroup.append('text')
    .attr('transform', `translate(${chartWidth/2 - margin.right - margin.left}, ${chartHeight + margin.right})`)
    .attr('class', 'axisText')
    .text('Poverty Rate (%)');

    

    // * Create and situate your axes and labels to the left and bottom of the chart.



    // ### Bonus: include more demographics and more risk factors. \

    //Place add'l labels in your scatter plot with click events to select which data to display. 

    //Animate the transitions for circles' locations as well as axis range, three for each axis.

    // * Hint: Try binding all of the CSV data to your circles. This will let you easily determine their x or y values when you click the labels.

    // #### 2. Incorporate d3-tip

    // tooltips: implement these to reveal a specific element's data when the user hovers cursor over it. 

    //Add tooltips to your circles and display each tooltip with the data that the user has selected. 

    //Use the `d3-tip.js` plugin developed by [Justin Palmer](https://github.com/Caged)—we've already included this plugin in your assignment directory.

}); 