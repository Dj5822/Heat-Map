fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
    .then(response => response.json())
    .then(data => {
        d3.select("body").append("h1").text("Monthly Global Land-surface Temperature");
        d3.select("body").append("text").text(JSON.stringify(data));
    });