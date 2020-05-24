let uploadedJSON = {};
let el = {};
let obj;

document.getElementById('create').onclick = function() {
    obj = JSON.parse(document.getElementById('result').value);
    console.log(obj);
    createFormatted(obj);
}

function createFormatted(json) {
    if(json == null) { console.log("no json") }
    console.log(json);

    let a = document.createElement('section');
    // Show Title
    let aTitle = document.createElement('h2');
    let aTitleText = document.createTextNode(json.name);
    a.appendChild(aTitle);
    aTitle.appendChild(aTitleText);

    // Show Questions
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

        a.appendChild(q);
    }
    let submitButton = document.createElement('button');
    submitButton.id = 'submitSurvey';
    submitButton.className = 'buttonPrimary';
    let submitButtonText = document.createTextNode('Create Survey');
    document.getElementById("form").appendChild(submitButton);
    submitButton.appendChild(submitButtonText);
    submitButton.addEventListener('click', submitButtonClick);
    document.getElementById("jsonForm").appendChild(a);
}

document.getElementById('import').onclick = function() {
    let files = document.getElementById('upJSON').files;
    console.log(files);
    if (files.length <= 0) {
        return false;
    }

    let fr = new FileReader();
    let formatted;

    fr.onload = function(e) {
        console.log(e);
        uploadedJSON = JSON.parse(e.target.result);
        console.log(uploadedJSON);
        formatted = JSON.stringify(uploadedJSON, null, 2);
        document.getElementById('result').value = formatted;
    };

    fr.readAsText(files.item(0));

    addForm(formatted);
};
function addForm(formatted) {
    console.log(formatted.name[0]);
}

function getSurveyId() {
    return window.location.hash.substring(1);
}

function submitButtonClick() {
    sendSurvey();
}

/** Use fetch to post a JSON message to the server */
async function sendSurvey() {
    const response = await fetch('surveys', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj),
    });

    if (response.ok) {
        const id = await response.json();
        console.log(id);
        createShareLink(id);
    } else {
        console.log('failed to send message', response);
    }
}

function createShareLink(id) {
    console.log(id);
    let a = document.createElement('section');
    // Show Share Title
    let aTitle = document.createElement('h2');
    let aTitleText = document.createTextNode("Share Link");
    a.appendChild(aTitle);
    aTitle.appendChild(aTitleText);

    let b = document.createElement('input');
    b.type = 'text';
    b.name = 'share';
    b.id = 'share';
    b.value = "localhost:8080/survey#" + JSON.parse(id);
    a.appendChild(b);

    let v = document.createElement('a');
    v.id = 'viewSurvey';
    v.className = 'buttonSecondary';
    v.href = "http://localhost:8080/survey#" + JSON.parse(id);
    let vT = document.createTextNode('View Survey');
    a.appendChild(v);
    v.appendChild(vT);
    document.getElementById("share").appendChild(a);
}

function navigationCollapse() {
    let x = document.getElementById("mainNav");
    if (x.className === "mainNav") {
        x.className += " responsive";
    } else {
        x.className = "mainNav";
    }
}