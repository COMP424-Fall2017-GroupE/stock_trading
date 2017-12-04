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





    function getShapeData() {

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
        ticker = $(".get-shape input").val().toUpperCase();
        let $historyData = $("<p>");
        if (ticker !== "") {
            // fetch data
            fetchShapeData(ticker).then(response => {
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
          dailySeries[newMember].volume = volume; // add a volume property
          dailySeries[newMember].unixDate = new Date(key).getTime() / 1000; // add a unix timestamp

          i++; // increment the index

        // walk(val);   // recursive call
        }
      }






      // call draw with data
      drawBasicShapes(dailySeries)
      return dailySeries;

    }



    // D3 functions


    function drawBasicShapes(dailySeries){

//sample D3 array
var data = dailySeries.slice(0, 10);

//set title
d3.select('#test-container').append('h5').text('Basic drawing - add text'); 
//append p element, add some text, and set css class with attr
d3.select('#test-container').append('p').text('genius is 1% inspiration, 99% perspiration').attr('class', 'text');
    
//set title 2
d3.select('#test-container2').append('h5').text('Basic drawing - add circles');
//create svg variable for #test2 - acts as a reference to the svg object
var svg = d3.select('#test-container2').append('svg');
//width and height
var w = 1250;
var h = 300;

//set width and height for svg
svg.attr('width', w).attr('height', h);
//create some test circles from data
var circles = svg.selectAll('circle').data(data).enter().append('circle');

//set positions and sizes for circles
circles.attr('cx', function(d, i) {//in svg, cx is the x position value of the centre of the circle
    return (i * 50) + 25;//i is the numeric index value from the data loop
}).attr('cy', h/2)//cy is the y position value in the centre of the circle
   .attr('r', function (d) {//r is the radius of the circle
        return d.volume/1000000;
    });

//add some colour to the circles...
circles.attr('fill', 'navy')
        .attr('stroke', 'pink')
        .attr('stroke-width', function (d) {
            d.volume = d.volume/1000000
            return d.volume/2;
        });
        
//set title 3
d3.select('#test-container3').append('h5').text('Basic drawing - add rectangles');
//create svg variable for #test2 - acts as a reference to the svg object
var svg2 = d3.select('#test-container3').append('svg');
//width and height
var w = 1250;
var h = 300;

//set width and height for svg
svg2.attr('width', w).attr('height', h);
//create some test rectangles from data
var rects = svg2.selectAll('rect').data(data).enter().append('rect');

//set positions and sizes for rectangles
rects.attr('x', function(d, i) {
        return (i * 50) + 35;
        })
        .attr ('y',  h/2)
        .attr('width', 20
        
        )
        .attr('height', 40
        
        );

//add some colour to the circles...
rects.attr('fill', 'navy')
        .attr('stroke', 'pink')
        .attr('stroke-width', function (d) {
            return d.volume/3;
        });




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




    function fetchShapeData(ticker) {
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

        $(".get-shape button").on("click", function (e) {
        getShapeData();
    });

    $(".get-shape input").on("keypress", function (e) {
        if (e.keyCode === 13) {
            getShapeData();
        }
    });


}

$(document).ready(getHistoricalData);
