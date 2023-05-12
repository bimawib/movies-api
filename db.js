const { Client } = require('pg');
require("dotenv").config();

const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOSTNAME,
  DB_NAME,
  DB_DIALECT,
  DB_PORT
} = process.env;

const client = new Client({
    host: DB_HOSTNAME,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    dialect: DB_DIALECT
})

module.exports = client;