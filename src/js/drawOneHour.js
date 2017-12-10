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



        // now get the historical data
        ticker = $(".get-oneHour input").val().toUpperCase();
        let $historyData = $("<p>");
        if (ticker !== "") {
            // fetch data
            fetchData(ticker).then(response => {
                historyData = response;
                
                $(".render-data").empty().append($historyData.html(`The current price of ${ticker} is $${historyData}`));

            }, error => {
                $(".render-data").empty().append($historyData.html(error));
            });
        } else {
            $(".render-data").empty().append($historyData.html("Please enter ticker symbol"));
        }
    }




    // not really adjusting volume 
    function walkAndDrawHourlyPrices(obj) {

      var HourlySeries = []; // create a new array to hold the data
      var i = 0;






      for (var key in obj) {

        if (obj.hasOwnProperty(key)) {
//       console.log(key);

//            console.log(key);                                            

           var val = obj[key]; // the objects contents

           var volume = obj[key]["5. volume"]; // the objects volume
           var close = obj[key]["4. close"]; // the objects closing price
           var open = obj[key]["1. open"]; // the objects closing price

           var dateTimeStamp = key.substr(0,key.indexOf(' '));  // to add the timestamp as a string to the new object
           var minuteTimeStamp = key.substr(key.indexOf(' ')+1);  // to add the timestamp as a string to the new object
           var indexNumber = i;


           var newMember = i;  // call each day a member of our daily series

//            console.log(val);

          HourlySeries[newMember] = {} ; //  add new member as an object
          HourlySeries[newMember].Open = open; // add a timestamp as a string
          HourlySeries[newMember].Close = close; // add a timestamp as a string
          HourlySeries[newMember].Time = key; // add a dateString property and set the value to the date
          HourlySeries[newMember].Volume = volume; // add a volume property
          HourlySeries[newMember].DateString = dateTimeStamp; // add a volume property
          HourlySeries[newMember].MinuteTimeStamp = minuteTimeStamp; // add a volume property
          HourlySeries[newMember].IndexNumber = indexNumber;; // add a volume property

          i++; // increment the index
          if(i>59){
                  console.log(HourlySeries);  
                  drawTable(HourlySeries);

                  drawOneDayLinechart(HourlySeries);
                  return HourlySeries;
          }

        // walk(val);   // recursive call
        }
      }



     // console.log(HourlySeries);






      // call draw with data



    }



    // D3 functions
    function drawTable(hourlySeries){

//sample D3 array
var data = hourlySeries;


var currentSymbol = ticker;

//set title
d3.select('#test-containerTable').append('h5').attr("class", "report").text('Prices per minute for the last hour for ').append('h5').text(currentSymbol);
    


    // function to create a table from http://bl.ocks.org/jfreels/6734025
  function tabulate(data, columns) {
        var table = d3.select('#test-containerTable').append('table')
        var thead = table.append('thead')
        var tbody = table.append('tbody');

        // append the header row
        thead.append('tr')
          .selectAll('th')
          .data(columns).enter()
          .append('th')
            .text(function (column) { return column; });

        // create a row for each object in the data
        var rows = tbody.selectAll('tr')
          .data(data)
          .enter()
          .append('tr');

        // create a cell in each row for each column
        var cells = rows.selectAll('td')
          .data(function (row) {
            return columns.map(function (column) {
              return {column: column, value: row[column]};
            });
          })
          .enter()
          .append('td')
            .text(function (d) { return d.value; });

      return table;
    }

    // render the table(s)
    tabulate(data, ['Time', 'Open', 'Close', 'Volume']); // 4 column table





    }



    function drawOneDayLinechart(hourlySeries) {


        var data = hourlySeries;
        var d = hourlySeries;
        // testing testing 





// begin(d);
drawIt(d);





function drawIt(d){


var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%d-%b-%y");

var x = d3.scaleTime()
    .rangeRound([0, width]);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var line = d3.line()
    .x(function(d) { return x(d.IndexNumber); })
    .y(function(d) { return y(d.Close); });






  x.domain(d3.extent(data, function(d) { return d.IndexNumber; }));
  y.domain(d3.extent(data, function(d) { return d.Close; }));

  g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
    .select(".domain")
      .remove();

  g.append("g")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Price ($)");

  g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);


     };






}

  
















    function fetchQuandlQuote(ticker) {
        spinner.show();
        return new Promise((resolve, reject) => {
            let url = `https://www.quandl.com/api/v3/datasets/WIKI/{ticker}.json?column_index=4&start_date=2014-01-01&end_date=2014-12-31&collapse=monthly&transform=rdiff&api_key=DTB2cz5Mv7AjBu-kTVZv`;
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

    function fetchQuote(ticker) {
        spinner.show();
        return new Promise((resolve, reject) => {
            let url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=1min&outputsize=compact&apikey=${apiKey}`;
            // parse JSON
            $.getJSON(url)
                .done(function (json) {
                    if (typeof json !== 'undefined' && typeof json !== 'null' && !json["Error Message"]) {
                        // find necessary quote
                        let key = json["Meta Data"]["3. Last Refreshed"];
                        let quote = Number(json["Time Series (1min)"][key]["4. close"]);
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


    function fetchData(ticker) {
        spinner.show();
        return new Promise((resolve, reject) => {
            let url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=1min&outputsize=compact&apikey=${apiKey}`;
            // parse JSON
            $.getJSON(url)
                .done(function (json) {
                    if (typeof json !== 'undefined' && typeof json !== 'null' && !json["Error Message"]) {
                        // find necessary data


                     //   console.log(json);

                        let key = json["Meta Data"]["3. Last Refreshed"];
                        let hourly = json["Time Series (1min)"];


                        let quotes = Number(json["Time Series (1min)"][key]["4. close"]);

                    //    console.log(hourly);
                        walkAndDrawHourlyPrices(hourly);

                 //       drawOneDayLinechart();



                   //     let dailyQuote = json["Time Series (Daily)"][date];
                   //     walkAndDrawAdjustedVolume(json["Time Series (Daily)"]); 




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
        $(".get-oneHour button").on("click", function (e) {
        getData();
    });

    $(".get-oneHour input").on("keypress", function (e) {
        if (e.keyCode === 13) {
            getData();
        }
    });



}

$(document).ready(getHistoricalData);
