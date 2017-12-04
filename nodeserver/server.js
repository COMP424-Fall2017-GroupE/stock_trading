/*
 * Main application server-side code
 * Author: @aafedorov
 */

var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var app = express();
var bodyParser = require('body-parser');

// start the server
app.use(express.static(__dirname + "/../src/"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
http.createServer(app).listen(3030);

// establish database connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/stocktrading', {useMongoClient: true})
    .catch(function (connError) {
        console.log(connError.name);
        console.log(connError.message);
        process.exit();
    });

// define mongoose schemas
// a stock
var stockSchema = new mongoose.Schema({
    "Ticker": String,
    "Quantity": Number
});

// a user portfolio
var portfolioSchema = new mongoose.Schema({
    "UserID": Number,
    "Money": Number,
    "InitialValue": Number,
    "CurrentValue": Number,
    "Stocks": [
        stockSchema
    ]
});

// a transaction
var transactionSchema = new mongoose.Schema({
    "Date": Date,
    "Number": Number,
    "Type": String,
    "Symbol": String,
    "Quantity": Number,
    "Price": Number,
    "Sum": Number
});

// a user list of transactions
var transactionListSchema = new mongoose.Schema({
    "UserID": Number,
    "Transactions": [
        transactionSchema
    ]
});

// define mongoose models
var Stock = mongoose.model("Stock", stockSchema);
var Portfolio = mongoose.model("Portfolio", portfolioSchema);
var Transaction = mongoose.model("Transaction", transactionSchema);
var TransactionList = mongoose.model("TransactionList", transactionListSchema);

// post end point to update a transaction list
app.post("/transactionListUpdate", function (req, res) {
    TransactionList.findOneAndUpdate(
        {UserID: req.body.UserID},

        {
            $push: {
                Transactions: req.body.Transaction
            }
        },

        {returnOriginal: false},

        function (error, result) {
            if (error !== null) {
                console.log(error);
                res.send("error reported");
            } else {
                res.send("TransactionList successfully updated");
            }
        });
});

// post end point to save an initial transaction list
app.post("/transactionList", function (req, res) {
    var myData = new TransactionList({
        "UserID": req.body.UserID,
        "Transactions": req.body.Transactions
    });
    myData.save(function (error, result) {
        if (error !== null) {
            console.log(error);
            res.send("error reported");
        } else {
            res.send("new TransactionList saved to database");
        }
    });
});

// post end point to update a portfolio
app.post("/portfolioUpdate", function (req, res) {
    Portfolio.findOneAndUpdate(
        {UserID: req.body.UserID},

        {
            $set: {
                Money: req.body.Money,
                CurrentValue: req.body.CurrentValue,
                Stocks: req.body.Stocks
            }
        },

        {returnOriginal: false},

        function (error, result) {
            if (error !== null) {
                console.log(error);
                res.send("error reported");
            } else {
                res.send("portfolio successfully updated");
            }
        });
});


// post end point to save a new portfolio
app.post("/portfolio", function (req, res) {
    var myData = new Portfolio({
        "UserID": req.body.UserID,
        "Money": req.body.Money,
        "InitialValue": req.body.InitialValue,
        "CurrentValue": req.body.CurrentValue,
        "Stocks": req.body.Stocks
    });
    myData.save(function (error, result) {
        if (error !== null) {
            console.log(error);
            res.send("error reported");
        } else {
            res.send("new portfolio saved to database");
        }
    });
});

// get end point to get a portfolio from the database
app.get("/portfolio.json", function (req, res) {
    Portfolio.findOne({UserID: req.query.UserID}, function (error, portfolio) {
        if (error !== null) {
            console.log(error);
            res.send("error reported");
        } else {
            res.json(portfolio);
        }
    });
});

// get end point to get a list of transactions of a particular user from the database
app.get("/transactions.json", function (req, res) {
    TransactionList.findOne({UserID: req.query.UserID}, function (error, transactions) {
        if (error !== null) {
            console.log(error);
            res.send("error reported");
        } else {
            res.json(transactions.Transactions);
        }
    });
});
