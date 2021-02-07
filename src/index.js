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

        d3.select("body").append("h1").text("Monthly Global Land-surface Temperature");

        const xScale = d3.scaleLinear()
                        .domain([dataset[1].year, dataset[dataset.length-1].year])
                        .range([leftPadding, WIDTH - rightPadding]);

        const yScale = d3.scaleLinear()
                        .domain([1, 12])
                        .range([botPadding, HEIGHT - topPadding]);
        
        const xAxis = d3.axisBottom(xScale);

        const yAxis = d3.axisLeft(yScale);

        const svg = d3.select("body").append("svg")
                    .attr("width", WIDTH)
                    .attr("height", HEIGHT);
        
        svg.append("g").attr("id", "x-axis")
                        .attr("transform", "translate(0," + (HEIGHT - botPadding) + ")")
                        .call(xAxis.tickFormat(x => "" + x));

        svg.append('g').attr("id", "y-axis")
                        .attr("transform", "translate(" + leftPadding + ", 0)")
                        .call(yAxis.tickFormat(x => monthValues[x]));

        const tempScale = d3.scaleLinear().domain([2.8, 12.8])
            .range(WIDTH/5, 2*WIDTH/5);

        const tempAxis = d3.axisBottom(tempScale);

        d3.select("body").append("text").text(JSON.stringify(data));
    });