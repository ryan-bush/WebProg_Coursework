let obj = {};
let surveyId = {};
let time = {};

function showSurvey(survey) {
    obj = JSON.parse(survey.json);
    surveyId = survey.id;
    time = survey.time;

    addTitle(survey, obj);
    createSurvey(obj);
}

function addTitle(survey, obj) {
    console.log(obj);
    let t = document.createElement('h2');
    let tT = document.createTextNode(obj.name);
    t.appendChild(tT);

    let s = document.createElement('small');
    let sT = document.createTextNode(survey.time)
    s.appendChild(sT);

    let r = document.createElement('small');
    let rT = document.createTextNode(survey.id);
    r.appendChild(rT);

    document.getElementById("title").appendChild(t);
    document.getElementById("title").appendChild(s);
    document.getElementById("title").appendChild(r);
}

function createSurvey(json) {
    let f = document.createElement('form');
    f.name = 'surveyForm';
    f.id = 'surveyForm';
    for (let i = 0; i < json.questions.length; i++) {
        let q = document.createElement('div');
        q.className = 'formQuestion';

        let qA = document.createElement('label');
        qA.htmlFor = json.questions[i].id;
        let qB = document.createTextNode(obj.questions[i].text);
        q.appendChild(qA);
        qA.appendChild(qB);

        if(json.questions[i].type === 'text') {
            let fA = document.createElement('input');
            fA.type = json.questions[i].type;
            fA.name = json.questions[i].id;
            fA.id = json.questions[i].id;
            q.appendChild(fA);
        }
        if(json.questions[i].type === 'number') {
            let fA = document.createElement('input');
            fA.type = json.questions[i].type;
            fA.name = json.questions[i].id;
            fA.id = json.questions[i].id;
            q.appendChild(fA);
        }
        if(json.questions[i].type === 'single-select') {
            let fA = document.createElement('select');
            fA.id = json.questions[i].id;
            fA.name = json.questions[i].id;

            for (let j = 0; j < json.questions[i].options.length; j++) {
                let fO = document.createElement('option');
                fO.value = json.questions[i].options[j];
                let fOa = document.createTextNode(obj.questions[i].options[j]);
                fA.appendChild(fO);
                fO.appendChild(fOa);
            }
            q.appendChild(fA);
        }
        if(json.questions[i].type === 'multi-select') {
            let fA = document.createElement('select');
            fA.id = json.questions[i].id;
            fA.name = json.questions[i].id;
            fA.multiple = true;

            for (let j = 0; j < json.questions[i].options.length; j++) {
                let fO = document.createElement('option');
                fO.value = json.questions[i].options[j];
                let fOa = document.createTextNode(obj.questions[i].options[j]);
                fA.appendChild(fO);
                fO.appendChild(fOa);
            }
            q.appendChild(fA);
        }
        f.appendChild(q);
    }
    let submitButton = document.createElement('button');
    submitButton.id = 'submitSurvey';
    submitButton.classList = 'buttonSecondary';
    let submitButtonText = document.createTextNode('Submit Survey');
    submitButton.appendChild(submitButtonText);
    submitButton.addEventListener('click', submitButtonClick);
    document.getElementById("survey").appendChild(f);
    document.getElementById("survey").appendChild(submitButton);
}

function toJSONString( form ) {
    let obj = {};
    let elements = form.querySelectorAll("input, select, textarea");
    for (let i = 0; i < elements.length; ++i) {
        let element = elements[i];
        let name = element.name;
        let value = element.value;

        if (name) {
            obj[name] = value;
        }
    }

    return JSON.stringify(obj);
}

function submitButtonClick() {
    let form = document.querySelector('form');
    let data = JSON.stringify($('form').serializeArray());
    $('#results').text(JSON.stringify($('form').serializeArray()));
    sendResult(data);
    showResultsPage();
}

function showResultsPage() {
    let id = getSurveyId();
    let a = document.createElement('div');
    // Show Share Title
    let aTitle = document.createElement('h2');
    let aTitleText = document.createTextNode("View Results");
    a.appendChild(aTitle);
    aTitle.appendChild(aTitleText);

    let v = document.createElement('a');
    v.id = 'viewResults';
    v.href = "http://localhost:8080/results#" + id;
    let vT = document.createTextNode('View Results');
    a.appendChild(v);
    v.appendChild(vT);
    document.getElementById("results").appendChild(a);
}

/** Use fetch to post a JSON message to the server */
async function sendResult(data) {
    console.log(data);

    const response = await fetch('results/' + getSurveyId(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data,
    });

    if (response.ok) {
        const id = await response.json();
        console.log(id);
    } else {
        console.log('failed to send message', response);
    }
}


function getSurveyId() {
    return window.location.hash.substring(1);
}

async function loadSurvey() {
    const id = getSurveyId();
    const response = await fetch(`surveys/${id}`);
    let survey;
    if (response.ok) {
        survey = await response.json();
    } else {
        survey = { msg: 'failed to load survey :-(' };
    }
    showSurvey(survey);
}

function navigationCollapse() {
    let x = document.getElementById("mainNav");
    if (x.className === "mainNav") {
        x.className += " responsive";
    } else {
        x.className = "mainNav";
    }
}

function pageLoaded() {
    loadSurvey();
}

window.addEventListener('load', pageLoaded);