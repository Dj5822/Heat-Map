const WIDTH = screen.width - 60;
const HEIGHT = screen.height*3/4 - 250;

const leftPadding = 70;
const rightPadding = 50;
const botPadding = 50;
const topPadding = 50;

const monthValues = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
}

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
    .then(response => response.json())
    .then(data => {
        const dataset = data.monthlyVariance;

        d3.select("body").append("h1").text("Monthly Global Land-surface Temperature")
            .attr("id", "title");

        d3.select("body").append("h3").text(dataset[1].year + " - " + dataset[dataset.length-1].year + ": base temperature " + data.baseTemperature + String.fromCharCode(176) + "C")
            .attr("id", "description");

        const xScale = d3.scaleLinear()
                        .domain([dataset[1].year, dataset[dataset.length-1].year])
                        .range([leftPadding, WIDTH - rightPadding]);

        const yScale = d3.scaleBand()
                        .domain([1,2,3,4,5,6,7,8,9,10,11,12])
                        .range([botPadding, HEIGHT - topPadding]);
        
        const xAxis = d3.axisBottom(xScale);

        const yAxis = d3.axisLeft(yScale);

        const svg = d3.select("body").append("svg")
                    .attr("width", WIDTH)
                    .attr("height", HEIGHT);

        const rectWidth = xScale(dataset[0].year+1) - xScale(dataset[0].year);
        const rectHeight = yScale(2) - yScale(1);

        var tooltip = d3.select('body').append('div')
                        .attr("id", "tooltip")
                        .style("width", "150px")
                        .style("height", "100px")
                        .style("opacity", 0)
                        .style("text-align", "center")
                        .attr("data-year", "")
                        .style("left", "0px")
                        .style("top", 5 * HEIGHT / 4 + "px");

        var dateText = tooltip.append("label");
        var tempText = tooltip.append("label");
        var varianceText = tooltip.append("label");

        svg.selectAll('rect').data(dataset).enter().append('rect')
            .attr("class", "cell")
            .attr("data-month", (d, i) => d.month-1)
            .attr("data-year", (d, i) => d.year)
            .attr("data-temp", (d, i) => data.baseTemperature + d.variance)
            .attr("width", rectWidth)
            .attr("height", rectHeight)
            .attr("x", (d,i) => {
                return xScale(d.year);
            })
            .attr("y", (d,i) => {
                return yScale(d.month);
            })
            .attr("fill", (d,i) => {
                if (data.baseTemperature + d.variance <= 2.8) {
                    return "rgb(49, 54, 149)";
                }
                else if (data.baseTemperature + d.variance <= 3.9) {
                    return "rgb(69, 117, 180)";
                }
                else if (data.baseTemperature + d.variance <= 5) {
                    return "rgb(116, 173, 209)";
                }
                else if (data.baseTemperature + d.variance <= 6.1) {
                    return "rgb(171, 217, 233)";
                }
                else if (data.baseTemperature + d.variance <= 7.2) {
                    return "rgb(224, 243, 248)";
                }
                else if (data.baseTemperature + d.variance <= 8.3) {
                    return "rgb(255, 255, 191)";
                }
                else if (data.baseTemperature + d.variance <= 9.5) {
                    return "rgb(254, 224, 144)";
                }
                else if (data.baseTemperature + d.variance <= 10.6) {
                    return "rgb(253, 174, 97)";
                }
                else if (data.baseTemperature + d.variance <= 11.7) {
                    return "rgb(244, 109, 67)";
                }
                else if (data.baseTemperature + d.variance <= 12.8) {
                    return "rgb(215, 48, 39)";
                }
                else {
                    return "rgb(165, 0, 38)";
                }
            })
            .on("mouseover", (d, i) => {
                dateText.text(d.year + " - " + monthValues[d.month]);
                tempText.text((data.baseTemperature + d.variance).toFixed(1) + String.fromCharCode(176) + "C");
                varianceText.text(d.variance.toFixed(1) + String.fromCharCode(176) + "C");

                tooltip.style("left", xScale(d.year) - 150/3 + "px")
                        .style("top", yScale(d.month) + "px")
                        .style("opacity", 1)
                        .attr("data-year", d.year);
            })
            .on("mouseout", (d, i) => {
                tooltip.style("left", "0px")
                        .style("top", 5 * HEIGHT / 4 + "px")
                        .style("opacity", 0);
            });
        
        svg.append("g").attr("id", "x-axis")
                        .attr("transform", "translate(0," + (HEIGHT - botPadding) + ")")
                        .call(xAxis.tickFormat(x => "" + x));

        svg.append('g').attr("id", "y-axis")
                        .attr("transform", "translate(" + leftPadding + ", 0)")
                        .call(yAxis.tickFormat(x => monthValues[x]));

        const legend = d3.select("body").append("svg")
                        .attr("id", "legend")
                        .attr("width", WIDTH)
                        .attr("height", HEIGHT/3);
        
        var legendValues = [2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8];

        const legendScale = d3.scaleLinear().domain([1.7, 13.9])
            .range([WIDTH/5, 3*WIDTH/5]);

        const legendAxis = d3.axisBottom(legendScale);
        const legendRectHeight = legendScale(legendValues[1]) - legendScale(legendValues[0]);

        legend.append('g').attr("id", "legend-axis")
            .attr("transform", "translate(0, " + HEIGHT/4 + ")")
            .call(legendAxis.tickFormat(d3.format(".1f")).tickValues(legendValues));

        legend.selectAll("rect").data(legendValues.slice(0, legendValues.length-1)).enter().append("rect")
            .attr("width", (d,i) => {
                return legendScale(legendValues[i+1]) - legendScale(d);
            })
            .attr("height", legendRectHeight)
            .attr("x", (d,i) => legendScale(d))
            .attr("y", HEIGHT/4 - legendRectHeight)
            .style("fill", (d,i) => {
                if (d < 3.9) {
                    return "rgb(69, 117, 180)";
                }
                else if (d < 5) {
                    return "rgb(116, 173, 209)";
                }
                else if (d < 6.1) {
                    return "rgb(171, 217, 233)";
                }
                else if (d < 7.2) {
                    return "rgb(224, 243, 248)";
                }
                else if (d < 8.3) {
                    return "rgb(255, 255, 191)";
                }
                else if (d < 9.5) {
                    return "rgb(254, 224, 144)";
                }
                else if (d < 10.6) {
                    return "rgb(253, 174, 97)";
                }
                else if (d < 11.7) {
                    return "rgb(244, 109, 67)";
                }
                else if (d < 12.8) {
                    return "rgb(215, 48, 39)";
                }
            });

        d3.select("body").append("text").text(JSON.stringify(data));
    });