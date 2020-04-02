let qID = 0; // Question ID

let selectOption = [];

let i = 0; /* Set Global Variable i */
function increment(){
    i += 1; /* Function for automatic increment of field's "Name" attribute. */
}

let iS = 0; /* Set Global Variable i */
function incrementSelect(){
    iS += 1; /* Function for automatic increment of field's "Name" attribute. */
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

const isValidElement = element => {
    return element.name && element.value;
};
/**
 * Retrieves input data from a form and returns it as a JSON object.
 * @param  {HTMLFormControlsCollection} elements  the form elements
 * @return {Object}                               form data as an object literal
 */
const formToJSON = elements => [].reduce.call(elements, (data, element) => {
    if (isValidElement(element)) {
        data[element.name] = element.value;
    }
    console.log(data[element.value]);
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
    let r = document.createElement('div');
    let y = document.createElement("INPUT");
    y.setAttribute("type", "text");

    y.setAttribute("placeholder", "Question");
    let g = document.createElement("IMG");
    g.setAttribute("src", "delete.png");
    increment();
    y.setAttribute("id", "id_" + i);
    y.setAttribute("name", "id_" + i);
    r.appendChild(y);
    g.setAttribute("onclick", "removeElement('myForm','id_" + i + "')");
    r.appendChild(g);
    r.setAttribute("id", "id_" + i);
    document.getElementById("myForm").appendChild(r);
}

function addNumberQuestion() {
    let r = document.createElement('div');
    let y = document.createElement("INPUT");
    y.setAttribute("type", "number");

    y.setAttribute("placeholder", "Number Question");
    let g = document.createElement("IMG");
    g.setAttribute("src", "delete.png");
    increment();
    y.setAttribute("id", "id_" + i);
    y.setAttribute("name", "id_" + i);
    r.appendChild(y);
    g.setAttribute("onclick", "removeElement('myForm','id_" + i + "')");
    r.appendChild(g);
    r.setAttribute("id", "id_" + i);
    document.getElementById("myForm").appendChild(r);
}

function addTextAreaQuestion(){
    let r = document.createElement('div');
    let y = document.createElement("INPUT");
    let g = document.createElement("IMG");
    y.setAttribute("placeholder", "Question");
    g.setAttribute("src", "delete.png");
    increment();
    y.setAttribute("id", "id_" + i);
    y.setAttribute("name", "id_" + i);
    r.appendChild(y);
    g.setAttribute("onclick", "removeElement('myForm','id_" + i + "')");
    r.appendChild(g);
    r.setAttribute("id", "id_" + i);
    document.getElementById("myForm").appendChild(r);
}

function addSelectQuestion() {
    let r = document.createElement('div');
    let y = document.createElement("INPUT");
    let g = document.createElement("IMG");
    let b = document.createElement("IMG");

    y.setAttribute("type", "text");
    y.setAttribute("placeholder", "Question");
    y.setAttribute("id", "id_" + i);
    y.setAttribute("name", "id_" + i);
    r.appendChild(y);
    increment();
    b.setAttribute("src", "add.png");
    b.setAttribute("onclick", "addSelectOption(" + i + ")");
    r.appendChild(b);

    g.setAttribute("src", "delete.png");
    g.setAttribute("onclick", "removeElement('myForm','id_" + i + "')");
    r.appendChild(g);
    r.setAttribute("id", "id_" + i);
    document.getElementById("myForm").appendChild(r);
    addSelectOption(i);

}

function addSelectOption(id) {
    let r = document.createElement('div');
    let y = document.createElement("INPUT");
    let g = document.createElement("IMG");
    selectOption.push([id, iS]);
    incrementSelect();
    y.setAttribute("type", "text");
    y.setAttribute("placeholder", "Option");
    r.appendChild(y);

    g.setAttribute("src", "delete.png");
    g.setAttribute("onclick", "removeSelectElement('id_" + id + "','sId_" + iS + "')");
    r.appendChild(g);
    r.setAttribute("id", "sId_" + iS);
    document.getElementById("id_" + id).appendChild(r);
}

function removeSelectElement(parentDiv, childDiv){
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

function resetElements(){
    document.getElementById('myForm').innerHTML = '';
}