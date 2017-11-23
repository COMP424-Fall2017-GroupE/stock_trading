var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var app = express();
var bodyParser = require('body-parser');

// start the server
app.use(express.static(__dirname + "/../src/"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
http.createServer(app).listen(3030);

// establish database connection

// var uri = "mongodb://afedorov:jwlupKsfzMXX6XNt@stocktrading-shard-00-00-reaq6.mongodb.net:27017,stocktrading-shard-00-01-reaq6.mongodb.net:27017,stocktrading-shard-00-02-reaq6.mongodb.net:27017/test?ssl=true&replicaSet=StockTrading-shard-0&authSource=admin";
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/stocktrading', {
    useMongoClient: true
});

var stockSchema = new mongoose.Schema({
    "Ticker": String,
    "Amount": Number
});

var Stock = mongoose.model("Stock", stockSchema);

app.post("/resources", function (req, res) {
    var myData = new Stock({
        "Ticker": req.body.Ticker,
        "Amount": req.body.Amount
    });
    console.log(myData);
    myData.save(function (error, result) {
        if (error !== null) {
            console.log(error);
            res.send("error reported");
        } else {
            console.log("item saved to database");
            res.send("item saved to database");
        }
    });
});

app.get("/stocks.json", function (req, res) {
    Stock.find({}, function (error, stocks) {
        res.json(stocks);
    });
});


app.get("/", function (req, res) {
    res.send("Hello World");
});
