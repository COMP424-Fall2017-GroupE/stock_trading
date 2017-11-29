function getQuotes() {
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

    function getDataNew() {

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
        ticker = $(".get-data input").val().toUpperCase();
        let $historyData = $("<p>");
        if (ticker !== "") {
            // fetch quote
            fetchData(ticker).then(response => {
                historyData = response;
                // render quote
                $(".render-data").empty().append($quote.html(`The current price of ${ticker} is $${quote}`));

                // update chart source
                let src = `https://s.tradingview.com/widgetembed/?symbol=${ticker}&amp;interval=D&amp;symboledit=1&amp;saveimage=1&amp;toolbarbg=f1f3f6&amp;studies=%5B%5D&amp;hideideas=1&amp;theme=Light&amp;style=1&amp;timezone=Etc%2FUTC&amp;studies_overrides=%7B%7D&amp;overrides=%7B%7D&amp;enabled_features=%5B%5D&amp;disabled_features=%5B%5D&amp;locale=en&amp;utm_source=localhost&amp;utm_medium=widget&amp;utm_campaign=chart&amp;utm_term=${ticker}`;
                $("iframe").attr("src", src);
                // chart.show();
            }, error => {
                $(".render-data").empty().append($historyData.html(error));
            });
        } else {
            $(".render-data").empty().append($historyData.html("Please enter ticker symbol"));
        }
    }


           // This is a function to walk through a json object
    function walkAndDraw(obj) {
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
          dailySeries[newMember].volume = volume; // add a volue property

          i++; // increment the index

        // walk(val);   // recursive call
        }
      }
      console.log(dailySeries);


//sample D3 array
var data = dailySeries;


//set title
d3.select('#test-container3').append('h5').text('Basic - add array value to element (with colour)');    
//output array value instead of dummy text
d3.select('#test-container3').selectAll('p').data(data).enter().append('p').text(function(d) { return d.volume; });

 //set title
d3.select('#test-container4').append('h5').text('Basic - add key & value to element');  
//output array value instead of dummy text
d3.select('#test-container4').selectAll('p').data(data).enter().append('p').text(function(d, i) { return 'key = '+ i + ', value = ' + d.volume; });
    
//bind css style to elements
d3.select('#test-container3').selectAll('p').style('color', 'blue');
    
//bind css style to even or numbers from array
d3.select('#test-container3').selectAll('p')
    .data(data)
    .style('color', function(d) {
        if (d.volume % 2 == 0) {
            return 'green';
        } else {
            return 'blue';
        }
    });





      return dailySeries;
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


    function fetchData(ticker) {
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
                        walkAndDraw(json["Time Series (Daily)"]); 




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
        $(".get-data button").on("click", function (e) {
        getDataNew();
    });

    $(".get-data input").on("keypress", function (e) {
        if (e.keyCode === 13) {
            getDataNew();
        }
    });


}

$(document).ready(getQuotes);