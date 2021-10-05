/* eslint-disable import/extensions */
const express = require("express");
// const Router = require('express-promise-router')
// const app = express();
const router = express.Router();
const db = require("../controller/index.js");
// const db = require("../controller/queries.js");
// const db = require("../db/backup.js");
// const queries = require('../controller/queries')
router.get("/", (req, res) => {
  res.send("hello");
});
// TODO CHANGE ENDPOINTS
// GET: /reviews
// GET: /reviews/meta
// POST: /reviews
// PUT: /reviews/:review_id/helpful
// PUT: /reviews/:review_id/report

// Get Reviews
router.get("/reviews", (req, res) => {
  db.getReviews(req.query)
    .then((result) => res.status(200).send(result))
    .catch((err) => res.send(err));
});
// Get Metadata
router.get("/reviews/meta", (req, res) => {
  db.getMetadata(req.query)
    .then((result) => res.status(200).send(result))
    .catch((err) => res.send(err));
});
// Post review
router.post("/reviews", (req, res) => {
  db.addReview(req.body)
    .then((result) => console.log(result))
    .then(() => res.sendStatus(201))
    .catch((err) => res.send(err));
});
// Mark review  as helpful
router.put("/reviews/:review_id/helpful/", (req, res) => {
  const { review_id } = req.params;
  db.markHelpfulReview(review_id)
    .then(() => res.sendStatus(204))
    .catch(() => res.send(500));
});
// Report review
router.put("/reviews/:review_id/report", (req, res) => {
  const { review_id } = req.params;
  db.reportReview(review_id)
    .then(() => res.sendStatus(204))
    .catch((err) => res.send(err));
});

module.exports = router;
