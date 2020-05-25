let uploadedJSON = {};
let obj;

/**
 * Gets JSON from pasteJSON form field
 */
document.getElementById('create').onclick = function() {
    obj = JSON.parse(document.getElementById('result').value);
    createFormatted(obj);
}

/**
 * Create Formatted JSON HTML on page
 * @param  {Array} json  JSON array of survey
 */
function createFormatted(json) {
    if(json == null) { console.log("no json") }

    // Section HTML
    let section = document.createElement('section');
    // Show Title
    let title = document.createElement('h2');
    let titleTxt = document.createTextNode(json.name);
    section.appendChild(title);
    title.appendChild(titleTxt);

    // Show Questions
    for (let i = 0; i < json.questions.length; i++) {
        let questionSection = document.createElement('section');
        questionSection.className = 'formQuestion';

        let questionLabel = document.createElement('label');
        questionLabel.htmlFor = json.questions[i].id;
        let questionLabelText = document.createTextNode(obj.questions[i].text);
        questionSection.appendChild(questionLabel);
        questionLabel.appendChild(questionLabelText);

        if(json.questions[i].type === 'text') {
            let input = document.createElement('input');
            input.type = json.questions[i].type;
            input.name = json.questions[i].id;
            input.id = json.questions[i].id;
            questionSection.appendChild(input);
        }
        if(json.questions[i].type === 'number') {
            let input = document.createElement('input');
            input.type = json.questions[i].type;
            input.name = json.questions[i].id;
            input.id = json.questions[i].id;
            questionSection.appendChild(input);
        }
        if(json.questions[i].type === 'single-select') {
            let select = document.createElement('select');
            select.id = json.questions[i].id;

            for (let j = 0; j < json.questions[i].options.length; j++) {
                let option = document.createElement('option');
                option.value = json.questions[i].options[j];
                let optionText = document.createTextNode(obj.questions[i].options[j]);
                select.appendChild(option);
                option.appendChild(optionText);
            }
            questionSection.appendChild(select);
        }
        if(json.questions[i].type === 'multi-select') {
            let select = document.createElement('select');
            select.id = json.questions[i].id;
            select.multiple = true;

            for (let j = 0; j < json.questions[i].options.length; j++) {
                let option = document.createElement('option');
                option.value = json.questions[i].options[j];
                let optionText = document.createTextNode(obj.questions[i].options[j]);
                select.appendChild(option);
                option.appendChild(optionText);
            }
            questionSection.appendChild(select);
        }

        section.appendChild(questionSection);
    }

    //  Create Submit Button
    let submitButton = document.createElement('button');
    submitButton.id = 'submitSurvey';
    submitButton.className = 'buttonPrimary';
    let submitButtonText = document.createTextNode('Create Survey');
    document.getElementById("form").appendChild(submitButton);
    submitButton.appendChild(submitButtonText);
    submitButton.addEventListener('click', sendSurvey);
    document.getElementById("jsonForm").appendChild(a);
}

/**
 * Handles the upload of a JSON file
 */
document.getElementById('import').onclick = function() {
    let files = document.getElementById('upJSON').files;
    if (files.length <= 0) {
        return false;
    }
    let fReader = new FileReader();
    let formatted;
    fReader.onload = function(e) {
        uploadedJSON = JSON.parse(e.target.result);
        formatted = JSON.stringify(uploadedJSON, null, 2);
        document.getElementById('result').value = formatted;
    };
    fReader.readAsText(files.item(0));
};

/**
 * Upload the JSON to the server
 * @param  {Array} json  JSON array of survey
 */
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
        createShareLink(id);
    } else {
        console.log('failed to send message', response);
    }
}

/**
 * Create the share link HTMLon the page
 * @param  {String} id  The ID of the created survey
 */
function createShareLink(id) {
    let section = document.createElement('section');
    // Show Share Title
    let title = document.createElement('h2');
    let titleText = document.createTextNode("Share Link");
    section.appendChild(title);
    title.appendChild(titleText);

    let input = document.createElement('input');
    input.type = 'text';
    input.name = 'share';
    input.id = 'share';
    input.value = "localhost:8080/survey#" + JSON.parse(id);
    section.appendChildinput;

    let link = document.createElement('a');
    link.id = 'viewSurvey';
    link.className = 'buttonSecondary';
    link.href = "http://localhost:8080/survey#" + JSON.parse(id);
    let linkText = document.createTextNode('View Survey');
    section.appendChild(link);
    link.appendChild(linkText);
    document.getElementById("share").appendChild(section);
}

/**
 * Adds functionality for collapsable navigation on mobile
 */
function navigationCollapse() {
    let x = document.getElementById("mainNav");
    if (x.className === "mainNav") {
        x.className += " responsive";
    } else {
        x.className = "mainNav";
    }
}