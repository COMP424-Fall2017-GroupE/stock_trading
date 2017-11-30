/*
 * Displaying user's transaction history on a separate page
 * Author: @aafedorov
 */

"use strict";
const currentUserID = 1;
const spinner = $(".spinner img");

function transactionsHistory(userID) {
    getTransactions(userID).then(response => {
        let transactions = response;
        transactions.forEach(function (item) {
            appendHistory(item);
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

// display / append transactions history
function appendHistory(transaction) {
    let $tr = $("<tr>");
    let $td = [];
    if (transaction !== {}) {
        let parsedDate = new Date(Date.parse(transaction.Date));
        let date = `${parsedDate.toLocaleDateString('en-US')}`;
        let time = `${parsedDate.toLocaleTimeString('en-US')}`;
        $td.push($("<td>").html(date));
        $td.push($("<td>").html(time));
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

$(document).ready(transactionsHistory(currentUserID));
