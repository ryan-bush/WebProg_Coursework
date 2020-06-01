const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;
const db = require('./server/database');

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(express.static('app', { extensions: ['html']}));

/**
 * Retrieve surveys from database
 * @param  {Object} req  Request
 * @param  {Object} res  Response
 */
async function getSurveys(req, res) {
    res.json(await db.listSurveys());
}

/**
 * Retrieve survey from database
 * @param  {Object} req  Request
 * @param  {Object} res  Response
 */
async function getSurvey(req, res) {
    const result = await db.findSurvey(req.params.id);
    if (!result) {
        res.status(404).send('No match for that ID.');
        return;
    }
    res.json(result);
}

/**
 * Retrieve surveys from database
 * @param  {Object} req  Request
 * @param  {Object} res  Response
 */
async function getAllSurveys(req, res) {
    const result = await db.listSurveys();
    res.json(JSON.stringify(result));
}

/**
 * Add password to survey into database
 * @param  {Object} req  Request
 * @param  {Object} res  Response
 */
async function addPassword(req, res) {
    let id = req.body.id;
    id = id.replace('"','');
    id = id.replace('"','');
    const password = await db.addPassword(req.body.password, id);
    res.json(JSON.stringify(password));
}

/**
 * Add Survey to database
 * @param  {Object} req  Request
 * @param  {Object} res  Response
 */
async function postSurvey(req, res) {
    const survey = await db.addSurvey(req.body);
    res.json(JSON.stringify(survey));
}

/**
 * Add response to database
 * @param  {Object} req  Request
 * @param  {Object} res  Response
 */
async function postResult(req, res) {
    const result = await db.addResult(req.body, req.params.id);
    res.json(JSON.stringify(result));
}

/**
 * Changes survey to open in database
 * @param  {Object} req  Request
 * @param  {Object} res  Response
 */
async function openSurvey(req, res) {
    const open = await db.openSurvey(req.params.id);
    res.json(JSON.stringify(open));
}

/**
 * Changes survey to closed in database
 * @param  {Object} req  Request
 * @param  {Object} res  Response
 */
async function closeSurvey(req, res) {
    const open = await db.closeSurvey(req.params.id);
    res.json(JSON.stringify(open));
}

/**
 * Deletes survey from database
 * @param  {Object} req  Request
 * @param  {Object} res  Response
 */
async function deleteSurvey(req, res) {
    const deleteSur = await db.deleteSurvey(req.params.id);
    res.json(JSON.stringify(deleteSur));
}

/**
 * Retrieves single response from database
 * @param  {Object} req  Request
 * @param  {Object} res  Response
 */
async function getResult(req, res) {
    const result = await db.getResults(req.params.id);
    if (!result) {
        res.status(404).send('No results for that ID');
    }
    res.json(result);
}

/**
 * Retrieves password from database
 * @param  {Object} req  Request
 * @param  {Object} res  Response
 */
async function checkPassword(req, res) {
    const pass = await db.checkPassword(req.params.id);
    if(!pass) {
        res.status(404).send('No password for that ID.');
    }
    res.json(pass);
}

/**
 * Retrieves name from database
 * @param  {Object} req  Request
 * @param  {Object} res  Response
 */
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
app.get('/delete/:id', express.json(), asyncWrap(deleteSurvey));

// app.use(function(req,res){
//     res.status(404).render('app/error/404.html');
// });

app.get('*', function(req, res){
    if (req.accepts('html')) {
        res.status(404).send('<script>location.href = "/error/404.html";</script>');
    }
});


app.listen(port);