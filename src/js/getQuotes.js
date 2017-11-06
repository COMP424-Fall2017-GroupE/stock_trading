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

                        // update chart source
                        let src = `https://s.tradingview.com/widgetembed/?symbol=${ticker}&amp;interval=D&amp;symboledit=1&amp;saveimage=1&amp;toolbarbg=f1f3f6&amp;studies=%5B%5D&amp;hideideas=1&amp;theme=Light&amp;style=1&amp;timezone=Etc%2FUTC&amp;studies_overrides=%7B%7D&amp;overrides=%7B%7D&amp;enabled_features=%5B%5D&amp;disabled_features=%5B%5D&amp;locale=en&amp;utm_source=localhost&amp;utm_medium=widget&amp;utm_campaign=chart&amp;utm_term=${ticker}`;
                        $("iframe").attr("src", src);
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
