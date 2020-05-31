let qID = 0; // Question ID
let surveyJSON = {name: "", questions: []};

/**
 * Handles the submit of Create Survey button
 */
const handleSubmit = event => {
    event.preventDefault();
    let password = document.getElementById('inputPassword').value;
    let name = document.getElementById('surveyName').value;
    if(name !== undefined && name !== null && name.length >= 1) {
        if(password !== undefined && password !== null && password.length >= 1) {
            let surveyName = document.getElementById('surveyName');
            surveyJSON.name = surveyName.value;
            for (let i = 0; i < qID; i++) {
                let questionName = document.getElementById('questionName' + i);
                let questionQues = document.getElementById('questionQues' + i);
                let questionType = document.getElementById('questionType' + i);

                if (questionType.value === 'single-select' ||  questionType.value === 'multi-select') {
                    let optionCount = document.getElementById('questionOptions' + i).childElementCount;
                    let options = [];
                    for (let j = 0; j < optionCount; j++) {
                        if (isEven(j)){
                            let option = document.getElementById('question' + i + 'Option' +  j);
                            if(option.value == null) { continue; }
                            options.push(option.value);
                        }
                    }
                    let a = { id: questionName.value, text: questionQues.value, type: questionType.value, options: options}
                    surveyJSON.questions.push(a);
                } else {
                    let a = { id: questionName.value, text: questionQues.value, type: questionType.value }
                    surveyJSON.questions.push(a);
                }
            }
            let result = document.getElementById('results');
            let text = document.createTextNode("Survey created. Please either download the JSON or submit the survey to be created.");
            result.appendChild(text);
            showLinks();
        } else {
            let passwordError = document.createElement('p');
            let passwordErrorText = document.createTextNode('You must enter a password');
            let passwordSection = document.getElementById('password');
            passwordError.classList = 'errorText';
            passwordSection.appendChild(passwordError);
            passwordError.appendChild(passwordErrorText);
        }
    } else {
        let nameError = document.createElement('p');
        let nameErrorText = document.createTextNode('You must enter a survey name');
        let nameSection = document.getElementById('name');
        nameError.classList = 'errorText';
        nameSection.appendChild(nameError);
        nameError.appendChild(nameErrorText);
    }
};

/**
 * Checks if a number is even
 * @param {Number} value  Number
 * @return {Number}       True or false
 */
function isEven(value) {
    return value % 2 === 0;
}

const submitButton = document.getElementById('submitButton');
submitButton.addEventListener("click", handleSubmit, false);

/**
 * Removes section of the survey
 * @param {Array} ele  ID of the element
 */
function removeElement(ele) {
    let surveySection = document.getElementById('survey');
    let surveyDeleteQuestion = document.getElementById(ele);
    surveySection.removeChild(surveyDeleteQuestion);
}

/**
 * Show survey links
 */
function showLinks() {
    let linksDiv = document.getElementById('links');
    let data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(surveyJSON,null,2));

    let link = document.createElement('a');
    link.href = 'data:' + data;
    link.download = 'data.json';
    link.innerHTML = 'download JSON';
    link.classList = "buttonPrimary";

    linksDiv.appendChild(link);

    let createSurveyButton = document.createElement('button');
    let createSurveyButtonText = document.createTextNode('Create Survey');
    createSurveyButton.id = 'createSurvey';
    createSurveyButton.classList = "buttonSecondary";
    createSurveyButton.appendChild(createSurveyButtonText);
    createSurveyButton.addEventListener('click', submitButtonClick);
    linksDiv.appendChild(createSurveyButton);
}

/**
 * Handle Submit button click
 */
function submitButtonClick() {
    sendSurvey();
}

/**
 * Sends the survey data to the server
 * @param {Array} survey  JSON of the survey
 */
async function sendSurvey() {
    const response = await fetch('surveys', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(surveyJSON),
    });

    if (response.ok) {
        const id = await response.json();
        createShareLink(id);
    } else {
        console.log('failed to send message', response);
    }
}

/**
 * Creates share link HTML for the uploaded survey
 * @param {String} id  ID of the survey
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
    section.appendChild(input);

    let link = document.createElement('a');
    link.id = 'viewSurvey';
    link.href = "http://localhost:8080/survey#" + JSON.parse(id);
    link.classList = "buttonPrimary";
    let linkText = document.createTextNode('View Survey');
    section.appendChild(link);
    link.appendChild(linkText);
    document.getElementById("links").appendChild(section);
}

/**
 * Adds Text Question to the page
 */
function addTextQuestion() {
    let div = document.createElement('div');
    let typeField = document.createElement('input');
    let idField = document.createElement('input');
    let questionField = document.createElement('input');
    let deleteButton = document.createElement('button');
    let deleteButtonText = document.createTextNode('Delete Question');

    div.id = 'question' + qID;
    document.getElementById("survey").appendChild(div);

    typeField.setAttribute('type', 'text');
    typeField.setAttribute('value', 'text');
    typeField.disabled = true;
    typeField.id = 'questionType' + qID;
    typeField.classList = 'surveyTypeInput';
    div.appendChild(typeField);

    idField.setAttribute('type', 'text');
    idField.setAttribute('placeholder', 'Question ID');
    idField.id = 'questionName' + qID;
    idField.classList = 'surveyIdInput';
    div.appendChild(idField);

    questionField.setAttribute('type', 'text');
    questionField.setAttribute('placeholder', 'Question');
    questionField.id = 'questionQues' + qID;
    questionField.classList = 'surveyNameInput';
    div.appendChild(questionField);

    deleteButton.id = 'deleteQuestion' + qID;
    deleteButton.classList = 'buttonSmallRed';
    deleteButton.appendChild(deleteButtonText);
    deleteButton.setAttribute("onclick", "removeElement('question" + qID + "')");
    div.appendChild(deleteButton);
    qID++;
}

/**
 * Adds a number question to the page
 */
function addNumberQuestion() {
    let div = document.createElement('div');
    let typeField = document.createElement('input');
    let idField = document.createElement('input');
    let questionField = document.createElement('input');
    let deleteButton = document.createElement('button');
    let deleteButtonText = document.createTextNode('Delete Question');

    div.id = 'question' + qID;
    document.getElementById("survey").appendChild(div);

    typeField.setAttribute('type', 'text');
    typeField.setAttribute('value', 'number');
    typeField.disabled = true;
    typeField.id = 'questionType' + qID;
    typeField.classList = 'surveyTypeInput';
    div.appendChild(typeField);

    idField.setAttribute('type', 'text');
    idField.setAttribute('placeholder', 'Question ID');
    idField.id = 'questionName' + qID;
    idField.classList = 'surveyIdInput';
    div.appendChild(idField);

    questionField.setAttribute('type', 'text');
    questionField.setAttribute('placeholder', 'Question');
    questionField.id = 'questionQues' + qID;
    questionField.classList = 'surveyNameInput';
    div.appendChild(questionField);

    deleteButton.id = 'deleteQuestion' + qID;
    deleteButton.classList = 'buttonSmallRed';
    deleteButton.appendChild(deleteButtonText);
    deleteButton.setAttribute("onclick", "removeElement('question" + qID + "')");
    div.appendChild(deleteButton);
    qID++;
}

/**
 * Adds a single select question to the page
 */
function addSingleSelectQuestion() {
    let div = document.createElement('div');
    let typeField = document.createElement('input');
    let idField = document.createElement('input');
    let questionField = document.createElement('input');
    let addOptionButton = document.createElement('button');
    let addOptionButtonText = document.createTextNode('Add Option');
    let deleteButton = document.createElement('button');
    let deleteButtonText = document.createTextNode('Delete Question');
    let optionDiv = document.createElement('div');

    div.id = 'question' + qID;
    document.getElementById("survey").appendChild(div);

    typeField.setAttribute('type', 'text');
    typeField.setAttribute('value', 'single-select');
    typeField.disabled = true;
    typeField.id = 'questionType' + qID;
    typeField.classList = 'surveyTypeInput';
    div.appendChild(typeField);

    idField.setAttribute('type', 'text');
    idField.setAttribute('placeholder', 'Question ID');
    idField.id = 'questionName' + qID;
    idField.classList = 'surveyIdInput';
    div.appendChild(idField);

    questionField.setAttribute('type', 'text');
    questionField.setAttribute('placeholder', 'Question');
    questionField.id = 'questionQues' + qID;
    questionField.classList = 'surveyNameInput';
    div.appendChild(questionField);

    addOptionButton.id = 'addSelectQuestion' + qID;
    addOptionButton.classList = 'buttonSmall';
    addOptionButton.appendChild(addOptionButtonText);
    addOptionButton.setAttribute("onclick", "addSelectOption('" + qID + "')");
    div.appendChild(addOptionButton);

    deleteButton.id = 'deleteQuestion' + qID;
    deleteButton.classList = 'buttonSmallRed';
    deleteButton.appendChild(deleteButtonText);
    deleteButton.setAttribute("onclick", "removeElement('question" + qID + "')");
    div.appendChild(deleteButton);

    optionDiv.id = 'questionOptions' + qID;
    div.appendChild(optionDiv);
    addSelectOption(qID);
    addSelectOption(qID);
    qID++;
}

/**
 * Adds a Select Option to the question
 * @param {String} id   The ID of the question
 */
function addSelectOption(id) {
    let questionDiv = document.getElementById('questionOptions' + id);
    let optionCount = document.getElementById('questionOptions' + id).childElementCount;
    let option = document.createElement('input');
    let removeOptionButton = document.createElement('button');
    let removeOptionButtonText = document.createTextNode('Remove Option');

    option.id = 'question' + id + 'Option' + optionCount;
    option.setAttribute('type', 'text');
    option.setAttribute('placeholder', 'option');
    questionDiv.appendChild(option);

    removeOptionButton.id = 'question' + id + 'RemoveButton' + optionCount;
    removeOptionButton.classList = 'buttonSmallOrange';
    removeOptionButton.setAttribute('onclick', 'removeSelectOption('+ id + ', ' + optionCount + ')');
    removeOptionButton.appendChild(removeOptionButtonText);
    questionDiv.appendChild(removeOptionButton);
}

/**
 * Removes a select option from the page
 * @param {String} questionID   The ID of the question
 * @param {String} optionID     The ID of the option
 */
function removeSelectOption(questionID, optionID) {
    let optionTextBox = document.getElementById('question' + questionID + 'Option' + optionID);
    let optionButton = document.getElementById('question' + questionID + 'RemoveButton' + optionID);
    optionTextBox.parentNode.removeChild(optionTextBox);
    optionButton.parentNode.removeChild(optionButton);
}

/**
 * Adds a multi select question to the page
 */
function addMultiSelectQuestion() {
    let div = document.createElement('div');
    let typeField = document.createElement('input');
    let idField = document.createElement('input');
    let questionField = document.createElement('input');
    let addOptionButton = document.createElement('button');
    let addOptionButtonText = document.createTextNode('Add Option');
    let deleteButton = document.createElement('button');
    let deleteButtonText = document.createTextNode('Delete Question');
    let optionDiv = document.createElement('div');

    div.id = 'question' + qID;
    document.getElementById("survey").appendChild(div);

    typeField.setAttribute('type', 'text');
    typeField.setAttribute('value', 'multi-select');
    typeField.disabled = true;
    typeField.id = 'questionType' + qID;
    typeField.classList = 'surveyTypeInput';
    div.appendChild(typeField);

    idField.setAttribute('type', 'text');
    idField.setAttribute('placeholder', 'Question ID');
    idField.id = 'questionName' + qID;
    idField.classList = 'surveyIdInput';
    div.appendChild(idField);

    questionField.setAttribute('type', 'text');
    questionField.setAttribute('placeholder', 'Question');
    questionField.id = 'questionQues' + qID;
    questionField.classList = 'surveyNameInput';
    div.appendChild(questionField);

    addOptionButton.id = 'addSelectQuestion' + qID;
    addOptionButton.classList = 'buttonSmall';
    addOptionButton.appendChild(addOptionButtonText);
    addOptionButton.setAttribute("onclick", "addSelectOption('" + qID + "')");
    div.appendChild(addOptionButton);

    deleteButton.id = 'deleteQuestion' + qID;
    deleteButton.classList = 'buttonSmallRed';
    deleteButton.appendChild(deleteButtonText);
    deleteButton.setAttribute("onclick", "removeElement('question" + qID + "')");
    div.appendChild(deleteButton);

    optionDiv.id = 'questionOptions' + qID;
    div.appendChild(optionDiv);
    addSelectOption(qID);
    addSelectOption(qID);
    qID++;
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
 * Resets all created question elements on the page
 */
function resetElements(){
    document.getElementById('survey').innerHTML = '';
}