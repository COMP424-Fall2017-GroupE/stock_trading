var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var app = express();
var path = require('path');

// mongodb connection uri
var uri = "mongodb://afedorov:jwlupKsfzMXX6XNt@stocktrading-shard-00-00-reaq6.mongodb.net:27017,stocktrading-shard-00-01-reaq6.mongodb.net:27017,stocktrading-shard-00-02-reaq6.mongodb.net:27017/test?ssl=true&replicaSet=StockTrading-shard-0&authSource=admin";

// start the server
http.createServer(app).listen(3030);

// establish database connection
var promise = mongoose.createConnection(uri, {
    useMongoClient: true
    /* other options */
});
promise.on('open', function () {
    app.get("/", function (req, res) {
        res.sendFile(path.join(__dirname + "/../src/dashboard.html"));
    });
});
