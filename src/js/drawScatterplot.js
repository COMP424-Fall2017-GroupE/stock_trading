function getHistoricalData() {
    "use strict";
    let ticker;
    let quote;
    let historyData;
    let quantity;
    let dealSum;
    let apiKey = "38HEIOY4TO9U5D4S";
    let trnumber = 1;
    let {transaction} = {};
    let {portfolio} = {};
    // change when user management is ready
    const userID = 1;
    const spinner = $(".spinner img");
    const chart = $(".chart");

    chart.hide();

    getPortfolio().then(response => {
        displayPortfolio(response).then(response => {
            spinner.hide();
        });
    });

    function getData() {

        // first get a current quote for the item
        ticker = $(".get-data input").val().toUpperCase();
        let $quote = $("<p>");
        if (ticker !== "") {
        fetchQuote(ticker).then(response => {
        quote = response;
    },
    error => {
                $(".render-quote").empty().append($quote.html(error));
            });
    }

        // now get the historical data
        ticker = $(".get-data input").val().toUpperCase();
        let $historyData = $("<p>");
        if (ticker !== "") {
            // fetch data
            fetchData(ticker).then(response => {
                historyData = response;
                
                $(".render-data").empty().append($quote.html(`The current price of ${ticker} is $${quote}`));

            }, error => {
                $(".render-data").empty().append($historyData.html(error));
            });
        } else {
            $(".render-data").empty().append($historyData.html("Please enter ticker symbol"));
        }
    }


    function getGridData() {

        // first get a current quote for the item
        ticker = $(".get-data input").val().toUpperCase();
        let $quote = $("<p>");
        if (ticker !== "") {
        fetchQuote(ticker).then(response => {
        quote = response;
    },
    error => {
                $(".render-quote").empty().append($quote.html(error));
            });
    }

        // now get the historical data
        ticker = $(".get-grid1 input").val().toUpperCase();
        let $historyData = $("<p>");
        if (ticker !== "") {
            // fetch data
            fetchGridData(ticker).then(response => {
                historyData = response;
                
                $(".render-grid1").empty().append($quote.html(`The current price of ${ticker} is $${quote}`));

            }, error => {
                $(".render-grid1").empty().append($historyData.html(error));
            });
        } else {
            $(".render-grid1").empty().append($historyData.html("Please enter ticker symbol"));
        }
    }



    // divide the volume property by a large number to make the number manageable, otherwise the same as walkAndDraw
    function walkAndDrawAdjustedVolume(obj) {
      var dailySeries = []; // create a new json object to hold the data
      var i = 0;


      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {


                                      
           var val = obj[key]; // the objects contents
           var volume = obj[key]["5. volume"]; // the objects volume
           var dateString = key;  // to add the date as a string to the new object
           var newMember = i;  // call each day a member of our daily series


          dailySeries[newMember] = { key } ; //  add the data with a number as key
          dailySeries[newMember].dateString = key; // add a dateString property and set the value to the date
          dailySeries[newMember].volume = volume; // add a volume property
          dailySeries[newMember].unixDate = new Date(key).getTime() / 1000; // add a unix timestamp

          i++; // increment the index

        }
      }

      // call draw with data
        drawBasicGrid(dailySeries);
    }



    // D3 functions
function drawBasicGrid(dailySeries){

//an example of 7 days from our daily series
var week1 = dailySeries.slice(0, 7);


//a sample of the first year of our daily series
var year1 = dailySeries.slice(0, 364);




    function renderYearInWeeks(dataArray){
        var counter = 0; 
        var weeksArray = [];
        var testD3Array = [];

        dataArray.forEach(function(d, i) {
     //   console.log(d.volume + "  " + d.dateString + "  " + d.unixDate + "   " + counter);


        
        weeksArray.push(d);
        counter++;
        // every 7 days
        if(counter % 7 === 0 && counter <= 364){

      //      console.log("time for a new array");
            var currentWeek = renderWeeklyArray(weeksArray);
            var computedWeeklyVolume = weeklyVolumeSum(weeksArray);
            var unixDateInt = weeksArray[0].unixDate;
            // reset array after saving variables to set up for next week
            weeksArray.length = 0;



            // add them to our new object
            var testObject = { };
                testObject['days'] = currentWeek;
                testObject['total'] = computedWeeklyVolume;
                testObject['week'] = unixDateInt;


        //    console.log(testObject);
            testD3Array.push(testObject);
        }
        



        //    console.log(testD3Array);

        });

            return testD3Array;
    }



//a function to change 7 days of data into an array of volume

    function renderWeeklyArray(dataArray){
    
    
    
    

    

    
    var daysVolumeArray = []; // array to hold the values of daily volume
    
    
        // iterate through every item in the dataArray
        dataArray.forEach(function(d, i) {
        
               
        
      //   console.log(d.volume + "  " + d.dateString + "  " + d.unixDate);

        // add value of volume to the array

        var volume = parseInt(d.volume, 10); //volume as an integer to add to our array


          daysVolumeArray.push((volume)); 
        
        
        });

    
    
       //     console.log(daysVolumeArray);
            return daysVolumeArray;
    

    }


//a function to add the items in an arry 
    function weeklyVolumeSum(dataArray){



        var totalVolume = 0;

        dataArray.forEach(function(d, i) {

            totalVolume += parseInt(d.volume, 10);

        });

    //    console.log(totalVolume);
        return totalVolume;

        }



/**
 * commit totals - monthly and cumulative bar chart
 **/

//test data from github
var json_obj = [{"days":[6,18,11,5,12,2,10],"total":64,"week":1400371200},{"days":[7,6,9,9,11,2,2],"total":46,"week":1400976000},{"days":[3,5,4,2,9,17,15],"total":55,"week":1401580800},{"days":[9,11,9,11,10,1,10],"total":61,"week":1402185600},{"days":[10,20,10,3,8,7,6],"total":64,"week":1402790400},{"days":[4,13,5,6,6,2,1],"total":37,"week":1403395200},{"days":[2,10,8,8,2,4,10],"total":44,"week":1404000000},{"days":[3,6,4,5,8,6,5],"total":37,"week":1404604800},{"days":[10,10,7,9,1,0,0],"total":37,"week":1405209600},{"days":[0,9,4,5,11,12,17],"total":58,"week":1405814400},{"days":[8,5,16,6,3,6,8],"total":52,"week":1406419200},{"days":[9,12,5,1,11,9,4],"total":51,"week":1407024000},{"days":[4,7,8,11,11,10,2],"total":53,"week":1407628800},{"days":[2,9,16,6,7,8,10],"total":58,"week":1408233600},{"days":[3,3,14,10,6,11,4],"total":51,"week":1408838400},{"days":[3,3,9,2,8,18,12],"total":55,"week":1409443200},{"days":[4,14,7,10,2,8,3],"total":48,"week":1410048000},{"days":[3,4,8,10,6,7,4],"total":42,"week":1410652800},{"days":[10,5,9,12,4,5,6],"total":51,"week":1411257600},{"days":[1,8,3,1,5,1,10],"total":29,"week":1411862400},{"days":[2,5,6,8,9,5,8],"total":43,"week":1412467200},{"days":[3,4,8,12,4,6,5],"total":42,"week":1413072000},{"days":[10,8,7,9,7,7,2],"total":50,"week":1413676800},{"days":[1,10,5,4,13,11,1],"total":45,"week":1414281600},{"days":[0,10,8,9,3,2,1],"total":33,"week":1414886400},{"days":[4,10,10,10,10,3,40],"total":87,"week":1415491200},{"days":[11,17,21,14,13,11,16],"total":103,"week":1416096000},{"days":[5,13,12,7,12,9,13],"total":71,"week":1416700800},{"days":[3,13,8,11,11,7,11],"total":64,"week":1417305600},{"days":[3,6,6,0,10,3,8],"total":36,"week":1417910400},{"days":[11,10,3,12,6,7,3],"total":52,"week":1418515200},{"days":[5,3,14,11,2,16,9],"total":60,"week":1419120000},{"days":[3,9,10,8,8,12,14],"total":64,"week":1419724800},{"days":[1,8,8,6,10,12,16],"total":61,"week":1420329600},{"days":[10,12,10,8,7,12,32],"total":91,"week":1420934400},{"days":[22,10,6,4,3,6,1],"total":52,"week":1421539200},{"days":[3,7,9,8,8,11,2],"total":48,"week":1422144000},{"days":[4,2,13,9,12,10,9],"total":59,"week":1422748800},{"days":[9,15,15,12,11,6,15],"total":83,"week":1423353600},{"days":[7,17,7,7,5,9,16],"total":68,"week":1423958400},{"days":[16,7,4,7,4,6,5],"total":49,"week":1424563200},{"days":[1,5,6,10,9,4,12],"total":47,"week":1425168000},{"days":[8,8,7,7,11,8,1],"total":50,"week":1425772800},{"days":[5,8,9,6,3,11,8],"total":50,"week":1426377600},{"days":[15,2,2,2,6,4,8],"total":39,"week":1426982400},{"days":[1,6,8,19,9,5,7],"total":55,"week":1427587200},{"days":[1,4,4,6,4,0,3],"total":22,"week":1428192000},{"days":[0,14,12,2,5,3,3],"total":39,"week":1428796800},{"days":[5,8,5,2,3,15,4],"total":42,"week":1429401600},{"days":[1,6,4,5,5,4,6],"total":31,"week":1430006400},{"days":[3,3,5,3,5,4,7],"total":30,"week":1430611200},{"days":[0,3,1,8,1,1,0],"total":14,"week":1431216000}];
// console.log(json_obj);
// console.log(jsonTestObject);



// call the render year in weeks on the first year of data
var thisYearsData = renderYearInWeeks(year1);

var data = thisYearsData;

//sum daily values for weekly total
function weeklySum (dataArray, i) {
    var weeklySum = d3.sum(dataArray[i].days);
    return weeklySum;
}

//sum weekly values for yearly total
 function yearSum (dataArray) {
    var yTotal = [];

    dataArray.forEach(function(d, i) {
        yTotal.push(d.total);
    });

    var sumYear = d3.sum(yTotal);
    return sumYear;
} 

//get months from weeks & add weekly totals
function monthNos (dataArray) {
var repoMonths = [];
var weekMonths = [];

dataArray.forEach(function(d, i) {
    //week as unix time
    var week = d.week;
    var weekTotal = d.total;
    //convert unix time for js
    var date = new Date(week*1000);
    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
//extract month no. from date
var monthNo = month[date.getMonth()];
    
var obj = {};   
    obj['month'] = monthNo;
    obj['weekTotal'] = weekTotal;
    weekMonths.push(obj);   
});

return weekMonths;
}

//sum all totals to get year total...
 var yearlyTotal = yearSum(data);
//create objects with month and weekly totals...
 var monthNum = monthNos(data);
    
//create nest, get length per leaf, and sum leafs to get total per month...
var nest = d3v3.nest()
    .key(function (d, i) { return d.month; })
    .rollup(function(leaves) { 
    return {
    "length": leaves.length, "month_total": d3v3.sum(leaves, function(d) {return parseFloat(d.weekTotal);})
    } 
    })
    .entries(monthNum);
    
var monthlyTotals = [];
var cMonthlyTotals = [];
    
nest.forEach(function(d, i) {
    //console.log(d.values['month_total'], i);
    monthlyTotals.push(d.values['month_total']);
    var cTotal = d3v3.sum(monthlyTotals);
    cMonthlyTotals.push(cTotal);
    });

//set custom axis labels for months...
function setMonths() {

var month = new Array();
        month[0] = "Jan";
        month[1] = "Feb";
        month[2] = "Mar";
        month[3] = "Apr";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "Aug";
        month[8] = "Sept";
        month[9] = "Oct";
        month[10] = "Nov";
        month[11] = "Dec";
        
d3.selectAll('svg g.axes g.x g.tick text').each(function(d,i) { }).text( function (d,i) {return month[i]});

} 

//output text labels
function outputText(text, container) {
    d3.select(container + " p").remove();
    d3.select(container).append("p").text(text); 
}

/**
Building the chart...
*/

//start of build lineChart
function lineChart() { // <-1A
    var _chart = {};
    var _width = 800, _height = 800, // <-1B
            _margins = {top: 220, left: 120, right: 120, bottom: 120},
            _x, _y,
            _data = [],
            _colors = d3v3.scale.category20(),
            _svg,
            _bodyG,
            _line;
            
    _chart.render = function () { // <-2A
        if (!_svg) {
            _svg = d3.select("#test-container").append("svg") // <-2B
                    .attr("height", _height)
                    .attr("width", _width);
            renderAxes(_svg);
            defineBodyClip(_svg);
        }
        renderBody(_svg);
    };
    function renderAxes(svg) {
        var axesG = svg.append("g")
                .attr("class", "axes");
        renderXAxis(axesG);
        renderYAxis(axesG);
    }
    
    function renderXAxis(axesG){
        var xAxis = d3v3.svg.axis()
                .scale(_x.range([0, quadrantWidth()]))
                .orient("bottom");        
        axesG.append("g")
                .attr("class", "x axis")
                .attr("transform", function () {
                    return "translate(" + xStart() + "," + yStart() + ")";
                })
                .call(xAxis);
                
        d3.selectAll("g.x g.tick")
            .append("line")
                .classed("grid-line", true)
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", 0)
                .attr("y2", - quadrantHeight());
    }
    
    function renderYAxis(axesG){
        var yAxis = d3v3.svg.axis()
                .scale(_y.range([quadrantHeight(), 0]))
                .orient("left");
                
        axesG.append("g")
                .attr("class", "y axis")
                .attr("transform", function () {
                    return "translate(" + xStart() + "," + yEnd() + ")";
                })
                .call(yAxis);
                
         d3.selectAll("g.y g.tick")
            .append("line")
                .classed("grid-line", true)
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", quadrantWidth())
                .attr("y2", 0);
    }
    function defineBodyClip(svg) { // <-2C
        var padding = 100;
        svg.append("defs")
                .append("clipPath")
                .attr("id", "body-clip")
                .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", quadrantWidth() + 2 * padding)
                .attr("height", quadrantHeight());
    }
    function renderBody(svg) { // <-2D
        if (!_bodyG)
            _bodyG = svg.append("g")
                    .attr("class", "body")
                    .attr("transform", "translate(" 
                        + xStart() + "," 
                        + yEnd() + ")") // <-2E
                    .attr("clip-path", "url(#body-clip)");        
       renderLines();
     //  renderDots();
       renderScatter();
    }
    function renderLines() {
        _line = d3v3.svg.line() //<-4A
                        .x(function (d) { return _x(d.x); })
                        .y(function (d) { return _y(d.y); });
                        
        _bodyG.selectAll("path.line")
                    .data(_data)
                .enter() //<-4B
                .append("path")                
                .style("stroke", function (d, i) { 
                    return _colors(i); //<-4C
                })
                .attr("class", "line");
        _bodyG.selectAll("path.line")
                .data(_data)
                .transition() //<-4D
                .attr("d", function (d) { return _line(d); });
    }
    function renderDots() {
        _data.forEach(function (list, i) {
            _bodyG.selectAll("circle._" + i) //<-4E
                        .data(list)
                    .enter()
                    .append("circle")
                    .attr("class", "dot _" + i);
            _bodyG.selectAll("circle._" + i)
                    .data(list)                    
                    .style("stroke", function (d) { 
                        return _colors(i); //<-4F
                    })
                    .transition() //<-4G
                    .attr("cx", function (d) { return _x(d.x); })
                    .attr("cy", function (d) { return _y(d.y); })
                    .attr("r", 2.5);
        });
    }
    
    function renderScatter() {
    
    //add simple circles to the svg for our scatterplot
    _data.forEach(function (list, i) {
    _bodyG.selectAll('circle._' + i)
        .data(list)
        .enter()
        .append('circle')
        .attr("fill", "green")
        .attr("class", "dot _" + i);
            _bodyG.selectAll("circle._" + i)
                    .data(list)                
                    .style("stroke", function (d) { 
                        return _colors(i); //<-4F
                    })
                    .transition() //<-4G
                    .attr("cx", function (d) { return _x(d.x); })
                    .attr("cy", function (d) { return _y(d.y); })
                    .attr("r", function (d) { return (Math.sqrt(d.y)/1.5)/800; }) //divide by 800 to make numbers
                    .attr("fill", "green");
    });


    }
    
    function xStart() {
        return _margins.left;
    }
    function yStart() {
        return _height - _margins.bottom;
    }
    function xEnd() {
        return _width - _margins.right;
    }
    function yEnd() {
        return _margins.top;
    }
    function quadrantWidth() {
        return _width - _margins.left - _margins.right;
    }
    function quadrantHeight() {
        return _height - _margins.top - _margins.bottom;
    }
    _chart.width = function (w) {
        if (!arguments.length) return _width;
        _width = w;
        return _chart;
    };
    _chart.height = function (h) { // <-1C
        if (!arguments.length) return _height;
        _height = h;
        return _chart;
    };
    _chart.margins = function (m) {
        if (!arguments.length) return _margins;
        _margins = m;
        return _chart;
    };
    _chart.colors = function (c) {
        if (!arguments.length) return _colors;
        _colors = c;
        return _chart;
    };
    _chart.x = function (x) {
        if (!arguments.length) return _x;
        _x = x;
        return _chart;
    };
    _chart.y = function (y) {
        if (!arguments.length) return _y;
        _y = y;
        return _chart;
    };
    _chart.addSeries = function (series) { // <-1D
        _data.push(series);
        return _chart;
    };
    return _chart; // <-1E
}

function randomData() {
    return Math.random() * 9;
}
function update(gitData) {
    for (var i = 0; i < data.length; ++i) {
        var series = data[i];
        series.length = 0;
        for (var j = 0; j < numberOfDataPoint; ++j)
            series.push({x: j, y: gitData[j]});
    }
    chart.render();
}

var numberOfSeries = 1,
    numberOfDataPoint = 12,
    data = [];

function buildChart(chartData) {

var numberOfSeries = 1,
    numberOfDataPoint = 12,
    data = [];

for (var i = 0; i < numberOfSeries; ++i)
    data.push(d3.range(numberOfDataPoint).map(function (i) {
    // console.log(monthlyTotals[i]);
        return {x: i, y: chartData[i]};
    }));
    
var maxHeight = Math.max.apply(Math, chartData); 

//console.log(maxHeight);
    
var chart = lineChart()
        .x(d3v3.scale.linear().domain([0, 11]))
        .y(d3v3.scale.linear().domain([0, maxHeight+50]));
        
data.forEach(function (series) {
console.log(series);
    chart.addSeries(series);
});

chart.render();
}

function outputText(text) {
    d3.select("#output_label p").remove();
    d3.select("#output_label").append("p").text(text); 
}

function setMonths() {

var month = new Array();
        month[0] = "Jan";
        month[1] = "Feb";
        month[2] = "Mar";
        month[3] = "Apr";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "Aug";
        month[8] = "Sept";
        month[9] = "Oct";
        month[10] = "Nov";
        month[11] = "Dec";
        
d3.selectAll('svg g.axes g.x g.tick text').each(function(d,i) { }).text( function (d,i) {return month[i]});

} 

buildChart(monthlyTotals);
setMonths();


}






    function fetchQuote(ticker) {
        spinner.show();
        return new Promise((resolve, reject) => {
            let url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=60min&outputsize=compact&apikey=${apiKey}`;
            // parse JSON
            $.getJSON(url)
                .done(function (json) {
                    if (typeof json !== 'undefined' && typeof json !== 'null' && !json["Error Message"]) {
                        // find necessary quote
                        let key = json["Meta Data"]["3. Last Refreshed"];
                        let quote = Number(json["Time Series (60min)"][key]["4. close"]);
                        spinner.hide();
                        resolve(quote.toFixed(2));
                    }
                    else {
                        spinner.hide();
                        reject(`${ticker} ticker symbol not found`);
                    }
                })
                .fail(function () {
                    spinner.hide();
                    reject(`Failed to fetch ${ticker} data`);
                });
        });
    }



    function fetchGridData(ticker) {
        spinner.show();
        return new Promise((resolve, reject) => {
            let url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&interval=60min&outputsize=full&apikey=${apiKey}`;
            // parse JSON
            $.getJSON(url)
                .done(function (json) {
                    if (typeof json !== 'undefined' && typeof json !== 'null' && !json["Error Message"]) {
                        // find necessary data


                        let key = json["Meta Data"]["3. Last Refreshed"];
                        let date = key.substr(0,key.indexOf(' ')); // only the Day is used in this object, cut off the time
                        let dailyQuote = json["Time Series (Daily)"][date];
                        walkAndDrawAdjustedVolume(json["Time Series (Daily)"]); 
                      //  drawBasicGrid();



                        spinner.hide();
                        resolve();
                    }
                    else {
                        spinner.hide();
                        reject(`${ticker} ticker symbol not found`);
                    }
                })
                .fail(function () {
                    spinner.hide();
                    reject(`Failed to fetch ${ticker} data`);
                });
        });
    }





    // helper function to fetch user's portfolio from the database
    function getPortfolio() {
        spinner.show();
        return new Promise((resolve, reject) => {
            $.getJSON("portfolio.json")
                .done(function (json) {
                    spinner.hide();
                    resolve(json);
                })
                .fail(function () {
                    spinner.hide();
                    reject(alert(`Failed to fetch user's portfolio`));
                });
        });
    }

    // display user's portfolio
    function displayPortfolio(portfolio) {
        return new Promise((resolve, reject) => {
            $("#portfolio tbody").empty();

            let $tr = $("<tr>");
            let $td = [];
            $td.push($("<td>").html("Money"));
            $td.push($("<td>").html(portfolio.Money.toFixed(2)));
            $td.push($("<td>").html("-"));
            $td.push($("<td>").html(portfolio.Money.toFixed(2)));
            $td.forEach(function (item) {
                $tr.append(item);
            });

            $("#portfolio tbody").append($tr);

            portfolio.Stocks.forEach(function (item, i) {
                if (item.Quantity > 0) {
                    fetchQuote(item.Ticker).then(response => {
                        $tr = $("<tr>");
                        $td = [];
                        $td.push($("<td>").html(item.Ticker));
                        $td.push($("<td>").html(item.Quantity));
                        $td.push($("<td>").html(response));
                        $td.push($("<td>").html((item.Quantity * response).toFixed(2)));
                        $td.forEach(function (item) {
                            $tr.append(item);
                        });
                        $("#portfolio tbody").append($tr);
                    }, error => {
                        reject(error);
                    });
                } else {
                    return;
                }
            });
            resolve();
        });
    }


    //handle user events

        $(".get-grid1 button").on("click", function (e) {
        getGridData();
    });

    $(".get-grid1 input").on("keypress", function (e) {
        if (e.keyCode === 13) {
            getGridData();
        }
    });


}

$(document).ready(getHistoricalData);
