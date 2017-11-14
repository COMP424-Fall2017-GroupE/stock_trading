var express = require('express');
var http = require('http');
var app = express();
http.createServer(app).listen(3030);

let uri = "mongodb://afedorov:jwlupKsfzMXX6XNt@stocktrading-shard-00-00-reaq6.mongodb.net:27017,stocktrading-shard-00-01-reaq6.mongodb.net:27017,stocktrading-shard-00-02-reaq6.mongodb.net:27017/test?ssl=true&replicaSet=StockTrading-shard-0&authSource=admin";

let mongoose = require('mongoose');

var promise = mongoose.createConnection(uri, {
    useMongoClient: true
    /* other options */
});

promise.on('open', function () {
    app.get("/", function (req, res) {
        res.send("connected");
    });
});

// mongodb connection
function databaseConn() {
    var MongoClient = require('mongodb');
    let uri = "mongodb://afedorov:jwlupKsfzMXX6XNt@stocktrading-shard-00-00-reaq6.mongodb.net:27017,stocktrading-shard-00-01-reaq6.mongodb.net:27017,stocktrading-shard-00-02-reaq6.mongodb.net:27017/test?ssl=true&replicaSet=StockTrading-shard-0&authSource=admin";

    let mongoose = require('mongoose');
    var promise = mongoose.createConnection(uri, {
        useMongoClient: true
        /* other options */
    });

    promise.on('open', function () {
        return true;
    });

    // MongoClient.connect(uri, function(err, db) {
    //     db.close();
    //     return false;
    // }).done(function () {
    //     return true;
    // });

}
