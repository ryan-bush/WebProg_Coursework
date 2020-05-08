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
    const messages = await db.all('SELECT * FROM Surveys ORDER BY time DESC LIMIT 10');
    return messages;
}

async function findSurvey(id) {
    const db = await dbConn;
    const msg = db.get('SELECT * FROM Surveys WHERE id = ?', id);
    return msg;
}

function currentTime() {
    return new Date().toISOString();
}

module.exports = {
    listSurveys,
    findSurvey,
};