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

// var uri = "mongodb://afedorov:jwlupKsfzMXX6XNt@stocktrading-shard-00-00-reaq6.mongodb.net:27017,stocktrading-shard-00-01-reaq6.mongodb.net:27017,stocktrading-shard-00-02-reaq6.mongodb.net:27017/test?ssl=true&replicaSet=StockTrading-shard-0&authSource=admin";
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/stocktrading', {useMongoClient: true})
    .catch(function (connError) {
        console.log(connError.name);
        console.log(connError.message);
        process.exit();
    });

// define mongoose schemas
var stockSchema = new mongoose.Schema({
    "Ticker": String,
    "Quantity": Number
});

var portfolioSchema = new mongoose.Schema({
    "UserID": Number,
    "Money": Number,
    "Stocks": [
        stockSchema
    ]
});

var transactionSchema = new mongoose.Schema({
    "UserID": Number,
    "Date": Date,
    "Number": Number,
    "Type": String,
    "Symbol": String,
    "Quantity": Number,
    "Price": Number,
    "Sum": Number
});

// define mongoose models
var Stock = mongoose.model("Stock", stockSchema);
var Portfolio = mongoose.model("Portfolio", portfolioSchema);
var Transaction = mongoose.model("Transaction", transactionSchema);

// post endpoint to save a transaction
app.post("/transaction", function (req, res) {
    var myData = new Transaction({
        "UserID": req.body.UserID,
        "Date": req.body.Date,
        "Number": req.body.Number,
        "Type": req.body.Type,
        "Symbol": req.body.Symbol,
        "Quantity": req.body.Quantity,
        "Price": req.body.Price,
        "Sum": req.body.Sum
    });
    myData.save(function (error, result) {
        if (error !== null) {
            console.log(error);
            res.send("error reported");
        } else {
            res.send("transaction saved to database");
        }
    });
});

// post endpoint to update a portfolio
app.post("/portfolio", function (req, res) {
    Portfolio.findOneAndUpdate(
        {UserID: req.body.UserID},

        {
            $set: {
                Money: req.body.Money,
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


// // post endpoint to save a portfolio
// app.post("/portfolio", function (req, res) {
//     var myData = new Portfolio({
//         "UserID": req.body.UserID,
//         "Money": req.body.Money,
//         "Stocks": req.body.Stocks
//     });
//     myData.save(function (error, result) {
//         if (error !== null) {
//             console.log(error);
//             res.send("error reported");
//         } else {
//             res.send("portfolio saved to database");
//         }
//     });
// });

// get endpoint
app.get("/portfolio.json", function (req, res) {
    Portfolio.findOne({UserID: 1}, function (error, portfolio) {
        if (error !== null) {
            console.log(error);
            res.send("error reported");
        } else {
            res.json(portfolio);
        }
    });
});
