function getQuotes() {
    "use strict";
    let ticker;
    let quote;
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

    // implementation of fetching and rendering quotes, updating chart
    function getQuote() {
        ticker = $(".get-quote input").val().toUpperCase();
        let $quote = $("<p>");
        if (ticker !== "") {
            // fetch quote
            fetchQuote(ticker).then(response => {
                quote = response;
                // render quote
                $(".render-quote").empty().append($quote.html(`The current price of ${ticker} is $${quote}`));

                // update chart source
                let src = `https://s.tradingview.com/widgetembed/?symbol=${ticker}&amp;interval=D&amp;symboledit=1&amp;saveimage=1&amp;toolbarbg=f1f3f6&amp;studies=%5B%5D&amp;hideideas=1&amp;theme=Light&amp;style=1&amp;timezone=Etc%2FUTC&amp;studies_overrides=%7B%7D&amp;overrides=%7B%7D&amp;enabled_features=%5B%5D&amp;disabled_features=%5B%5D&amp;locale=en&amp;utm_source=localhost&amp;utm_medium=widget&amp;utm_campaign=chart&amp;utm_term=${ticker}`;
                $("iframe").attr("src", src);
                // chart.show();
            }, error => {
                $(".render-quote").empty().append($quote.html(error));
            });
        } else {
            $(".render-quote").empty().append($quote.html("Please enter ticker symbol"));
        }
    }












               function getData() {
        ticker = $(".get-data input").val();
        if (ticker !== "") {
            // fetch quote

            let url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&interval=60min&outputsize=compact&apikey=${apiKey}`;
            let $quote = $("<p>");





            // parse JSON
            $.getJSON(url)
                .done(function (json) {
                    if (typeof json !== 'undefined' && typeof json !== 'null' && !json["Error Message"]) {



                                        var dailySeries = []; // create a new json object to hold the data
                                        





                                          // This is a function to walk through a json object
                                          function walk(obj) {

                                          var i = 0;


                                            for (var key in obj) {
                                              if (obj.hasOwnProperty(key)) {


                               //                   console.log(key);                                            

                                                 var val = obj[key]; // the objects contents

                                                 var volume = obj[key]["5. volume"]; // the objects volume

                                                 var dateString = key;  // to add the date as a string to the new object

                                                 var newMember = i;  // call each day a member of our daily series

                               //                   console.log(val);
                               //                 dailySeries[newMember] = val; //  add the data with date as key
                                                dailySeries[newMember] = { key } ; //  add the data with a number as key
                                                dailySeries[newMember].dateString = key; // add a dateString property and set the value to the date
                                                dailySeries[newMember].volume = volume; // add a volue property

                                                i++; // increment the index

                                              // walk(val);   // recursive call
                                              }
                                            }


draw(dailySeries);

                                          }












                        


                        // find necessary quote
                      let key = json["Meta Data"]["3. Last Refreshed"];
                      let date = key.substr(0,key.indexOf(' ')); // only the Day is used in this object, cut off the time
                      let dailyQuote = json["Time Series (Daily)"][date];


                                        walk(json["Time Series (Daily)"]);
                                        console.log(dailySeries);

                                      //  draw(dailySeries);
// dataset1[0].video_views


 function draw(obj) {

var i = 0;

     for (var dataMember in obj) {

   //   console.log(dataMember + " " + dataMember[key]);




      console.log(i + "   " + dailySeries[i].volume + "    " + dailySeries[i].dateString);
      i++;








    }

    

var data = dailySeries;

// function (d) {
// return (d.width);
// }

// checkd3(dailySeries);


 //set title
d3.select('#test-container').append('h5').text('Basic - add text');
//page elements - add a 'p' element and text
d3.select('#test-container').append('p').text('some sample text...');
    
//sample D3 array
var data = dailySeries;


    
 //set title
d3.select('#test-container2').append('h5').text('Basic - add element'); 
//create a 'p' element for each value in the array
d3.select('#test-container2').selectAll('p').data(data).enter().append('p').text('p element...');

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



  
}








                        quote = dailySeries[0].volume;
                        // render quote
                        $quote.html(` ${ticker} Historical Stock Information  volume is ${quote}`);
                        $(".render-data").empty().append($quote);

                        console.log(key);
                        console.log(date);
                        console.log(dailyQuote);





                    }
                    else {
                        alert(`${ticker} ticker symbol not found`);
                    }
                })
                .fail(function () {
                    alert(`Failed to fetch ${ticker} data`);
                });
        } else {
            alert("Please enter ticker symbol");
        }
    

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

    // implementation of buying / selling stocks
    function trade() {
        quantity = $(".get-quote input[name='quantity']").val();
        if (Number(quote) > 0) {
            if (Number(quantity) > 0) {
                switch ($("input:checked").val()) {
                    case "Buy":
                        dealSum = (-quantity * quote).toFixed(2);
                        storeTransaction().then(response => {
                            trnumber++;
                            appendHistory();
                        }, error => {
                            alert(`an error while storing a transaction has been encountered: ${error}`);
                        });
                        break;

                    case "Sell":
                        dealSum = (quantity * quote).toFixed(2);
                        quantity = -quantity;
                        storeTransaction().then(response => {
                            trnumber++;
                            appendHistory();
                        }, error => {
                            alert(`an error while storing a transaction has been encountered: ${error}`);
                        });
                        break;

                    default:
                        alert("Please select an option");
                        break;
                }
            } else {
                alert("Please enter quantity which is greater than 0");
            }
        } else {
            alert("Please get a quote first");
        }
    }

    // helper function to store transaction and update user's portfolio
    function storeTransaction() {
        return new Promise((resolve, reject) => {
            // create a promise for user's portfolio
            getPortfolio().then(response => {
                portfolio = response;
                // check if there is a stock in the portfolio
                let found = false;
                let index;
                portfolio.Stocks.forEach(function (item, i) {
                    if (item.Ticker === ticker) {
                        found = true;
                        index = i;
                    }
                });

                // append portfolio with 0 stocks if needed
                if (!found) {
                    portfolio.Stocks.push(
                        {
                            "Ticker": ticker,
                            "Quantity": 0
                        }
                    );
                    index = portfolio.Stocks.length - 1;
                }

                // check if there is sufficient money / stock and update transactions and portfolio
                if ((portfolio.Money + Number(dealSum)) >= 0) {
                    if ((portfolio.Stocks[index].Quantity + Number(quantity) >= 0)) {
                        transaction =
                            {
                                "UserID": userID,
                                "Date": new Date(),
                                "Number": trnumber,
                                "Type": $("input:checked").val(),
                                "Symbol": ticker,
                                "Quantity": quantity,
                                "Price": quote,
                                "Sum": dealSum
                            };
                        portfolio.Money += Number(dealSum);
                        portfolio.Stocks[index].Quantity += Number(quantity);

                        // save new transaction to the database
                        $.post("/transaction", transaction, function (response) {
                            console.log(`server post response returned... ${response.toString()}`);
                        });
                        // save new portfolio to the database
                        $.post("/portfolio", portfolio, function (response) {
                            console.log(`server post response returned... ${response.toString()}`);
                        });
                        // update UI
                        displayPortfolio(portfolio);
                        resolve();
                    }
                    else {
                        reject("Insufficient stocks");
                    }
                }
                else {
                    reject("Insufficient money");
                }
            }, error => {
                reject(`Unable to get user portfolio: ${error.toString()}`);
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

    // display transactions history
    function appendHistory() {
        let $tr = $("<tr>");
        let $td = [];
        if (transaction !== {}) {
            let date = `${transaction.Date.getMonth()}/${transaction.Date.getDate()}/${transaction.Date.getFullYear()}`;
            $td.push($("<td>").html(date));
            $td.push($("<td>").html(transaction.Type));
            $td.push($("<td>").html(transaction.Symbol));
            $td.push($("<td>").html(Math.abs(transaction.Quantity)));
            $td.push($("<td>").html(transaction.Price));
            $td.push($("<td>").html(transaction.Sum));

            $td.forEach(function (item) {
                $tr.append(item);
            });

            $("#transactionsHistory tbody").append($tr);
        }
    }


    //handle user events
    $(".get-quote button[name='get-quote-btn']").on("click", function (e) {
        getQuote();
    });

    $(".get-quote input[name='ticker']").on("keypress", function (e) {
        if (e.keyCode === 13) {
            getQuote();
        }
    });

    $(".get-quote button[name='trade-btn']").on("click", function (e) {
        trade();
    });

    $(".get-quote input[name='quantity']").on("keypress", function (e) {
        if (e.keyCode === 13) {
            trade();
        }
    });

        $(".get-data button").on("click", function (e) {
        getData();
    });

    $(".get-data input").on("keypress", function (e) {
        if (e.keyCode === 13) {
            getData();
        }
    });


}

$(document).ready(getQuotes);
