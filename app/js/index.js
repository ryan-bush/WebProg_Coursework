let qID = 0; // Question ID

var i = 0; /* Set Global Variable i */
function increment(){
    i += 1; /* Function for automatic increment of field's "Name" attribute. */
}

function addSurveyTitle() {
    const title = document.getElementById('title');
    const titleEnter = document.createElement('input');
    titleEnter.id = "surveyTitle";
    titleEnter.name = "surveyTitle";
    title.appendChild(titleEnter);
}

function addTextQuestion() {
    const questions = document.getElementById('questions');
    console.log('questions');
    const tqGroup = document.createElement("div");
    tqGroup.id = "question" + qID;
    questions.appendChild(tqGroup);
    const questionNameLabel = document.createElement("label");
    questionNameLabel.textContent  = "Enter your question";
    tqGroup.appendChild(questionNameLabel);
    const pa = document.createElement("input");
    pa.textContent = "";
    pa.id = "textQuestion" + qID;
    pa.name = "textQuestion" + qID;
    tqGroup.appendChild(pa);

    qID++;
}

function addSelectQuestion() {
    const questions = document.getElementById('questions');
    const sqGroup = document.createElement("div");
    sqGroup.id = "question" +qID;
    questions.appendChild(sqGroup);

    const questionNameLabel = document.createElement("label");
    questionNameLabel.textContent = "Enter your question";
    sqGroup.appendChild(questionNameLabel);

    const questionName  = document.createElement("input");
    questionName.textContent = "";
    questionName.id = 'selectQuestion' + qID;
    questionName.name = 'selectQuestion' + qID;
    sqGroup.appendChild(questionName);
    console.log(sqGroup.id);
    addSelectOption(sqGroup.id);
    addSelectOption(sqGroup.id);
    qID++;

}

function addSelectOption($question) {
    console.log($question);
    const optionGroup = document.getElementById($question);
    console.log(optionGroup);
    const optionLabel = document.createElement("label");
    optionLabel.textContent = "Option:";
    optionGroup.appendChild(optionLabel);

    const addOption = document.createElement("input");
    addOption.id = "option";
    addOption.name = "option";
    optionGroup.appendChild(addOption);
}

const handleSubmit = event => {
    event.preventDefault();
    console.log(form.elements);
    const data = formToJSON(form.elements);
    const dataContainer = document.getElementById('results');
    dataContainer.textContent = JSON.stringify(data, null, "  ");
};
const form = document.getElementById('createSurveyForm');
//form.addEventListener('submit', handleSubmit);
form.addEventListener("click", handleSubmit, false);

/**
 * Retrieves input data from a form and returns it as a JSON object.
 * @param  {HTMLFormControlsCollection} elements  the form elements
 * @return {Object}                               form data as an object literal
 */
const formToJSON = elements => [].reduce.call(elements, (data, element) => {
    data[element.name] = element.value;
    return data;
}, {});

function removeElement(parentDiv, childDiv){
    if (childDiv == parentDiv){
        alert("The parent div cannot be removed.");
    }
    else if (document.getElementById(childDiv)){
        var child = document.getElementById(childDiv);
        var parent = document.getElementById(parentDiv);
        parent.removeChild(child);
    }
    else{
        alert("Child div has already been removed or does not exist.");
        return false;
    }
}

function addTextQuestion(){
    let r = document.createElement('span');
    let y = document.createElement("INPUT");
    y.setAttribute("type", "text");
    y.setAttribute("placeholder", "Email");
    let g = document.createElement("IMG");
    g.setAttribute("src", "delete.png");
    increment();
    y.setAttribute("Name", "textelement_" + i);
    r.appendChild(y);
    g.setAttribute("onclick", "removeElement('myForm','id_" + i + "')");
    r.appendChild(g);
    r.setAttribute("id", "id_" + i);
    document.getElementById("myForm").appendChild(r);
}

function addTextAreaQuestion(){
    var r = document.createElement('span');
    var y = document.createElement("TEXTAREA");
    var g = document.createElement("IMG");
    y.setAttribute("cols", "17");
    y.setAttribute("placeholder", "message..");
    g.setAttribute("src", "delete.png");
    increment();
    y.setAttribute("Name", "textelement_" + i);
    r.appendChild(y);
    g.setAttribute("onclick", "removeElement('myForm','id_" + i + "')");
    r.appendChild(g);
    r.setAttribute("id", "id_" + i);
    document.getElementById("myForm").appendChild(r);
}