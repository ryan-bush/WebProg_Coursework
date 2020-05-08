const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const viewFolder = "/app/";
const port = 8080;
const db = require('./server/database');

let surveys = [
    {
        "name": "Example Questionnaire",
        "questions": [
            {
                "id": "name",
                "text": "What is your name?",
                "type": "text"
            },
            {
                "id": "quest",
                "text": "What is your quest?",
                "type": "text"
            },
            {
                "id": "col",
                "text": "What is your favourite colour?",
                "type": "text"
            },
            {
                "id": "velo",
                "text": "What is the air-speed velocity of an unladen swallow?",
                "type": "number"
            },
            {
                "id": "lord",
                "text": "Which is the best lord?",
                "type": "single-select",
                "options": [
                    "Lord of the Rings",
                    "Lord of the Flies",
                    "Lord of the Dance",
                    "Lorde"
                ]
            },
            {
                "id": "langs",
                "text": "Which computer languages have you used?",
                "type": "multi-select",
                "options": [
                    "JavaScript",
                    "Java",
                    "C",
                    "Python",
                    "Ook",
                    "LISP"
                ]
            }
        ]
     },
];



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

// wrap async function for express.js error handling
function asyncWrap(f) {
    return (req, res, next) => {
        Promise.resolve(f(req, res, next))
            .catch((e) => next(e || new Error()));
    };
}

app.get('/surveys', asyncWrap(getSurveys));
app.get('/surveys/:id', asyncWrap(getSurvey));
// app.put('/surveys/:id', express.json(), asyncWrap(putMessage));
// app.post('/surveys', uploader.single('avatar'), express.json(), asyncWrap(postMessage));

app.listen(port);