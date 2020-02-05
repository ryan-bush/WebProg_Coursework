const express = require('express');
const app = express();
const path = require('path');
const viewFolder = "/app/";
const port = 8080;

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + viewFolder + 'index.html'));
});

app.use(express.static('app'));

app.listen(port);