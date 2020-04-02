let uploadedJSON = {};

document.getElementById('import').onclick = function() {
    let files = document.getElementById('upJSON').files;
    console.log(files);
    if (files.length <= 0) {
        return false;
    }

    let fr = new FileReader();

    fr.onload = function(e) {
        console.log(e);
        uploadedJSON = JSON.parse(e.target.result);
        console.log(uploadedJSON);
        let formatted = JSON.stringify(uploadedJSON, null, 2);
        document.getElementById('result').value = formatted;
    };

    fr.readAsText(files.item(0));

    addForm(formatted);
};
function addForm(formatted) {
    console.log(formatted.name[0]);

}