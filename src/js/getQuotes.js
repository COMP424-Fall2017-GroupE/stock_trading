function getQuotes() {
    "use strict";
    let ticker;
    let quote;
    let quantity;
    let dealSum;
    let apiKey = "38HEIOY4TO9U5D4S";
    let trnumber = 0;
    let transactions = [];
    let portfolio = {
        Money: 10000,
        Stocks: []
    };

    // implementation of fetching and rendering quotes, updating chart
    function getQuote() {
        ticker = $(".get-quote input").val();
        if (ticker !== "") {
            // fetch quote
            let url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=60min&outputsize=compact&apikey=${apiKey}`;
            let $quote = $("<p>");



            // parse JSON
            $.getJSON(url)
                .done(function (json) {
                    if (typeof json !== 'undefined' && typeof json !== 'null' && !json["Error Message"]) {



                        // find necessary quote
                        let key = json["Meta Data"]["3. Last Refreshed"];
                        quote = json["Time Series (60min)"][key]["4. close"];

                        // render quote
                        $quote.html(`The current price of ${ticker} is $${quote}`);
                        $(".render-quote").empty().append($quote);

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


        function getData() {
        ticker = $(".get-data input").val();
        if (ticker !== "") {
            // fetch quote

            let url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&interval=60min&outputsize=full&apikey=${apiKey}`;
            let $quote = $("<p>");





            // parse JSON
            $.getJSON(url)
                .done(function (json) {
                    if (typeof json !== 'undefined' && typeof json !== 'null' && !json["Error Message"]) {



                                        var dailySeries = { members: {} }; // create a new json object to hold the data
                                        


                                          var i = 0;

                                          // This is a function to walk through a json object
                                          function walk(obj) {
                                            for (var key in obj) {
                                              if (obj.hasOwnProperty(key)) {
                                                 var val = obj[key];

                                               

                                                 var newMember = "member" + i;  // call each day a member of our daily series
                                                 var newValue = val;



                                                dailySeries.members[newMember] = newValue; //  add a each object in the returned json to our dailySerious object
                                        


 

                                                i++
                                               // console.log(val);
                                               // walk(val);   // recursive call
                                              }
                                            }
                                          }


                                 //         walk(json);
                        


                        // find necessary quote
                      let key = json["Meta Data"]["3. Last Refreshed"];
                      let date = key.substr(0,key.indexOf(' ')); // only the Day is used in this object, cut off the time
                      let dailyQuote = json["Time Series (Daily)"][date];


                                        walk(json["Time Series (Daily)"]);
                                        console.log(dailySeries);
                        




                        // render quote
                        $quote.html(`The current price of ${ticker} is $${quote}`);
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

    // implementation of buying / selling stocks
    function trade() {
        quantity = $(".trade input[name='quantity']").val();
        if (Number(quote) > 0) {
            if (Number(quantity) > 0) {
                let $trade = $("<p>");
                switch ($("input:checked").val()) {
                    case "buy":
                        dealSum = (-quantity * quote).toFixed(2);
                        if (storeTransaction()) {
                            trnumber++;
                            $trade.html(`You bought ${quantity} ${ticker} stocks @ $${quote} and spent $${dealSum}`);
                            $(".history").append($trade);
                        }
                        break;
                    case "sell":
                        dealSum = (quantity * quote).toFixed(2);
                        quantity = -quantity;
                        if (storeTransaction()) {
                            trnumber++;
                            $trade.html(`You sold ${quantity} ${ticker} stocks @ $${quote} and received $${dealSum}`);
                            $(".history").append($trade);
                        }
                        break;
                    default:
                        alert("Please select an option");
                }
            } else {
                alert("Please enter quantity which is greater than 0");
            }
        } else {
            alert("Please get a quote first");
        }
    }

    // helper function to store transaction into memory and update user's portfolio
    function storeTransaction() {
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
                    Ticker: ticker,
                    Quantity: 0
                }
            );
            index = portfolio.Stocks.length - 1;
        }

        // check if there is sufficient money / stock and update transactions and portfolio
        if ((portfolio.Money + Number(dealSum)) >= 0) {
            if ((portfolio.Stocks[index].Quantity + Number(quantity) >= 0)) {
                transactions.push(
                    {
                        Number: trnumber,
                        Type: $("input:checked").val(),
                        Symbol: ticker,
                        Quantity: quantity,
                        Price: quote,
                        Sum: dealSum
                    }
                );
                portfolio.Money += Number(dealSum);
                portfolio.Stocks[index].Quantity += Number(quantity);
                return true;
            }
            else {
                alert("Insufficient stocks");
                return false;
            }
        }
        else {
            alert("Insufficient money");
            return false;
        }
    }

    //handle user events
    $(".get-quote button").on("click", function (e) {
        getQuote();
    });

    $(".get-quote input").on("keypress", function (e) {
        if (e.keyCode === 13) {
            getQuote();
        }
    });

        //handle user events
    $(".get-data button").on("click", function (e) {
        getData();
    });

    $(".get-data input").on("keypress", function (e) {
        if (e.keyCode === 13) {
            getData();
        }
    });

    $(".trade button").on("click", function (e) {
        trade();
    });

    $(".trade input[name='quantity']").on("keypress", function (e) {
        if (e.keyCode === 13) {
            trade();
        }
    });
}

$(document).ready(getQuotes);
