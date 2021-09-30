// set up connection to database and then export it here
// requiring pg promise library as dependency
const code = require('./config.js');
const { Pool } = require('pg');

// this is my connection details used to create my db object
const pool = new Pool ({
  database: 'postgres',
  user: 'postgres',
  host: 'localhost',
  port: 5432,
  password: code.code,
})

pool.connect()

pool.on('error', (err, client) => {
  console.error('Error:', err);
});
// creating my database object from the connection
module.exports= pool.connect()
