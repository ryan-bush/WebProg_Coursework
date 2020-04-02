'use strict';

const Pool = require('pg').Pool
const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'survey',
    password: '1234567890',
    port: 5432,
});

