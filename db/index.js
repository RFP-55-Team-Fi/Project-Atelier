const { password } = require('./config.js');
const { Pool } = require('pg');
const database = 'postgres';
const port = 5432;
const pool = new Pool ({
  database: database,
  user: 'postgres',
  host: 'localhost',
  port: port,
  password: password,
})

pool.connect()
  .then(()=>{
    console.log(`Connected to database:${database} on port:${port}`)
  })
  .catch((err)=> {
    console.log(err);
  });

module.exports = {
  pool
}
