let obj = {};
let responses = [];
let sortedResponses = {};

function getSurveyId() {
    return window.location.hash.substring(1);
}

function showResults(res, resName) {
    obj = res;
    addTitle(res, resName, obj);
    mergeResults(obj);
    orderResults(responses);
    createDownloadLink();
    drawCharts();
}

function saveJSON(data, filename){

    if(!data) {
        console.error('No data')
        return;
    }

    if(!filename) filename = 'console.json'

    if(typeof data === "object"){
        data = JSON.stringify(data, undefined, 4)
    }

    var blob = new Blob([data], {type: 'text/json'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
}

function createDownloadLink() {
    console.log(sortedResponses);
    console.log( JSON.stringify(sortedResponses));
    let data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sortedResponses,null,2));
    //saveJSON(sortedResponses, "saved_data.json");

    //let file = new File(sortedResponses, "responses.json", {type: "text/json;charset=utf-8"});
    //FileSaver.saveAs(file);

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
        let x = document.createElement('canvas');
        x.id = 'chartResponse' + i;
        x.width = 200;
        x.height = 200;
        let y = document.getElementById('charts');
        y.appendChild(x);

        let a = occurrencesInArray(sortedResponses[i])
        console.log(sortedResponses.name);
        // Create Chart
        let myChart = new Chart(x, {
            type: 'pie',
            data: {
                labels: a[0],
                datasets: [{
                    label: '# of Votes',
                    data: a[1],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Custom Chart Title'
                },
            }
        });
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
        // Display on Page
        let a = document.createElement('p');
        let aA = document.createTextNode(sortedResponses[res[i].name]);
        a.appendChild(aA);
        document.getElementById("results").appendChild(a);
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
    let aA = document.createTextNode(JSON.stringify(responses));
    a.appendChild(aA);
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


function pageLoaded() {
    loadResults();
}

window.addEventListener('load', pageLoaded);