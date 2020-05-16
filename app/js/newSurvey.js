let qID = 0; // Question ID

let surveyJSON = {name: "", questions: []};

const handleSubmit = event => {
    event.preventDefault();
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
    let text = document.createTextNode(JSON.stringify(surveyJSON));
    result.appendChild(text);
    showLinks();
};
function isEven(value) {
    return value % 2 === 0;
}
const submitButton = document.getElementById('submitButton');
submitButton.addEventListener("click", handleSubmit, false);

function removeElement(ele) {
    let surveySection = document.getElementById('survey');
    let surveyDeleteQuestion = document.getElementById(ele);
    surveySection.removeChild(surveyDeleteQuestion);
}

function showLinks() {
    let linksDiv = document.getElementById('links');
    let data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(surveyJSON,null,2));

    let a = document.createElement('a');
    a.href = 'data:' + data;
    a.download = 'data.json';
    a.innerHTML = 'download JSON';

    linksDiv.appendChild(a);

    let createSurveyButton = document.createElement('button');
    let createSurveyButtonText = document.createTextNode('Create Survey');
    createSurveyButton.id = 'createSurvey';
    createSurveyButton.appendChild(createSurveyButtonText);
    createSurveyButton.addEventListener('click', submitButtonClick);
    linksDiv.appendChild(createSurveyButton);
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
        body: JSON.stringify(surveyJSON),
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
    let a = document.createElement('div');
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
    v.href = "http://localhost:8080/survey#" + JSON.parse(id);
    let vT = document.createTextNode('View Survey');
    a.appendChild(v);
    v.appendChild(vT);
    document.getElementById("links").appendChild(a);
}

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
    div.appendChild(typeField);

    idField.setAttribute('type', 'text');
    idField.setAttribute('placeholder', 'Question ID');
    idField.id = 'questionName' + qID;
    div.appendChild(idField);

    questionField.setAttribute('type', 'text');
    questionField.setAttribute('placeholder', 'Question');
    questionField.id = 'questionQues' + qID;
    div.appendChild(questionField);

    deleteButton.id = 'deleteQuestion' + qID;
    deleteButton.appendChild(deleteButtonText);
    deleteButton.setAttribute("onclick", "removeElement('question" + qID + "')");
    div.appendChild(deleteButton);
    qID++;
}

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
    div.appendChild(typeField);

    idField.setAttribute('type', 'text');
    idField.setAttribute('placeholder', 'Question ID');
    idField.id = 'questionName' + qID;
    div.appendChild(idField);

    questionField.setAttribute('type', 'text');
    questionField.setAttribute('placeholder', 'Question');
    questionField.id = 'questionQues' + qID;
    div.appendChild(questionField);

    deleteButton.id = 'deleteQuestion' + qID;
    deleteButton.appendChild(deleteButtonText);
    deleteButton.setAttribute("onclick", "removeElement('question" + qID + "')");
    div.appendChild(deleteButton);
    qID++;
}

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
    div.appendChild(typeField);

    idField.setAttribute('type', 'text');
    idField.setAttribute('placeholder', 'Question ID');
    idField.id = 'questionName' + qID;
    div.appendChild(idField);

    questionField.setAttribute('type', 'text');
    questionField.setAttribute('placeholder', 'Question');
    questionField.id = 'questionQues' + qID;
    div.appendChild(questionField);

    addOptionButton.id = 'addSelectQuestion' + qID;
    addOptionButton.appendChild(addOptionButtonText);
    addOptionButton.setAttribute("onclick", "addSelectOption('" + qID + "')");
    div.appendChild(addOptionButton);

    deleteButton.id = 'deleteQuestion' + qID;
    deleteButton.appendChild(deleteButtonText);
    deleteButton.setAttribute("onclick", "removeElement('question" + qID + "')");
    div.appendChild(deleteButton);

    optionDiv.id = 'questionOptions' + qID;
    div.appendChild(optionDiv);
    addSelectOption(qID);
    addSelectOption(qID);
    qID++;
}

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
    removeOptionButton.setAttribute('onclick', 'removeSelectOption('+ id + ', ' + optionCount + ')');
    removeOptionButton.appendChild(removeOptionButtonText);
    questionDiv.appendChild(removeOptionButton);
}

function removeSelectOption(questionID, optionID) {
    let questionOptionsDiv = document.getElementById('questionOptions' + questionID);
    let optionTextBox = document.getElementById('question' + questionID + 'Option' + optionID);
    let optionButton = document.getElementById('question' + questionID + 'RemoveButton' + optionID);
    optionTextBox.parentNode.removeChild(optionTextBox);
    optionButton.parentNode.removeChild(optionButton);
}

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
    div.appendChild(typeField);

    idField.setAttribute('type', 'text');
    idField.setAttribute('placeholder', 'Question ID');
    idField.id = 'questionName' + qID;
    div.appendChild(idField);

    questionField.setAttribute('type', 'text');
    questionField.setAttribute('placeholder', 'Question');
    questionField.id = 'questionQues' + qID;
    div.appendChild(questionField);

    addOptionButton.id = 'addSelectQuestion' + qID;
    addOptionButton.appendChild(addOptionButtonText);
    addOptionButton.setAttribute("onclick", "addSelectOption('" + qID + "')");
    div.appendChild(addOptionButton);

    deleteButton.id = 'deleteQuestion' + qID;
    deleteButton.appendChild(deleteButtonText);
    deleteButton.setAttribute("onclick", "removeElement('question" + qID + "')");
    div.appendChild(deleteButton);

    optionDiv.id = 'questionOptions' + qID;
    div.appendChild(optionDiv);
    addSelectOption(qID);
    addSelectOption(qID);
    qID++;
}
function resetElements(){
    document.getElementById('survey').innerHTML = '';
}