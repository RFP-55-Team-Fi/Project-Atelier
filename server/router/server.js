const express = require('express');
// const Router = require('express-promise-router')
const app = express();
const router = express.Router()
const {getReviews} = require('../controller/queries.js');
// const queries = require('../controller/queries')
console.log('getReviews', getReviews )

router.get('/', (req, res)=> {
  res.send('hello')
})
// Get Reviews //TODO will need to change endpoint for client
router.get('/reviews', (req, res) => {
  getReviews(req, res)
})
// Get Metadata
router.get('/meta', (req, res)=>{
  res.send('get meta')
})
// Post review
router.post('/', (req, res)=>{
  res.send('post review')
})
// Mark review  as helpful
router.put('/:review_id/helpful', (req, res) =>{
  res.send('helpful review')
})
// Report review
router.put('/:review_id/report', (req, res) =>{
  res.send('report review ')
})


module.exports = router;