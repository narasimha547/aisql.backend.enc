const sql = require("mssql");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const pool = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("✅ Connected to MSSQL");
    return pool;
  })
  .catch((err) => {
    console.error("❌ MSSQL Connection Failed", err);
    process.exit(1);
  });

module.exports = {
  query: async (sqlQuery) => {
    const request = (await pool).request();
    const result = await request.query(sqlQuery);
    return result.recordset;
  },
};
