let mainSurvey = {}; // For the main survey data
let mainSurveyQuestions = {}; // For the main survey questions
let responses = []; // For all Responses
let sortedResponses = {}; // For Responses sorted by name
let subtleColours = ['#C6E2E9', '#BBD1EA', '#7286A0', '#4A6670',
    '#B8D4E3', '#666A86', '#6EB4D1', '#AED4E6',
    '#FEF6C9', '#FFCAAF', '#DAB894', '#BE6E46',
    '#56494C', '#918868', '#F0A868', '#FFC09F',
    '#C3E8BD', '#9DDBAD', '#A0AF84', '#668F80',
    '#DCEDB9', '#D2E59E', '#CBD081', '#6A8D73',
    '#D3C0D2', '#D6A2AD', '#67597A', '#544E61',
    '#855A5C', '#C57B57', '#F7DBA7', '#F9B9B7',
];

/**
 * Capitalize the first letter of a string
 * @param  {String} string  The string to capitalize
 * @return {String}         The string with the first letter as a capital
 */
const capitalize = (string) => {
    if (typeof string !== 'string') return ''
    return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * Returns an array of random colours based on a length
 * @param  {Number} numOfColours  The number of colours to return
 * @return {Array}               An array of colours
 */
const randomColour = (numOfColours) => {
    let colours = [];
    let lastNumber = 0;
    for(let i = 0; i < numOfColours; i++) {
        let random = getRandomIntInclusive(0, subtleColours.length -1);
        if (lastNumber == random) {
            random = getRandomIntInclusive(0, subtleColours.length -1);
            lastNumber = random;
        }
        lastNumber = random;
        console.log(random);
        colours.push(subtleColours[random]);
    }
    return colours;
}

/**
 * Returns a random integer
 * @param  {Number} min  The lowest number
 * @param  {Number} max  The highest number
 * @return {Number}      A random integer between min and max
 */
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

/**
 * Returns the survey ID from the hash substring
 * @return {String}          The Survey ID
 */
function getSurveyId() {
    return window.location.hash.substring(1);
}

/**
 * Handles the generation of the page
 * @param  {Object} res         An array of all responses for the survey
 * @param  {String} resName     The survey name
 * @param  {Object} resSurvey   An array of the survey data
 */
function showResults(res, resName, resSurvey) {
    mainSurvey = resSurvey;
    mainSurveyQuestions = JSON.parse(resSurvey.json);
    mainSurveyQuestions = mainSurveyQuestions.questions;
    addTitle(res, resName);
    addManageSection();
    mergeResults(res);
    orderResults(responses);
    createDownloadLink();
    showResponses();
}

/**
 * Adds password  input to page
 */
function addManageSection() {
    let manageSection = document.getElementById('manage');
    let passwordLabel = document.createElement('label');
    let passwordLabelText = document.createTextNode('Enter survey password to manage this survey');
    let passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'surveyPassword';

    manageSection.appendChild(passwordLabel);
    passwordLabel.appendChild(passwordLabelText);
    manageSection.appendChild(passwordInput);

    let passwordSubmitButton = document.createElement('button');
    passwordSubmitButton.id = 'submitPassword';
    passwordSubmitButton.classList = 'buttonPrimary';
    let passwordSubmitButtonText = document.createTextNode('Submit');
    manageSection.appendChild(passwordSubmitButton);
    passwordSubmitButton.appendChild(passwordSubmitButtonText);
    passwordSubmitButton.addEventListener("click", function(){ checkPassword(); });

}

/**
 * Retrieves password from server and checks agains entered password
 */
async function checkPassword() {
    let password = document.getElementById('surveyPassword').value;
    let manageSection = document.getElementById('manage');

    const id = getSurveyId();
    const response = await fetch(`passwords/${id}`);
    let pass;
    if (response.ok) {
        pass = await response.json();
    } else {
        pass = {msg: 'failed to load password :-('};
    }
    if (password === pass.password) {
        manageSection.innerHTML = "";
        passwordCorrect();
    } else {
        let passwordError = document.createElement('p');
        let passwordErrorText = document.createTextNode('Password entered is incorrect.');
        passwordError.id = 'passwordError';
        passwordError.classList = 'errorText';
        manageSection.appendChild(passwordError);
        passwordError.appendChild(passwordErrorText);
    }
}

/**
 * Display open/close survey buttons
 */
function passwordCorrect() {
    let manageSection = document.getElementById('manage');

    if (mainSurvey.open === 1) {
        let closeButton = document.createElement('button');
        let closeButtonText = document.createTextNode('Close Survey');
        closeButton.id = 'closeButton';
        closeButton.classList = 'buttonRed';
        manageSection.appendChild(closeButton);
        closeButton.appendChild(closeButtonText);
        closeButton.addEventListener("click", function(){ closeSurvey(); });
    } else {
        let openButton = document.createElement('button');
        let openButtonText = document.createTextNode('Open Survey');
        openButton.id = 'closeButton';
        openButton.classList = 'buttonSecondary';
        manageSection.appendChild(openButton);
        openButton.appendChild(openButtonText);
        openButton.addEventListener("click", function(){ openSurvey(); });
    }
    let deleteButton = document.createElement('button');
    let deleteButtonText = document.createTextNode('Delete Survey');
    deleteButton.id = 'deleteButton';
    deleteButton.classList = 'buttonRed';
    manageSection.appendChild(deleteButton);
    deleteButton.appendChild(deleteButtonText);
    deleteButton.addEventListener("click", function(){ deleteSurvey(); })
}

async function deleteSurvey() {
    const id = getSurveyId();
    const response = await fetch(`delete/${id}`);
    let deleteSurvey;
    if (response.ok) {
        deleteSurvey = await response.json();
    } else {
        deleteSurvey = {msg: 'failed to delete survey :-('};
    }
    console.log(deleteSurvey);
}

/**
 * Sends a request tot he server to close the server
 */
async function closeSurvey() {
    const id = getSurveyId();
    const response = await fetch(`close/${id}`);
    let close;
    if (response.ok) {
        close = await response.json();
    } else {
        close = {msg: 'failed to close survey :-('};
    }
    toggleButton(0);
}

/**
 * Sends a request to the server to open the survey
 */
async function openSurvey() {
    const id = getSurveyId();
    const response = await fetch(`open/${id}`);
    let open;
    if (response.ok) {
        open = await response.json();
    } else {
        open = {msg: 'failed to open survey :-('};
    }
    toggleButton(1);
}

/**
 * Toggles the state of the open/close survey button
 * @param  {Integer} open  0 = closed survey, 1 = open survey
 */
function toggleButton(open) {
    let manageSection = document.getElementById('manage');
    manageSection.innerHTML = "";

    if (open === 1) {
        let closeButton = document.createElement('button');
        let closeButtonText = document.createTextNode('Close Survey');
        closeButton.id = 'closeButton';
        closeButton.classList = 'buttonRed';
        manageSection.appendChild(closeButton);
        closeButton.appendChild(closeButtonText);
        closeButton.addEventListener("click", function(){ closeSurvey(); });
    } else {
        let openButton = document.createElement('button');
        let openButtonText = document.createTextNode('Open Survey');
        openButton.id = 'closeButton';
        openButton.classList = 'buttonSecondary';
        manageSection.appendChild(openButton);
        openButton.appendChild(openButtonText);
        openButton.addEventListener("click", function(){ openSurvey(); });
    }
}

/**
 * Gets a full question from the  question id
 * @param  {String} name  The ID of the question
 * @return {String}       The whole question
 */
function getQuestionFromName(name) {
    for (let i = 0; i < mainSurveyQuestions.length; i++) {
        if (mainSurveyQuestions[i].id === name) {
            return mainSurveyQuestions[i].text;
        }
    }
}

/**
 * Generates the HTML code for each question in the survey
 */
function showResponses() {
    for (let i in sortedResponses) {
        // Generate Response Section
        let responseSection = document.createElement('section');
        responseSection.id = 'responses' + i;
        document.getElementById("results").appendChild(responseSection);

        // Organised Responses
        let organisedResponses = occurrencesInArray(sortedResponses[i])

        // Generate Response Table Heading HTML
        let heading = document.createElement('h3');
        let headingText = document.createTextNode(capitalize(i));
        heading.appendChild(headingText);

        // Generate Response Table HTML
        let responseTable = document.createElement('table');
        let tableHeadingRow = document.createElement('tr');
        let tableHeadingRow1 = document.createElement('th');
        let tableHeadingRow2 = document.createElement('th');
        let tableHeadingText1 = document.createTextNode('Response');
        let tableHeadingText2 = document.createTextNode('Total');

        responseTable.appendChild(tableHeadingRow);
        tableHeadingRow.appendChild(tableHeadingRow1);
        tableHeadingRow.appendChild(tableHeadingRow2);
        tableHeadingRow1.appendChild(tableHeadingText1);
        tableHeadingRow2.appendChild(tableHeadingText2);

        // Loop through all organised responses
        for (j in organisedResponses[0]) {
            let tableBodyRow = document.createElement('tr');
            let tableRow1 = document.createElement('td');
            let tableRow2 = document.createElement('td');
            let tableRowText1 = document.createTextNode(organisedResponses[0][j]);
            let tableRowText2 = document.createTextNode(organisedResponses[1][j]);
            responseTable.appendChild(tableBodyRow);
            tableBodyRow.appendChild(tableRow1);
            tableBodyRow.appendChild(tableRow2);
            tableRow1.appendChild(tableRowText1);
            tableRow2.appendChild(tableRowText2);
        }

        responseSection.appendChild(heading);
        responseSection.appendChild(responseTable);

        // Generate Chart Toggle Buttons HTML
        let chartButtons = document.createElement('section');
        chartButtons.id = "chartButtons";
        // Bar Chart
        let chartButtonBar = document.createElement('button');
        let chartButtonBarText = document.createTextNode('Bar Chart');
        chartButtonBar.id = 'chartButtonBar';
        chartButtonBar.classList = 'buttonSmall';
        chartButtons.appendChild(chartButtonBar);
        chartButtonBar.appendChild(chartButtonBarText);
        // Horizontal Bar Chart
        let chartButtonHorBar = document.createElement('button');
        let chartButtonHorBarText = document.createTextNode('Horizontal Bar Chart');
        chartButtonHorBar.id = 'chartButtonHorBar';
        chartButtonHorBar.classList = 'buttonSmall';
        chartButtons.appendChild(chartButtonHorBar);
        chartButtonHorBar.appendChild(chartButtonHorBarText);
        // Pie Chart
        let chartButtonPie = document.createElement('button');
        let chartButtonPieText = document.createTextNode('Pie Chart');
        chartButtonPie.id  = 'chartButtonPie';
        chartButtonPie.classList = 'buttonSmall';
        chartButtons.appendChild(chartButtonPie);
        chartButtonPie.appendChild(chartButtonPieText);
        // Pie Chart
        let chartButtonDonut = document.createElement('button');
        let chartButtonDonutText = document.createTextNode('Donut Chart');
        chartButtonDonut.id  = 'chartButtonDonut';
        chartButtonDonut.classList = 'buttonSmall';
        chartButtons.appendChild(chartButtonDonut);
        chartButtonDonut.appendChild(chartButtonDonutText);

        responseSection.appendChild(chartButtons);

        chartButtonBar.addEventListener("click", function(){ showBarChart(i, organisedResponses[0], organisedResponses[1]); });
        chartButtonHorBar.addEventListener("click", function(){ showHorizontalBarChart(i, organisedResponses[0], organisedResponses[1]); });
        chartButtonPie.addEventListener("click", function(){ showPieChart(i, organisedResponses[0], organisedResponses[1]); });
        chartButtonDonut.addEventListener("click", function(){ showDonutChart(i, organisedResponses[0], organisedResponses[1]); });

        // Generate Chart Canvas HTML
        let canvas = document.createElement('canvas');
        canvas.id = 'chartResponse' + i;
        responseSection.appendChild(canvas);

        // Create Chart
        let myChart = new Chart(canvas, {
            type: 'pie',
            data: {
                labels: organisedResponses[0],
                datasets: [{
                    label: '# of Votes',
                    data: organisedResponses[1],
                    backgroundColor: randomColour(organisedResponses[0].length),
                    borderWidth: 1
                }]
            },
            options: {
                responsive:true,
                title: {
                    display: true,
                    text: 'Responses for ' + getQuestionFromName(i)
                },
            }
        });
    }
}

/**
 * Changes generated chart for response into bar chart
 * @param  {String} name                The ID of the question
 * @param  {Array} responseAnswers      Answers for the question
 * @param  {Array} responseOccurrences  Occurrences of each response
 */
function showBarChart(name, responseAnswers, responseOccurrences) {
    // Remove existing chart from response
    let response = document.getElementById('responses' + name);
    let chart = document.getElementById('chartResponse' + name);
    chart.parentNode.removeChild(chart);

    // Generate Chart Canvas HTML
    let canvas = document.createElement('canvas');
    canvas.id = 'chartResponse' + name;
    response.appendChild(canvas);

    // Create Chart
    let myChart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: responseAnswers,
            datasets: [{
                label: '# of Responses',
                data: responseOccurrences,
                backgroundColor: randomColour(responseAnswers.length),
                borderWidth: 1,
                scaleStartValue: 0
            }]
        },
        options: {
            responsive:true,
            title: {
                display: true,
                text: 'Responses for ' + getQuestionFromName(name)
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

/**
 * Changes generated chart for response into horizontal bar chart
 * @param  {String} name                The ID of the question
 * @param  {Array} responseAnswers      Answers for the question
 * @param  {Array} responseOccurrences  Occurrences of each response
 */
function showHorizontalBarChart(name, responseAnswers, responseOccurrences) {
    // Remove existing chart from response
    let response = document.getElementById('responses' + name);
    let chart = document.getElementById('chartResponse' + name);
    chart.parentNode.removeChild(chart);

    // Generate Chart Canvas HTML
    let canvas = document.createElement('canvas');
    canvas.id = 'chartResponse' + name;
    response.appendChild(canvas);

    // Create Chart
    let myChart = new Chart(canvas, {
        type: 'horizontalBar',
        data: {
            labels: responseAnswers,
            datasets: [{
                label: '# of Responses',
                data: responseOccurrences,
                backgroundColor: randomColour(responseAnswers.length),
                borderWidth: 1,
                scaleStartValue: 0
            }]
        },
        options: {
            responsive:true,
            title: {
                display: true,
                text: 'Responses for ' + getQuestionFromName(name)
            },
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

/**
 * Changes generated chart for response into pie chart
 * @param  {String} name                The ID of the question
 * @param  {Array} responseAnswers      Answers for the question
 * @param  {Array} responseOccurrences  Occurrences of each response
 */
function showPieChart(name, responseAnswers, responseOccurrences) {
    // Remove existing chart from response
    let response = document.getElementById('responses' + name);
    let chart = document.getElementById('chartResponse' + name);
    chart.parentNode.removeChild(chart);

    // Generate Chart Canvas HTML
    let canvas = document.createElement('canvas');
    canvas.id = 'chartResponse' + name;
    response.appendChild(canvas);

    // Create Chart
    let myChart = new Chart(canvas, {
        type: 'pie',
        data: {
            labels: responseAnswers,
            datasets: [{
                label: '# of Responses',
                data: responseOccurrences,
                backgroundColor: randomColour(responseAnswers.length),
                borderWidth: 1
            }]
        },
        options: {
            responsive:true,
            title: {
                display: true,
                text: 'Responses for ' + getQuestionFromName(name)
            },
        }
    });
}

/**
 * Changes generated chart for response into donut chart
 * @param  {String} name                The ID of the question
 * @param  {Array} responseAnswers      Answers for the question
 * @param  {Array} responseOccurrences  Occurrences of each response
 */
function showDonutChart(name, responseAnswers, responseOccurrences) {
    // Remove existing chart from response
    let response = document.getElementById('responses' + name);
    let chart = document.getElementById('chartResponse' + name);
    chart.parentNode.removeChild(chart);

    // Generate Chart Canvas HTML
    let canvas = document.createElement('canvas');
    canvas.id = 'chartResponse' + name;
    response.appendChild(canvas);

    // Create Chart
    let myChart = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: responseAnswers,
            datasets: [{
                label: '# of Responses',
                data: responseOccurrences,
                backgroundColor: randomColour(responseAnswers.length),
                borderWidth: 1
            }]
        },
        options: {
            responsive:true,
            title: {
                display: true,
                text: 'Responses for ' + getQuestionFromName(name)
            },
        }
    });
}

/**
 * Creates the Download HTML for the responses
 */
function createDownloadLink() {
    let data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sortedResponses,null,2));

    // Create HTML Download link
    let a = document.createElement('a');
    a.classList = 'buttonSecondary';
    a.href = 'data:' + data;
    a.download = 'data.json';
    a.innerHTML = 'Download JSON';

    //Generates it onto the page
    let container = document.getElementById('download');
    container.appendChild(a);
}

/**
 * Returns two arrays of results and occurrences of results
 * @param  {Array} responses  The array of each response
 * @return {Array}            An array of results
 * @return {Array}            An array of occurrences of results
 */
function occurrencesInArray(responses) {
    let a = [], b = [], prev;

    responses.sort();
    for (let i = 0; i < responses.length; i++ ) {
        if ( responses[i] !== prev ) {
            a.push(responses[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = responses[i];
    }
    return [a, b];
}

/**
 * Orders the results into a sorted array
 * @param  {Array} res  The array of each response
 */
function orderResults(res) {
    res = JSON.parse(res);
    for (let i = 0; i < res.length; i++) {
        if(sortedResponses[res[i].name] === undefined || sortedResponses[res[i].name].length === 0) {
            sortedResponses[res[i].name] = [ res[i].value ];
        } else {
            sortedResponses[res[i].name].push(res[i].value);
        }
    }
}

/**
 * Orders the results into a sorted array
 * @param  {Object} res  The array of each response
 */
function mergeResults(res) {
    for (let i = 0; i < res.length; i++) {
        let iRes = JSON.parse(res[i].json);
        for (let j = 0; j < iRes.length; j++) {
            responses.push(iRes[j]);
        }
    }
    // Display on Page
    let totalResponses = document.createElement('p');
    let totalResponsesText = document.createTextNode('Total Responses: ' + res.length);
    totalResponses.appendChild(totalResponsesText);
    document.getElementById("results").appendChild(totalResponses);
    responses = JSON.stringify(responses);
}

/**
 * Adds Title, ID and Date to page
 * @param  {Array}  res         The array of each response
 * @param  {String} resName     The Survey name
 */
function addTitle(res, resName) {
    let heading = document.createElement('h1');
    let headingText = document.createTextNode(resName);
    heading.appendChild(headingText);

    let smallTime = document.createElement('small');
    let smallTimeText = document.createTextNode("Survey Time: " + mainSurvey.time);
    smallTime.appendChild(smallTimeText);

    let smallName = document.createElement('small');
    let smallNameText = document.createTextNode("Survey ID: " + res[0].surveyID);
    smallName.appendChild(smallNameText);

    document.getElementById("title").appendChild(heading);
    document.getElementById("title").appendChild(smallTime);
    document.getElementById("title").appendChild(smallName);
}

/**
 * Shows survey not exists
 */
function showNonExistSurvey() {
    let surveySection = document.getElementById('results');
    let heading = document.createElement('h1');
    let headingText = document.createTextNode('Sorry, this survey does not exist.');
    surveySection.appendChild(heading);
    heading.appendChild(headingText);
}


/**
 * Load the survey from teh server
 */
async function loadSurvey() {
    const id = getSurveyId();
    const response = await fetch(`surveys/${id}`);
    let resSurvey;
    if (response.ok) {
        resSurvey = await response.json();
        loadResults(resSurvey);
    } else {
        showNonExistSurvey();
    }
}

/**
 * Fetches all results, name and survey from server
 */
async function loadResults(resSurvey) {
    const id = getSurveyId();
    // Fetch Survey Results
    const response = await fetch(`results/${id}`);
    let res;
    if (response.ok) {
        res = await response.json();
    } else {
        showNonExistSurvey();
    }
    if(res.length === 0) {
        showNoResponses();
    } else {
        // Fetch Survey Name
        const responseName = await fetch(`name/${id}`);
        let resName;
        if (responseName.ok) {
            resName = await responseName.json();
        } else {
            resName = { msg: 'failed to load name :-(' };
        }
        showResults(res, resName, resSurvey);
    }
}

/**
 * Adds Text for no responses to page
 */
function showNoResponses() {
    let heading = document.createElement('h2');
    let headingText = document.createTextNode("This survey has no responses");
    heading.appendChild(headingText);
    document.getElementById("title").appendChild(heading);
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
 * Called once page is loaded
 */
function pageLoaded() {
    loadSurvey();
}
window.addEventListener('load', pageLoaded);