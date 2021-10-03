const express = require("express");
// const Router = require('express-promise-router')
const app = express();
const router = express.Router();
const db = require("../controller/queries.js");
// const queries = require('../controller/queries')

router.get("/", (req, res) => {
  res.send("hello");
});
//TODO CHANGE ENDPOINTS
// Get Reviews
router.get("/reviews", (req, res) => {
  db.getReviews(req.query)
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});
// Get Metadata
router.get("/reviews/meta", (req, res) => {
  db.getMetadata(input);
});
// Post review
router.post("/reviews", (req, res) => {
  db.addReview(input)
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});
// Mark review  as helpful
router.put("/reviews/:review_id/helpful", (req, res) => {
  db.markHelpfulReview(input);
});
// Report review
router.put("/reviews/:review_id/report", (req, res) => {
  db.reportReview(input);
});

module.exports = router;
