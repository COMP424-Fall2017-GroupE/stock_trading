function getQuotes() {
    "use strict";
    let ticker;
    let quote;
    let quantity;
    let dealSum;
    let apiKey = "38HEIOY4TO9U5D4S";

    // let $chart = $(".chart");

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
                        let key = json["Meta Data"]["3. Last Refreshed"];
                        quote = json["Time Series (60min)"][key]["4. close"];
                        $quote.html(`The current price of ${ticker} is $${quote}`);
                    }
                    else {
                        alert(`${ticker} ticker symbol not found`);
                    }
                })
                .fail(function () {
                    alert(`Failed to fetch ${ticker} data`);
                });

            // render quote
            $(".render-quote").empty().append($quote);

            // update chart source
            let chart_div = document.getElementsByTagName("div");
            let new_chart =
                `<iframe id="tradingview_7a914"
                            src="https://s.tradingview.com/widgetembed/?symbol=${ticker}&amp;interval=D&amp;symboledit=1&amp;saveimage=1&amp;toolbarbg=f1f3f6&amp;studies=%5B%5D&amp;hideideas=1&amp;theme=Light&amp;style=1&amp;timezone=Etc%2FUTC&amp;studies_overrides=%7B%7D&amp;overrides=%7B%7D&amp;enabled_features=%5B%5D&amp;disabled_features=%5B%5D&amp;locale=en&amp;utm_source=localhost&amp;utm_medium=widget&amp;utm_campaign=chart&amp;utm_term=${ticker}"
                            width="500" height="300" frameborder="0" allowtransparency="true" scrolling="no"
                            allowfullscreen="">
                </iframe>`;

            chart_div[1].innerHTML = new_chart;

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
