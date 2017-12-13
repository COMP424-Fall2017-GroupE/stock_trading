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
      var tempVolumes = [];


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
          dailySeries[newMember].volume = volume; // add a volume property
          dailySeries[newMember].unixDate = new Date(key).getTime() / 1000; // add a unix timestamp


          tempVolumes.push(volume);






          i++; // increment the index

        // walk(val);   // recursive call
        }
      }

    //  console.log(dailySeries);






      // call draw with data
        drawBasicCharts(dailySeries, tempVolumes);





      return dailySeries;

    }



    // D3 functions


    function drawBasicCharts(dailySeries, tempVolumes){






//sample D3 array
dailySeries.reverse();

var dataset = dailySeries.slice(0, 30);








//specify width and height
var w = 600;
var h = 200;



//define scales
var scaleX = d3v3.scale.linear()
    .domain([0, d3.max(dataset, function(dataset) { return dataset.dateString; })])
    .range([0, h]);//set output range from 0 to height of svg
var scaleY = d3v3.scale.linear()
    .domain([0, d3.max(dataset, function(dataset) { return dataset.volume; })])
    .range([0, w]);//set output range from 0 to width of svg



//add option for padding within the barchart
var padding = 3;
    
/**
 * build a bar chart with labels - 4 (use existing width, height, padding, dataset...)
 */
  
//create svg4 and add to the DOM
var svg4 = d3.select('#test-container4').append('svg').attr('width', w).attr('height', h);

var xScale = d3v3.scale.ordinal()
    .domain(d3.range(tempVolumes.length))
    .rangeRoundBands([0, w], 0.1);

var bars = svg4.selectAll("rect").data(dataset);
    

    bars.enter()
    .append('rect')
    .attr('x', function(d, i) {
        return i * (w / dataset.length); //works well for basic charts but D3 scales are better
    })
    .attr('y', function (d) {
        return h - (d.volume / 250000);//set top of each bar relative to svg top left - get height minus the data value and then grow bar chart down with height
    })
    .attr('width', w / dataset.length - padding)//get width relative to size of data and svg width - padding
    .attr('height', function (d) {
        return d.volume;
    })
    .attr('fill', function (d) {
    return 'rgb(0, ' + (d.volume / 200000) + ', ' + (d.volume / 300000) + ')';//colour is set relative to data per bar
    })
    //add highlight on mouseenter



    .on("mouseenter", function(d, i) {




            d3.select(this)
            .attr("class", "highlight")
            .append("div")
            .attr("class", "mytooltip")
;






            d3.select("#tip")
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY + "px")
            .text("No. " + (d.dateString) + " Volume: " + d.volume);
        

            d3.select("#tip")
            .select("#value")
            .text(d + " commits");
    
            d3.select("#tip").classed("hidden", false);





            
    })
    //remove highlight class on mouseleave              
    .on("mouseleave", function(d) {
        d3.select(this)
        .attr("class", null);
        d3.select("#tip").classed("hidden", true);
    }) 
    ;


    var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text("a simple tooltip");



       






//output text   
function outputText(text, container) {
    d3.select(container + " h5").remove();
    d3.select(container).append("h5").text(text); 
}



 outputText("Volume per day", ".svg4");


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
