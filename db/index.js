const { Pool } = require("pg");
const { password, database, port } = require("./config.js");

const pool = new Pool({
  database,
  user: "postgres",
  host: "localhost",
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
