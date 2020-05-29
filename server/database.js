'use strict';
const sqlite = require('sqlite');
const uuid = require('uuid-random');

async function init() {
    const db = await sqlite.open('./database.sqlite', { verbose: true });
    await db.migrate({ migrationsPath: './server/migrations' });
    return db;
}

const dbConn = init();

async function listSurveys() {
    const db = await dbConn;
    const surveys = await db.all('SELECT * FROM Surveys ORDER BY time DESC LIMIT 100');
    return surveys;
}

async function addPassword(pass, id) {
    const db = await dbConn;
    await db.run('UPDATE Surveys SET password = ? WHERE id = ?', pass, id);
    return 1;
}

async function checkPassword(id) {
    const db = await dbConn;
    const pass = db.get('SELECT password FROM Surveys WHERE id = ?', id);
    return pass;
}

async function openSurvey(id) {
    const db = await dbConn;
    await db.run('UPDATE Surveys SET open = 1 WHERE id = ?', id);
    return 1;
}

async function closeSurvey(id) {
    const db = await dbConn;
    await db.run('UPDATE Surveys SET open = 0 WHERE id = ?', id);
    return 1;
}

async function findSurvey(id) {
    const db = await dbConn;
    const svy = db.get('SELECT * FROM Surveys WHERE id = ?', id);
    return svy;
}

async function addSurvey(svy) {
    const db = await dbConn;
    const id = uuid();
    const time = currentTime();
    await db.run('INSERT INTO Surveys (id, time, json) VALUES (?, ?, ?)', [id, time, JSON.stringify(svy)]);

    return id;
}

async function addResult(res, id) {
    const db = await dbConn;
    const time = currentTime();
    const rId = uuid();
    await db.run('INSERT INTO Responses VALUES (?, ?, ?, ?)', [rId, id, JSON.stringify(res), time]);
    return time;
}

async function getResults(id) {
    const db = await dbConn;
    let res = {};
    res = db.all('SELECT * FROM Responses WHERE surveyID = ?', id);
    return res;
}

async function getName(id) {
    const db = await dbConn;
    let name = db.all('SELECT json FROM Surveys WHERE id = ?', id);
    return name;
}

function currentTime() {
    return new Date().toISOString();
}

module.exports = {
    listSurveys,
    findSurvey,
    addSurvey,
    addPassword,
    checkPassword,
    openSurvey,
    closeSurvey,
    addResult,
    getResults,
    getName,
};