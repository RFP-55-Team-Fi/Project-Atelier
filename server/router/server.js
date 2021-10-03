/* eslint-disable import/extensions */
const express = require("express");
// const Router = require('express-promise-router')
// const app = express();
const router = express.Router();
// const db = require("../controller/queries.js");
const db = require("../db/backup.js");
// const queries = require('../controller/queries')
router.get("/", (req, res) => {
  res.send("hello");
});
// TODO CHANGE ENDPOINTS
// Get Reviews
router.get("/reviews", (req, res) => {
  db.getReviews(req.query)
    .then((result) => res.status(200).send(result))
    .catch((err) => res.send(err));
});
// Get Metadata
router.get("/reviews/meta", (req, res) => {
  db.getMetadata(req.query)
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});
// Post review
router.post("/reviews", (req, res) => {
  console.log(req.body);
  db.addReview(req.body)
    .then((result) => console.log(result))
    .then(() => res.sendStatus(201))
    .catch((err) => res.send(err));
});
// Mark review  as helpful
router.put("/reviews/:review_id/helpful", (req, res) => {
  db.markHelpfulReview(req.query)
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});
// Report review
router.put("/reviews/:review_id/report", (req, res) => {
  db.reportReview(req)
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});

module.exports = router;
