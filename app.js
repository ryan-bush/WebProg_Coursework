const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const viewFolder = "/app/";
const port = 8080;
const db = require('./server/database');
const FileSaver = require('file-saver');

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(express.static('app', { extensions: ['html']}));

async function getSurveys(req, res) {
    res.json(await db.listSurveys());
}

async function getSurvey(req, res) {
    const result = await db.findSurvey(req.params.id);
    if (!result) {
        res.status(404).send('No match for that ID.');
        return;
    }
    res.json(result);
}

async function getAllSurveys(req, res) {
    const result = await db.listSurveys();
    res.json(JSON.stringify(result));
}

async function addPassword(req, res) {
    console.log(req.body.password);
    let id = req.body.id;
    id = id.replace('"','');
    id = id.replace('"','');
    console.log(id);
    const password = await db.addPassword(req.body.password, id);
    res.json(JSON.stringify(password));
}

async function postSurvey(req, res) {
    const survey = await db.addSurvey(req.body);
    res.json(JSON.stringify(survey));
}

async function postResult(req, res) {
    const result = await db.addResult(req.body, req.params.id);
    res.json(JSON.stringify(result));
}

async function openSurvey(req, res) {
    const open = await db.openSurvey(req.params.id);
    res.json(JSON.stringify(open));
}

async function closeSurvey(req, res) {
    console.log(1);
    console.log(req.params.id);
    const open = await db.closeSurvey(req.params.id);
    res.json(JSON.stringify(open));
}

async function getResult(req, res) {
    const result = await db.getResults(req.params.id);
    if (!result) {
        res.status(404).send('No results for that ID');
    }
    res.json(result);
}

async function checkPassword(req, res) {
    const pass = await db.checkPassword(req.params.id);
    console.log(pass);
    if(!pass) {
        res.status(404).send('No password for that ID.');
    }
    res.json(pass);
}

async function getName(req, res) {
    const result = await db.getName(req.params.id);
    if (!result) {
        res.status(404).send('No name for that ID')
    }

    let a = result[0].json;
    a = JSON.parse(a);
    res.json(a.name);
}

// wrap async function for express.js error handling
function asyncWrap(f) {
    return (req, res, next) => {
        Promise.resolve(f(req, res, next))
            .catch((e) => next(e || new Error()));
    };
}

app.get('/surveys', asyncWrap(getSurveys));
app.get('/listSurveys', asyncWrap(getAllSurveys));
app.get('/surveys/:id', asyncWrap(getSurvey));
// app.put('/surveys/:id', express.json(), asyncWrap(putMessage));
app.post('/surveys', express.json(), asyncWrap(postSurvey));
app.post('/password/:id', express.json(), asyncWrap(addPassword));
app.get('/passwords/:id', express.json(), asyncWrap(checkPassword));
app.post('/results/:id', express.json(), asyncWrap(postResult));
app.get('/results/:id', express.json(), asyncWrap(getResult));
app.get('/name/:id', express.json(), asyncWrap(getName));
app.get('/open/:id', express.json(), asyncWrap(openSurvey));
app.get('/close/:id', express.json(), asyncWrap(closeSurvey));

// app.use(function(req,res){
//     res.status(404).render('app/error/404.html');
// });

app.get('*', function(req, res){
    if (req.accepts('html')) {
        res.status(404).send('<script>location.href = "/error/404.html";</script>');
    }
});


app.listen(port);