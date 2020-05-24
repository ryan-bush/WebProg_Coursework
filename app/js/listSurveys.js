let surveys = {};

function showAllSurveys() {
    surveys = JSON.parse(surveys);
    showTable()
}

async function showTable() {
    let surveyElement = document.getElementById('surveys');
    let table = document.createElement('table');
    let tableHead = document.createElement('thead');
    let tableBody = document.createElement('tbody');
    let tR = document.createElement('tr');
    tR.class = 'tableHead';
    let tH1 = document.createElement('th');
    tH1.class = 'tableColumn1'
    let tH2 = document.createElement('th');
    tH2.class = 'tableColumn2'
    let tH3 = document.createElement('th');
    tH3.class = 'tableColumn3'
    let tH4 = document.createElement('th');
    tH4.class = 'tableColumn4'
    let tH5 = document.createElement('th');
    tH5.class = 'tableColumn5'
    let tH11 = document.createTextNode('Survey ID');
    let tH21 = document.createTextNode('Survey Name');
    let tH31 = document.createTextNode('Survey Link');
    let tH41 = document.createTextNode('Survey Responses');
    let tH51 = document.createTextNode('Date');

    table.appendChild(tableHead);
    tableHead.appendChild(tR);
    tR.appendChild(tH1);
    tR.appendChild(tH2);
    tR.appendChild(tH3);
    tR.appendChild(tH4);
    tR.appendChild(tH5);
    tH1.appendChild(tH11);
    tH2.appendChild(tH21);
    tH3.appendChild(tH31);
    tH4.appendChild(tH41);
    tH5.appendChild(tH51);
    table.appendChild(tableBody);

    for (let i = 0; i < surveys.length; i++) {
        let tRow = document.createElement('tr');
        let tD1 = document.createElement('td');
        tD1.class = 'tableColumn1';
        let tD2 = document.createElement('td');
        tD2.class = 'tableColumn2';
        let tD3 = document.createElement('td');
        tD3.class = 'tableColumn3';
        let tD4 = document.createElement('td');
        tD4.class = 'tableColumn4';
        let tD5 = document.createElement('td');
        tD5.class = 'tableColumn5';
        let tD11 = document.createTextNode(surveys[i].id);
        let name = await getSurveyName(surveys[i].id);
        let tD21 = document.createTextNode(name);
        let tD31 = document.createElement("a");
        let tD32 = document.createTextNode("View Survey");
        tD31.href = "survey#" + surveys[i].id;
        let tD41 = document.createElement("a");
        let tD42 = document.createTextNode("View Responses");
        tD41.href = "results#" + surveys[i].id;
        let tD51 = document.createTextNode(surveys[i].time);
        tableBody.appendChild(tRow);
        tRow.appendChild(tD1);
        tRow.appendChild(tD2);
        tRow.appendChild(tD3);
        tRow.appendChild(tD4);
        tRow.appendChild(tD5);
        tD1.appendChild(tD11);
        tD2.appendChild(tD21);
        tD3.appendChild(tD31);
        tD31.appendChild(tD32);
        tD4.appendChild(tD41);
        tD41.appendChild(tD42);
        tD5.appendChild(tD51);
    }
    surveyElement.appendChild(table);
}

async function getSurveyName(id) {
    const response = await fetch(`surveys/${id}`);
    let survey;
    if (response.ok) {
        survey = await response.json();
    } else {
        survey = { msg: 'failed to load survey :-(' };
    }
    survey = JSON.parse(survey.json);
    let surveyName = survey.name;
    if (surveyName === undefined || surveyName === null) surveyName = "no survey name :-(";
    return surveyName;
}

async function loadAllSurveys() {
    const response = await fetch(`listSurveys`);
    if (response.ok) {
        surveys = await response.json();
    } else {
        surveys = {msg: 'failed to load survey :-('};
    }
    showAllSurveys();
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
    loadAllSurveys();
}

window.addEventListener('load', pageLoaded);