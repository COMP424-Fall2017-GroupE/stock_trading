"use strict";
// change when user management is ready
const currentUserID = 1;
const spinner = $(".spinner img");
const chart = $(".chart");
const apiKey = "38HEIOY4TO9U5D4S";
var currentQuotes = [];


function mainPageLoad() {
    chart.hide();

    getPortfolio(currentUserID).then(response => {
        displayPortfolio(response).then(function () {
            getTransactions(currentUserID).then(response => {
                getQuotes(response.length);
            });
        });
    });
}

// helper function to fetch user's portfolio from the database
function getPortfolio(userID) {
    spinner.show();
    return new Promise((resolve, reject) => {
        $.getJSON("portfolio.json", {UserID: userID})
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
    spinner.show();
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
                    spinner.hide();
                    reject(error);
                });
            } else {
                return;
            }
        });
        spinner.hide();
        resolve();
    });
}

// fetch quotes from memory / from an external API
function fetchQuote(ticker) {
    spinner.show();
    return new Promise((resolve, reject) => {
        // check if this quote has already been fetched and return it immediately
        currentQuotes.forEach(function (item) {
            if (item.Ticker === ticker) {
                spinner.hide();
                resolve(item.Price);
            }
        });

        // if this is the first fetching within the session, query external API
        let url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=60min&outputsize=compact&apikey=${apiKey}`;
        // parse JSON
        $.getJSON(url)
            .done(function (json) {
                if (typeof json !== 'undefined' && typeof json !== 'null' && !json["Error Message"]) {
                    // find necessary quote
                    let key = json["Meta Data"]["3. Last Refreshed"];
                    let quote = Number(json["Time Series (60min)"][key]["4. close"]);
                    currentQuotes.push(
                        {
                            "Ticker": ticker,
                            "Price": quote.toFixed(2)
                        });
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

// helper function to fetch user's transactions from the database
function getTransactions(userID) {
    spinner.show();
    return new Promise((resolve, reject) => {
        $.getJSON("transactions.json", {UserID: userID})
            .done(function (json) {
                spinner.hide();
                resolve(json);
            })
            .fail(function () {
                spinner.hide();
                reject(alert(`Failed to fetch user's transactions`));
            });
    });
}

// helper function to store transaction and update user's portfolio
function storeTransaction(userID, ticker, quantity, quote, trnumber) {
    let dealSum = -(quantity * quote).toFixed(2);
    return new Promise((resolve, reject) => {
        // create a promise for user's portfolio
        let {portfolio} = {};
        getPortfolio(currentUserID).then(response => {
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
                    let transaction =
                        {
                            "UserID": userID,
                            "Transaction": {
                                "Date": new Date(),
                                "Number": trnumber,
                                "Type": $("input:checked").val(),
                                "Symbol": ticker,
                                "Quantity": quantity,
                                "Price": quote,
                                "Sum": dealSum
                            }
                        };
                    portfolio.Money += Number(dealSum);
                    portfolio.Stocks[index].Quantity += Number(quantity);

                    // update transactions list in the database
                    $.post("/transactionListUpdate", transaction, function (response) {
                        console.log(`server post response returned... ${response.toString()}`);
                    });
                    // update portfolio in the database
                    $.post("/portfolioUpdate", portfolio, function (response) {
                        console.log(`server post response returned... ${response.toString()}`);
                    });
                    // update UI
                    displayPortfolio(portfolio);
                    resolve(transaction.Transaction);
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

function getQuotes(tnum) {
    let ticker;
    let quote;
    let trnumber = tnum;

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

    // implementation of buying / selling stocks
    function trade() {
        let quantity = $(".get-quote input[name='quantity']").val();
        if (Number(quote) > 0) {
            if (Number(quantity) > 0) {
                switch ($("input:checked").val()) {
                    case "Buy":
                        break;

                    case "Sell":
                        quantity = -quantity;
                        break;

                    default:
                        alert("Please select an option");
                        break;
                }
                storeTransaction(currentUserID, ticker, quantity, quote, trnumber).then(response => {
                    trnumber++;
                }, error => {
                    alert(`an error while storing a transaction has been encountered: ${error}`);
                });
            } else {
                alert("Please enter quantity which is greater than 0");
            }
        } else {
            alert("Please get a quote first");
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
}

$(document).ready(mainPageLoad());
