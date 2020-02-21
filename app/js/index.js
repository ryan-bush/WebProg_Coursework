let qID = 0;

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
    pa.id = "input" + qID;
    pa.name = "input" + qID;
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
    questionName.id = 'input' + qID;
    questionName.name = 'input' + qID;
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
