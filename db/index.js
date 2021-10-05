const { Pool } = require("pg");
const { password, database, port, db_host } = require("./config.js");

const pool = new Pool({
  database,
  user: "postgres",
  host: db_host,
  port,
  password,
});

pool
  .connect()
  .then(() => {
    console.log(`Connected to database:${database} on port:${port}`);
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
};
