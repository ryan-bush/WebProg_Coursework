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

    // Clear existing form if there is one
    let existingSection = document.getElementById("exampleQuestionnaire");
    if(typeof (existingSection) !== undefined && existingSection !== null) {
        let existingSubmitButton = document.getElementById("submitSurvey");
        existingSection.parentNode.removeChild(existingSection);
        existingSubmitButton.parentNode.removeChild(existingSubmitButton);
    }

    // Section HTML
    let section = document.createElement('section');
    section.id = 'exampleQuestionnaire';
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
    // Create password section
    let passwordSection = document.getElementById('password');
    let passwordLabel = document.createElement('label');
    let passwordLabelText = document.createTextNode('If you wish to password protect your survey, enter a password below.');
    let passwordTextBox = document.createElement('input');
    passwordSection.appendChild(passwordLabel);
    passwordLabel.appendChild(passwordLabelText);
    passwordTextBox.id = 'inputPassword';
    passwordTextBox.type = 'password';
    passwordSection.appendChild(passwordTextBox);

    //  Create Submit Button
    let submitButton = document.createElement('button');
    submitButton.id = 'submitSurvey';
    submitButton.className = 'buttonPrimary';
    let submitButtonText = document.createTextNode('Create Survey');
    document.getElementById("form").appendChild(submitButton);
    submitButton.appendChild(submitButtonText);
    submitButton.addEventListener('click', sendSurvey);
    document.getElementById("jsonForm").appendChild(section);
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
    let password = document.getElementById('inputPassword').value;
    if(password !== undefined && password !== null) {
        const response = await fetch('surveys', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj),
        });

        if (response.ok) {
            const id = await response.json();
            addPassword(id);
            createShareLink(id);
        } else {
            console.log('failed to send message', response);
        }
    } else {
        let passwordError = document.createElement('p');
        let passwordErrorText = document.createTextNode('You must enter a password');
        let passwordSection = document.getElementById('password');
        passwordError.classList = 'errorText';
        passwordSection.appendChild(passwordError);
        passwordError.appendChild(passwordErrorText);
    }
}

async function addPassword(id) {
    const password = document.getElementById('inputPassword').value;
    if (password !== null && password !== undefined) {
        const passUpload = {id: id, password: password};
        const responsePass = await fetch('password/${id}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(passUpload),
        });
        let resPass;
        if (responsePass.ok) {
            resPass = await responsePass.json();
        } else {
            resPass = {msg: 'failed to add password :-('};
        }
        console.log(resPass);
    } else {
        console.log(0);
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

    // let input = document.createElement('input');
    // input.type = 'text';
    // input.name = 'share';
    // input.id = 'share';
    // input.value = "localhost:8080/survey#" + JSON.parse(id);
    // section.appendChild(input);

    let link = document.createElement('a');
    link.id = 'viewSurvey';
    link.className = 'buttonSecondary';
    link.href = "/survey#" + JSON.parse(id);
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