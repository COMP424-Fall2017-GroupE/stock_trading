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

   



    function getBarChartData() {

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
        ticker = $(".get-chart input").val().toUpperCase();
        let $historyData = $("<p>");
        if (ticker !== "") {
            // fetch data
            fetchBarChartData(ticker).then(response => {
                historyData = response;
                
                $(".render-data").empty().append($quote.html(`The current price of ${ticker} is $${quote}`));

            }, error => {
                $(".render-data").empty().append($historyData.html(error));
            });
        } else {
            $(".render-data").empty().append($historyData.html("Please enter ticker symbol"));
        }
    }



    // divide the volume property by a large number to make the number manageable, otherwise the same as walkAndDraw
    function walkAndDrawAdjustedVolume(obj) {
      var dailySeries = []; // create a new json object to hold the data
      var i = 0;


      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {


//            console.log(key);                                            

           var val = obj[key]; // the objects contents

           var volume = obj[key]["5. volume"]; // the objects volume

           var dateString = key;  // to add the date as a string to the new object

           var newMember = i;  // call each day a member of our daily series

//            console.log(val);
//          dailySeries[newMember] = val; //  add the data with date as key
          dailySeries[newMember] = { key } ; //  add the data with a number as key
          dailySeries[newMember].dateString = key; // add a dateString property and set the value to the date
          dailySeries[newMember].volume = volume/200000; // add a volume property
          dailySeries[newMember].unixDate = new Date(key).getTime() / 1000; // add a unix timestamp

          i++; // increment the index

        // walk(val);   // recursive call
        }
      }

      console.log(dailySeries);






      // call draw with data
        drawBasicCharts(dailySeries)





      return dailySeries;

    }



    // D3 functions


    function drawBasicCharts(dailySeries){




//sample D3 array
dailySeries.reverse();

var dataset = dailySeries.slice(70, 99);








//specify width and height
var w = 960;
var h = 200;



//define scales
var scaleX = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d) { return d.volume; })])
    .range([0, w]);//set output range from 0 to width of svg
var scaleY = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d) { return d.dateString; })])
    .range([0, h]);//set output range from 0 to height of svg



//add option for padding within the barchart
var padding = 3;    
    
/**
 * build a bar chart - 1
 */ 
//set title
d3.select('#test-container').append('h5').text('Bar chart 1 - no correction');
//create svg and add to the DOM
var svg = d3.select('#test-container').append('svg').attr('width', w).attr('height', h);
    
svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('x', function(d, i) {
        return i * (w / dataset.length); //works well for basic charts but D3 scales are better
    })
    .attr('y', 0)
    .attr('width', w / dataset.length - padding)//get width relative to size of data and svg width - padding
    .attr('height', function (d) {
        return d.volume; //outputs bars from upper left corner (they grow down, not up) due to svg upper-left corner for x and y - origin is top left
    });

/**
 * build a bar chart - 2 (use existing width, height, padding, dataset...)
 */
 //set title
d3.select('#test-container2').append('h5').text('Bar chart 2 - correction');
//create svg2 and add to the DOM
var svg2 = d3.select('#test-container2').append('svg').attr('width', w).attr('height', h);
    
    svg2.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('x', function(d, i) {
            return i * (w / dataset.length); //works well for basic charts but D3 scales are better
        })
        .attr('y', function (d) {
            return h - d.volume;//set top of each bar relative to svg top left - get height minus the data value and then grow bar chart down with height
        })
        .attr('width', w / dataset.length - padding)//get width relative to size of data and svg width - padding
        .attr('height', function (d) {
            return d.volume;
        });

/**
 * build a bar chart with colour - 3 (use existing width, height, padding, dataset...)
 */
 //set title
d3.select('#test-container3').append('h5').text('Bar chart 3 - colours');   
//create svg3 and add to the DOM
var svg3 = d3.select('#test-container3').append('svg').attr('width', w).attr('height', h);
    
svg3.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('x', function(d, i) {
        return i * (w / dataset.length); //works well for basic charts but D3 scales are better
    })
    .attr('y', function (d) {
        return h - d.volume;//set top of each bar relative to svg top left - get height minus the data value and then grow bar chart down with height
    })
    .attr('width', w / dataset.length - padding)//get width relative to size of data and svg width - padding
    .attr('height', function (d) {
        return d.volume;
    })
    .attr('fill', function (d) {
        return 'rgb(0, 0, ' + (d.volume * 5) + ')';//colour is set relative to data per bar
    });
    
/**
 * build a bar chart with labels - 4 (use existing width, height, padding, dataset...)
 */
 //set title
d3.select('#test-container4').append('h5').text('Bar chart 4 - values');        
//create svg4 and add to the DOM
var svg4 = d3.select('#test-container4').append('svg').attr('width', w).attr('height', h);
    
svg4.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('x', function(d, i) {
        return i * (w / dataset.length); //works well for basic charts but D3 scales are better
    })
    .attr('y', function (d) {
        return h - d.volume;//set top of each bar relative to svg top left - get height minus the data value and then grow bar chart down with height
    })
    .attr('width', w / dataset.length - padding)//get width relative to size of data and svg width - padding
    .attr('height', function (d) {
        return d.volume;
    })
    .attr('fill', function (d) {
    return 'rgb(0, 0, ' + (d.volume * 5) + ')';//colour is set relative to data per bar
    });
        
    //add text to bar chart
    svg4.selectAll('text')
        .data(dataset)
        .enter()
        .append('text')
        .text( function(d) {
            return d.volume;
        })
        .attr('x', function(d, i) {
            return i * (w / dataset.length) + ((w / dataset.length) / 2) - 6; //set posn of text tp centred in bar... -6 for font-size / 2
        })
        .attr('y', function(d, i) {
            return h - (d.volume) - 5;//set labels to the top of the bars with some taken off (-5) to move above bar itself
        })
        .attr('font-family', 'serif')
        .attr('font-size', '12px')
        .attr('fill', 'navy'); 

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


  


    function fetchBarChartData(ticker) {
        spinner.show();
        return new Promise((resolve, reject) => {
            let url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&interval=60min&outputsize=compact&apikey=${apiKey}`;
            // parse JSON
            $.getJSON(url)
                .done(function (json) {
                    if (typeof json !== 'undefined' && typeof json !== 'null' && !json["Error Message"]) {
                        // find necessary data


                        let key = json["Meta Data"]["3. Last Refreshed"];
                        let date = key.substr(0,key.indexOf(' ')); // only the Day is used in this object, cut off the time
                        let dailyQuote = json["Time Series (Daily)"][date];
                        walkAndDrawAdjustedVolume(json["Time Series (Daily)"]); 




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


        $(".get-chart button").on("click", function (e) {
        getBarChartData();
    });

    $(".get-chart input").on("keypress", function (e) {
        if (e.keyCode === 13) {
            getBarChartData();
        }
    });


}

$(document).ready(getHistoricalData);
