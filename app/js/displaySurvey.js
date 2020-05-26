let obj = {};


/**
 * Handles the retrieved survey
 * @param {Array} survey  JSON of the survey
 */
function showSurvey(survey) {
    obj = JSON.parse(survey.json);
    addTitle(survey, obj);
    createSurvey(obj);
}

/**
 * Creates HTML for page title
 * @param {Array} survey  JSON of the survey
 * @param {Array} obj     JSON of the survey entry
 */
function addTitle(survey, obj) {
    let title = document.createElement('h1');
    let titleText = document.createTextNode(obj.name);
    title.appendChild(titleText);

    let smallTime = document.createElement('small');
    let smallTimeText = document.createTextNode(survey.time)
    smallTime.appendChild(smallTimeText);

    let smallId = document.createElement('small');
    let smallIdText = document.createTextNode(survey.id);
    smallId.appendChild(smallIdText);

    document.getElementById("title").appendChild(title);
    document.getElementById("title").appendChild(smallTime);
    document.getElementById("title").appendChild(smallId);
}

/**
 * Create HTML of page for the survey
 * @param {Array} json  JSON of the survey
 */
function createSurvey(json) {
    let form = document.createElement('form');
    form.name = 'surveyForm';
    form.id = 'surveyForm';
    for (let i = 0; i < json.questions.length; i++) {
        let section = document.createElement('section');
        section.className = 'formQuestion';

        let label = document.createElement('label');
        label.htmlFor = json.questions[i].id;
        let labelText = document.createTextNode(obj.questions[i].text);
        section.appendChild(label);
        label.appendChild(labelText);

        if(json.questions[i].type === 'text') {
            let input = document.createElement('input');
            input.type = json.questions[i].type;
            input.name = json.questions[i].id;
            input.id = json.questions[i].id;
            section.appendChild(input);
        }
        if(json.questions[i].type === 'number') {
            let input = document.createElement('input');
            console.log(json.questions[i].type);
            input.type = 'tel';
            input.pattern = '[0-9]';
            input.name = json.questions[i].id;
            input.id = json.questions[i].id;
            section.appendChild(input);
        }
        if(json.questions[i].type === 'single-select') {
            let input = document.createElement('select');
            input.id = json.questions[i].id;
            input.name = json.questions[i].id;

            for (let j = 0; j < json.questions[i].options.length; j++) {
                let option = document.createElement('option');
                option.value = json.questions[i].options[j];
                let optionText = document.createTextNode(obj.questions[i].options[j]);
                input.appendChild(option);
                option.appendChild(optionText);
            }
            section.appendChild(input);
        }
        if(json.questions[i].type === 'multi-select') {
            let input = document.createElement('select');
            input.id = json.questions[i].id;
            input.name = json.questions[i].id;
            input.multiple = true;

            for (let j = 0; j < json.questions[i].options.length; j++) {
                let multiOption = document.createElement('option');
                multiOption.value = json.questions[i].options[j];
                let multiOptionText = document.createTextNode(obj.questions[i].options[j]);
                input.appendChild(multiOption);
                multiOption.appendChild(multiOptionText);
            }
            section.appendChild(input);
        }
        form.appendChild(section);
    }
    let submitButton = document.createElement('button');
    submitButton.id = 'submitSurvey';
    submitButton.classList = 'buttonSecondary';
    let submitButtonText = document.createTextNode('Submit Survey');
    submitButton.appendChild(submitButtonText);
    submitButton.addEventListener('click', submitButtonClick);
    document.getElementById("survey").appendChild(form);
    document.getElementById("survey").appendChild(submitButton);
}
//
// function toJSONString( form ) {
//     let obj = {};
//     let elements = form.querySelectorAll("input, select, textarea");
//     for (let i = 0; i < elements.length; ++i) {
//         let element = elements[i];
//         let name = element.name;
//         let value = element.value;
//
//         if (name) {
//             obj[name] = value;
//         }
//     }
//
//     return JSON.stringify(obj);
// }

/**
 * Handles the submit button click
 */
function submitButtonClick() {
    let data = JSON.stringify($('form').serializeArray());
    $('#results').text("Your results have been sent.");
    sendResult(data);
    showResultsPage();
}

/**
 * Create HTML on page for link to results page
 */
function showResultsPage() {
    let id = getSurveyId();
    let section = document.createElement('section');
    // Show Share Title
    let title = document.createElement('h2');
    let titleText = document.createTextNode("View Results");
    section.appendChild(title);
    title.appendChild(titleText);

    let link = document.createElement('a');
    link.id = 'viewResults';
    link.href = "/results#" + id;
    link.classList = "buttonPrimary";
    let linkText = document.createTextNode('View Results');
    section.appendChild(link);
    link.appendChild(linkText);
    document.getElementById("results").appendChild(section);
}

/**
 * Sends the result to the server
 * @param  {Array} data  JSON data of the response
 */
async function sendResult(data) {
    const response = await fetch('results/' + getSurveyId(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data,
    });

    if (response.ok) {
        const id = await response.json();
    } else {
        console.log('failed to send message', response);
    }
}

/**
 * Returns the survey ID from hash substring
 * @return  {String}      Survey ID
 */
function getSurveyId() {
    return window.location.hash.substring(1);
}

/**
 * Load the survey from teh server
 */
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

/**
 * Handles page load
 */
function pageLoaded() {
    loadSurvey();
}
window.addEventListener('load', pageLoaded);