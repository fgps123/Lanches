const { Pool } = require("pg");
const URL_PG = "postgres://postgres:123@localhost:5432/McD";
const database = new Pool ({
    connectionString: URL_PG
});

module.exports = database;