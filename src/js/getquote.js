function getQuotes() {
    "use strict";
    let ticker;
    let quote;
    let quantity;
    let dealSum;

    // let $chart = $(".chart");

    function getQuote() {
        ticker = $(".get-quote input").val();
        if (ticker !== "") {
            // fetch quote
            let url = `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20("${ticker}")&format=json&env=store://datatables.org/alltableswithkeys&callback=`;
            let $quote = $("<p>");

            $.getJSON(url, function (data) {
                if (data.query.results.quote.Ask !== null) {
                    quote = data.query.results.quote.Ask;
                    $quote.html(`Current price of ${ticker}: ${quote}`);
                }
                else {
                    alert(`${ticker} ticker symbol not found`);
                }
            });

            // render quote
            $(".render-quote").empty().append($quote);

            // render chart
            // $(".chart").append("<div>", new TradingView.widget({
            //         "width": 500,
            //         "height": 300,
            //         "symbol": ticker,
            //         "interval": "D",
            //         "timezone": "Etc/UTC",
            //         "theme": "Light",
            //         "style": "1",
            //         "locale": "en",
            //         "toolbar_bg": "#f1f3f6",
            //         "enable_publishing": false,
            //         "allow_symbol_change": true,
            //         "hideideas": true
            //     }));

        } else {
            alert("Please enter ticker symbol");
        }
    }

    function trade() {
        quantity = $(".trade input[name='quantity']").val();
        if (quote > 0) {
            if (quantity > 0) {
                let $trade = $("<p>");
                switch ($("input:checked").val()) {
                    case "buy":
                        dealSum = (-quantity * quote).toFixed(2);
                        $trade.html(`You bought ${quantity} ${ticker} stocks @ $${quote} and spent $${dealSum}`);
                        $(".history").append($trade);
                        break;
                    case "sell":
                        dealSum = (quantity * quote).toFixed(2);
                        $trade.html(`You sold ${quantity} ${ticker} stocks @ $${quote} and received $${dealSum}`);
                        $(".history").append($trade);
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

