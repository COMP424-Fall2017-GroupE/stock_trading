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

// define mongoose models
var Stock = mongoose.model("Stock", stockSchema);
var Portfolio = mongoose.model("Portfolio", portfolioSchema);

// post endpoint
app.post("/resources", function (req, res) {
    var myData = new Portfolio({
        "UserID": req.body.UserID,
        "Money": req.body.Money,
        "Stocks": req.body.Stocks
    });
    myData.save(function (error, result) {
        if (error !== null) {
            console.log(error);
            res.send("error reported");
        } else {
            res.send("item saved to database");
        }
    });
});

// get endpoint
app.get("/portfolio.json", function (req, res) {
    Portfolio.find({UserID: 1}, function (error, portfolio) {
        if (error !== null) {
            console.log(error);
            res.send("error reported");
        } else {
            res.json(portfolio);
        }
    });
});
