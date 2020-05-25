let surveys = {};

/**
 * Stores surveys and enables creation of tableelements
 */
function showAllSurveys() {
    surveys = JSON.parse(surveys);
    showTable()
}

/**
 * Creates HTML for survey table
 */
async function showTable() {
    let surveyElement = document.getElementById('surveys');
    let loading = document.createElement('p');
    loading.id = 'loadingText';
    let loadingText = document.createTextNode('Loading...');
    loading.appendChild(loadingText);
    surveyElement.appendChild(loading);

    let table = document.createElement('table');
    let tableHead = document.createElement('thead');
    let tableBody = document.createElement('tbody');
    let tableHeadingRow = document.createElement('tr');
    tableHeadingRow.classList = 'tableHead';
    let tableHeading1 = document.createElement('th');
    tableHeading1.classList = 'tableColumn1'
    let tableHeading2 = document.createElement('th');
    tableHeading2.classList = 'tableColumn2'
    let tableHeading3 = document.createElement('th');
    tableHeading3.classList = 'tableColumn3'
    let tableHeading4 = document.createElement('th');
    tableHeading4.classList = 'tableColumn4'
    let tableHeading5 = document.createElement('th');
    tableHeading5.classList = 'tableColumn5'
    let tableHeading6 = document.createElement('th');
    tableHeading6.classList = 'tableColumn6'
    let tableHeadingText1 = document.createTextNode('Survey ID');
    let tableHeadingText2 = document.createTextNode('Survey Name');
    let tableHeadingText3 = document.createTextNode('Survey Link');
    let tableHeadingText4 = document.createTextNode('Survey Responses');
    let tableHeadingText5 = document.createTextNode('Number of Responses');
    let tableHeadingText6 = document.createTextNode('Date');

    table.appendChild(tableHead);
    tableHead.appendChild(tableHeadingRow);
    tableHeadingRow.appendChild(tableHeading1);
    tableHeadingRow.appendChild(tableHeading2);
    tableHeadingRow.appendChild(tableHeading3);
    tableHeadingRow.appendChild(tableHeading4);
    tableHeadingRow.appendChild(tableHeading5);
    tableHeadingRow.appendChild(tableHeading6);
    tableHeading1.appendChild(tableHeadingText1);
    tableHeading2.appendChild(tableHeadingText2);
    tableHeading3.appendChild(tableHeadingText3);
    tableHeading4.appendChild(tableHeadingText4);
    tableHeading5.appendChild(tableHeadingText5);
    tableHeading6.appendChild(tableHeadingText6);
    table.appendChild(tableBody);

    for (let i = 0; i < surveys.length; i++) {
        let tableBodyRow = document.createElement('tr');
        let tableData1 = document.createElement('td');
        tableData1.classList = 'tableColumn1';
        let tableData2 = document.createElement('td');
        tableData2.classList = 'tableColumn2';
        let tableData3 = document.createElement('td');
        tableData3.classList = 'tableColumn3';
        let tableData4 = document.createElement('td');
        tableData4.classList = 'tableColumn4';
        let tableData5 = document.createElement('td');
        tableData5.classList = 'tableColumn5';
        let tableData6 = document.createElement('td');
        tableData6.classList = 'tableColumn6';
        let tableDataText1 = document.createTextNode(surveys[i].id);
        let name = await getSurveyName(surveys[i].id);
        let tableDataText2 = document.createTextNode(name);
        let tableDataText3 = document.createElement("a");
        let tableDataTextNode3 = document.createTextNode("View Survey");
        tableDataTextNode3.href = "survey#" + surveys[i].id;
        let tableDataText4 = document.createElement("a");
        let tableDataTextNode4 = document.createTextNode("View Responses");
        tableDataTextNode4.href = "results#" + surveys[i].id;
        let tableDataText5 = document.createTextNode(await getSurveyResponses(surveys[i].id));
        let tableDataText6 = document.createTextNode(surveys[i].time);
        tableBody.appendChild(tableBodyRow);
        tableBodyRow.appendChild(tableData1);
        tableBodyRow.appendChild(tableData2);
        tableBodyRow.appendChild(tableData3);
        tableBodyRow.appendChild(tableData4);
        tableBodyRow.appendChild(tableData5);
        tableBodyRow.appendChild(tableData6);
        tableData1.appendChild(tableDataText1);
        tableData2.appendChild(tableDataText2);
        tableData3.appendChild(tableDataText3);
        tableDataText3.appendChild(tableDataTextNode3);
        tableData4.appendChild(tableDataText4);
        tableDataText4.appendChild(tableDataTextNode4);
        tableData5.appendChild(tableDataText5);
        tableData6.appendChild(tableDataText6);
    }
    loading.parentNode.removeChild(loading);
    surveyElement.appendChild(table);
}

/**
 * Retrieves survey name from Server
 * @param  {String} id   ID of the survey
 * @return {String}      Name of the survey
 */
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

/**
 * Retrieves all survey responses and returns the amount
 * @param  {String} id   ID of the survey
 * @return {Number}      Number of responses
 */
async function getSurveyResponses(id) {
    const response = await fetch(`results/${id}`);
    let res;
    if (response.ok) {
        res = await response.json();
    } else {
        res = {msg: 'failed to load results :-('};
    }
    return res.length;
}

/**
 * Retrieves all surveys from the server
 */
async function loadAllSurveys() {
    const response = await fetch(`listSurveys`);
    if (response.ok) {
        surveys = await response.json();
    } else {
        surveys = {msg: 'failed to load survey :-('};
    }
    showAllSurveys();
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
    loadAllSurveys();
}
window.addEventListener('load', pageLoaded);