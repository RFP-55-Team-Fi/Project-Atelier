const express = require('express');
const { pool } = require('../db/index.js')
const app = express();
const port = 3001;
const router = require('./router/server.js')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', router)

app.listen(port, ()=>{
  console.log(`Server listening at port:${port}`);
});

