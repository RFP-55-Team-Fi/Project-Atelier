/* eslint-disable import/no-extraneous-dependencies */
const express = require("express");
// const { pool } = require('../db/index.js')
const app = express();
const port = 3001;
const bodyParser = require("body-parser");
const router = require("./router/server.js");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", router);

app.listen(port, () => {
  console.log(`Server listening at port:${port}`);
});
