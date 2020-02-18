const express = require('express');
const app = express();
const path = require('path');
const viewFolder = "/app/";
const port = 8080;

app.use(express.static('app', { extensions: ['html']}));

app.get('/new', function (req, res) {
    res.send('Hello World!')
});

app.listen(port);