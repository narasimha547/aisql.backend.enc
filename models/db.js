require("dotenv").config();

const DB_TYPE = process.env.DB_TYPE;

let db;
try {
  switch (DB_TYPE.toLowerCase()) {
    case "mysql":
      db = require("./db/mysql");
      break;
    case "mssql":
      db = require("./db/mssql");
      break;
    case "mongo":
      db = require("./db/mongo");
      break;
    default:
      throw new Error(`Unsupported DB_TYPE: ${DB_TYPE}`);
  }
  console.log(`✅ Using database: ${DB_TYPE}`);
} catch (error) {
  console.error(`❌ Database connection error: ${error.message}`);
  process.exit(1);
}

module.exports = db;
