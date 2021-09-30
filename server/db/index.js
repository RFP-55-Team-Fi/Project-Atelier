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


pool.connect((err, client, done) => {
const query = `select * from products where id = 1`;
  if (err) throw err;
  pool.query(query, (err, res) => {
      done();
      if (err) {
          console.log(err.stack);
      } else {
          for (let row of res.rows) {
              console.log(row);
          }
      }
  });
});

// module.exports= pool.connect()
