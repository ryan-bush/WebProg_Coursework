let obj = {};
let responses = [];
let sortedResponses = {};
let chartColours = ['#ff6385', '#36a3eb', '#ffcf56', '#4bc0c0', '#ff4040', '#ffa940', '#5040ff', '#40ff63',
    '#9966ff', '#ffa040', '#ff40a3', '#4063ff', '#dfff40'];
const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

function getSurveyId() {
    return window.location.hash.substring(1);
}

function showResults(res, resName) {
    obj = res;
    addTitle(res, resName, obj);
    mergeResults(obj);
    orderResults(responses);
    createDownloadLink();
    showResponses();
}
function showResponses() {
    for (let i in sortedResponses) {
        let d = document.createElement('div');
        d.id = 'responses' + i;
        document.getElementById("results").appendChild(d);


        let a = occurrencesInArray(sortedResponses[i])

        let t = document.createElement('h3');
        let tT = document.createTextNode(capitalize(i));
        t.appendChild(tT);

        let table = document.createElement('table');
        let tR = document.createElement('tr');
        let tH1 = document.createElement('th');
        let tH2 = document.createElement('th');
        let tH11 = document.createTextNode('Response');
        let tH21 = document.createTextNode('Total');

        table.appendChild(tR);
        tR.appendChild(tH1);
        tR.appendChild(tH2);
        tH1.appendChild(tH11);
        tH2.appendChild(tH21);

        for (j in a[0]) {
            let tRow = document.createElement('tr');
            let tD1 = document.createElement('td');
            let tD2 = document.createElement('td');
            let tD11 = document.createTextNode(a[0][j]);
            let tD21 = document.createTextNode(a[1][j]);
            table.appendChild(tRow);
            tRow.appendChild(tD1);
            tRow.appendChild(tD2);
            tD1.appendChild(tD11);
            tD2.appendChild(tD21);
        }

        d.appendChild(t);
        d.appendChild(table);

        let chartButtons = document.createElement('div');
        chartButtons.id = "chartButtons";
        // Bar Chart
        let chartButtonBar = document.createElement('button');
        let chartButtonBarText = document.createTextNode('Bar Chart');
        chartButtonBar.id = 'chartButtonBar';
        chartButtons.appendChild(chartButtonBar);
        chartButtonBar.appendChild(chartButtonBarText);
        // Horizontal Bar Chart
        let chartButtonHorBar = document.createElement('button');
        let chartButtonHorBarText = document.createTextNode('Horizontal Bar Chart');
        chartButtonHorBar.id = 'chartButtonHorBar';
        chartButtons.appendChild(chartButtonHorBar);
        chartButtonHorBar.appendChild(chartButtonHorBarText);
        // Pie Chart
        let chartButtonPie = document.createElement('button');
        let chartButtonPieText = document.createTextNode('Pie Chart');
        chartButtonPie.id  = 'chartButtonPie';
        chartButtons.appendChild(chartButtonPie);
        chartButtonPie.appendChild(chartButtonPieText);
        // Pie Chart
        let chartButtonDonut = document.createElement('button');
        let chartButtonDonutText = document.createTextNode('Donut Chart');
        chartButtonDonut.id  = 'chartButtonDonut';
        chartButtons.appendChild(chartButtonDonut);
        chartButtonDonut.appendChild(chartButtonDonutText);

        d.appendChild(chartButtons);

        chartButtonBar.addEventListener("click", function(){ showBarChart(i, a[0], a[1]); });
        chartButtonHorBar.addEventListener("click", function(){ showHorizontalBarChart(i, a[0], a[1]); });
        chartButtonPie.addEventListener("click", function(){ showPieChart(i, a[0], a[1]); });
        chartButtonDonut.addEventListener("click", function(){ showDonutChart(i, a[0], a[1]); });

        let x = document.createElement('canvas');
        x.id = 'chartResponse' + i;
        d.appendChild(x);
        // Create Chart
        let myChart = new Chart(x, {
            type: 'pie',
            data: {
                labels: a[0],
                datasets: [{
                    label: '# of Votes',
                    data: a[1],
                    backgroundColor: chartColours,
                    borderWidth: 1
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Responses for ' + capitalize(i)
                },
            }
        });
    }
}

function showBarChart(i, a, b) {
    let response = document.getElementById('responses' + i);
    let chart = document.getElementById('chartResponse' + i);
    chart.parentNode.removeChild(chart);

    let x = document.createElement('canvas');
    x.id = 'chartResponse' + i;
    response.appendChild(x);
    let myChart = new Chart(x, {
        type: 'bar',
        data: {
            labels: a,
            datasets: [{
                label: '# of Responses',
                data: b,
                backgroundColor: chartColours,
                borderWidth: 1,
                scaleStartValue: 0
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Responses for ' + capitalize(i)
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

function showHorizontalBarChart(i, a, b) {
    let response = document.getElementById('responses' + i);
    let chart = document.getElementById('chartResponse' + i);
    chart.parentNode.removeChild(chart);

    let x = document.createElement('canvas');
    x.id = 'chartResponse' + i;
    response.appendChild(x);
    let myChart = new Chart(x, {
        type: 'horizontalBar',
        data: {
            labels: a,
            datasets: [{
                label: '# of Responses',
                data: b,
                backgroundColor: chartColours,
                borderWidth: 1,
                scaleStartValue: 0
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Responses for ' + capitalize(i)
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

function showPieChart(i, a, b) {
    let response = document.getElementById('responses' + i);
    let chart = document.getElementById('chartResponse' + i);
    chart.parentNode.removeChild(chart);

    let x = document.createElement('canvas');
    x.id = 'chartResponse' + i;
    response.appendChild(x);
    let myChart = new Chart(x, {
        type: 'pie',
        data: {
            labels: a,
            datasets: [{
                label: '# of Responses',
                data: b,
                backgroundColor: chartColours,
                borderWidth: 1
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Responses for ' + capitalize(i)
            },
        }
    });
}

function showDonutChart(i, a, b) {
    let response = document.getElementById('responses' + i);
    let chart = document.getElementById('chartResponse' + i);
    chart.parentNode.removeChild(chart);

    let x = document.createElement('canvas');
    x.id = 'chartResponse' + i;
    response.appendChild(x);
    let myChart = new Chart(x, {
        type: 'doughnut',
        data: {
            labels: a,
            datasets: [{
                label: '# of Responses',
                data: b,
                backgroundColor: chartColours,
                borderWidth: 1
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Responses for ' + capitalize(i)
            },
        }
    });
}

function createDownloadLink() {
    let data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sortedResponses,null,2));

    let a = document.createElement('a');
    a.href = 'data:' + data;
    a.download = 'data.json';
    a.innerHTML = 'download JSON';

    let container = document.getElementById('download');
    container.appendChild(a);
}

function drawCharts() {
    for(let i in sortedResponses) {
        // Create Chart Canvas

    }
}

function occurrencesInArray(arr) {
    let a = [], b = [], prev;

    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = arr[i];
    }

    return [a, b];
}

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

function mergeResults(res) {
    for (let i = 0; i < res.length; i++) {
        let iRes = JSON.parse(res[i].json);
        for (let j = 0; j < iRes.length; j++) {
            responses.push(iRes[j]);
        }
    }
    // Display on Page
    let a = document.createElement('p');
    // let aA = document.createTextNode(JSON.stringify(responses));
    // a.appendChild(aA);
    let r = document.createTextNode('Total Responses: ' + res.length);
    a.appendChild(r);
    document.getElementById("results").appendChild(a);
    responses = JSON.stringify(responses);
}

function addTitle(res, resName, obj) {
    let t = document.createElement('h2');
    let tT = document.createTextNode(resName);
    t.appendChild(tT);

    let s = document.createElement('small');
    let sT = document.createTextNode(res[0].time)
    s.appendChild(sT);

    let r = document.createElement('small');
    let rT = document.createTextNode(res[0].surveyID);
    r.appendChild(rT);

    document.getElementById("title").appendChild(t);
    document.getElementById("title").appendChild(s);
    document.getElementById("title").appendChild(r);
}

async function loadResults() {
    const id = getSurveyId();
    // Fetch Survey Results
    const response = await fetch(`results/${id}`);
    let res;
    if (response.ok) {
        res = await response.json();
    } else {
        res = { msg: 'failed to load results :-(' };
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
        showResults(res, resName);
    }
}

function showNoResponses() {
    let heading = document.createElement('h2');
    let headingText = document.createTextNode("This survey has no responses");
    heading.appendChild(headingText);

    document.getElementById("title").appendChild(heading);
}

function pageLoaded() {
    loadResults();
}

window.addEventListener('load', pageLoaded);