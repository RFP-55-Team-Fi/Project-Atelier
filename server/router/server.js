const express = require('express');
// const Router = require('express-promise-router')
const app = express();
const router = express.Router()
const {
  getReviews, markHelpfulReview, reportReview, addReview, getMetadata
} = require('../controller/queries.js');
// const queries = require('../controller/queries')

router.get('/', (req, res)=> {
  res.send('hello')
})
//TODO CHANGE ENDPOINTS
// Get Reviews
router.get('/reviews', getReviews)
// Get Metadata
router.get('/reviews/meta', getMetadata)
// Post review
router.post('/reviews', addReview)
// Mark review  as helpful
router.put('/reviews/:review_id/helpful', markHelpfulReview)
// Report review
router.put('/reviews/:review_id/report', reportReview)


module.exports = router;