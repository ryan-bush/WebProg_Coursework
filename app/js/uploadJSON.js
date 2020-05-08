let uploadedJSON = {};
let el = {};
let obj;

document.getElementById('create').onclick = function() {
    obj = JSON.parse(document.getElementById('result').value);
    console.log(obj);

    let d = document.createElement('div');
    let title = document.createElement('p');
    let title1 = document.createTextNode(obj.name);
    d.appendChild(title);
    title.appendChild(title1);

    for (let i = 0; i < obj.questions.length; i++) {
        let a = document.createElement('p');
        let aA = document.createTextNode(obj.questions[i].id);
        a.appendChild(aA);
        let aB = document.createTextNode(obj.questions[i].text);
        a.appendChild(aB);
        let aC = document.createTextNode(obj.questions[i].type);
        a.appendChild(aC);
        if(obj.questions[i].type === "multi-select" || obj.questions[i].type === "single-select") {
            let aD = document.createTextNode(obj.questions[i].options);
            a.appendChild(aD);
        }
        title.appendChild(a);
    }
    document.getElementById("stats").appendChild(d);
    createFormatted(obj);
}

function createFormatted(json) {
    if(json == null) { console.log("no json") }
    console.log(json);

    let a = document.createElement('div');
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

        // let a = document.createElement('p');
        // let aA = document.createTextNode(obj.questions[i].id);
        // a.appendChild(aA);
        // let aB = document.createTextNode(obj.questions[i].text);
        // a.appendChild(aB);
        // let aC = document.createTextNode(obj.questions[i].type);
        // a.appendChild(aC);
        // if(obj.questions[i].type === "multi-select") {
        //     let aD = document.createTextNode(obj.questions[i].options);
        //     a.appendChild(aD);
        // }
        // title.appendChild(a);
    }

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

/** Use fetch to put a JSON message to the server */
async function sendSurvey() {
    const id = getSurveyId();
    const payload = { id, msg: el.message.value };
    console.log('Payload', payload);

    const response = await fetch(`surveys/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (response.ok) {
        el.message.value = '';
        const updatedMessages = await response.json();
        showSurvey(updatedMessages, el.messagelist);
    } else {
        console.log('failed to send message', response);
    }
}