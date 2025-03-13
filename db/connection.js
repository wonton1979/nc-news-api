const { Pool } = require("pg");
require("dotenv").config({ path: `${__dirname}/../.env.${process.env.NODE_ENV || 'development'}` });

const ENV = process.env.NODE_ENV || "development";
const config = {};

if (ENV === "production") {
    console.log("Production database in use:", process.env.DATABASE_URL);
    config.connectionString = process.env.DATABASE_URL;
} else {
    console.log("Local database in use:", process.env.PGDATABASE);
    config.database = process.env.PGDATABASE;
}

if (!config.connectionString && !config.database) {
    throw new Error("PGDATABASE or DATABASE_URL not set");
}

const db = new Pool(config);

module.exports = db;
