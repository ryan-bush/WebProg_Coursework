'use strict';
const sqlite = require('sqlite');
const uuid = require('uuid-random');

/**
 * Create database and migrate
 */
async function init() {
    const db = await sqlite.open('./database.sqlite', { verbose: true });
    await db.migrate({ migrationsPath: './server/migrations' });
    return db;
}

const dbConn = init();

/**
 * Retrieves list of all surveys
 */
async function listSurveys() {
    const db = await dbConn;
    const surveys = await db.all('SELECT * FROM Surveys ORDER BY time DESC LIMIT 100');
    return surveys;
}

/**
 * Add password to survey into database
 * @param  {Object} pass  Password to add
 * @param  {Object} id    ID of survey
 * @return          1     Success
 */
async function addPassword(pass, id) {
    const db = await dbConn;
    await db.run('UPDATE Surveys SET password = ? WHERE id = ?', pass, id);
    return 1;
}

/**
 * Retrieves password from database
 * @param  {Object} id    ID of survey
 * @return          pass  Password from Survey
 */
async function checkPassword(id) {
    const db = await dbConn;
    const pass = db.get('SELECT password FROM Surveys WHERE id = ?', id);
    return pass;
}

/**
 * Changes survey open to 1
 * @param  {Object} id    ID of survey
 * @return          1     Success
 */
async function openSurvey(id) {
    const db = await dbConn;
    await db.run('UPDATE Surveys SET open = 1 WHERE id = ?', id);
    return 1;
}

/**
 * Changes survey open to 0
 * @param  {Object} id    ID of survey
 * @return          1     Success
 */
async function closeSurvey(id) {
    const db = await dbConn;
    await db.run('UPDATE Surveys SET open = 0 WHERE id = ?', id);
    return 1;
}

/**
 * Deletes survey from table
 * @param  {Object} id    ID of survey
 * @return          1     Success
 */
async function deleteSurvey(id) {
    const db = await dbConn;
    await db.run('DELETE FROM Surveys WHERE id = ?', id);
    return 1;
}

/**
 * Retrieves survey from database
 * @param  {Object} id    ID of survey
 * @return          svy   Survey
 */
async function findSurvey(id) {
    const db = await dbConn;
    const svy = db.get('SELECT * FROM Surveys WHERE id = ?', id);
    return svy;
}

/**
 * Add survey into database
 * @param  {Object} svy   Survey JSON
 * @return          id    ID of survey added
 */
async function addSurvey(svy) {
    const db = await dbConn;
    const id = uuid();
    const time = currentTime();
    await db.run('INSERT INTO Surveys (id, time, json) VALUES (?, ?, ?)', [id, time, JSON.stringify(svy)]);

    return id;
}

/**
 * Add result into database
 * @param  {Object} res   Response JSON
 * @param  {Object} id    ID of survey
 * @return          time  time of added response
 */
async function addResult(res, id) {
    const db = await dbConn;
    const time = currentTime();
    const rId = uuid();
    await db.run('INSERT INTO Responses VALUES (?, ?, ?, ?)', [rId, id, JSON.stringify(res), time]);
    return time;
}

/**
 * Get all results for survey
 * @param  {Object} id    ID of survey
 * @return          res   Responses for survey
 */
async function getResults(id) {
    const db = await dbConn;
    let res = {};
    res = db.all('SELECT * FROM Responses WHERE surveyID = ?', id);
    return res;
}

/**
 * Retrieves name of survey
 * @param  {Object} id    ID of survey
 * @return          name  Survey JSON
 */
async function getName(id) {
    const db = await dbConn;
    let name = db.all('SELECT json FROM Surveys WHERE id = ?', id);
    return name;
}

/**
 * Get current time
 * @return          time     Current Time
 */
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
    deleteSurvey,
    addResult,
    getResults,
    getName,
};