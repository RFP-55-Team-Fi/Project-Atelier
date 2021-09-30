const express = require('express');
const Router = require('express-promise-router')
const app = express();
const router = express.Router()
const db = require('../controller/queries.js');

router.get('/', (req, res)=> {
  res.send('hello')
})
// Get Reviews
// router.get('/', (req, res) => {
//   res.send('get reviews')
// })
// Get Metadata
router.get('/meta', (req, res)=>{

  //  query('select id from products where id = 1', (err, res) => {
  //   if(err){
  //     test = err;
  //     res.send(err)
  //   } else {
  //     test = res
  //     res.send('hello')
  //   }
  // })
  res.send('get meta')
})
// Post review
// router.post('/', (req, res)=>{
//   res.send('post review')
// })
// // Mark review  as helpful
// router.put('/:review_id/helpful', (req, res) =>{
//   res.send('helpful review')
// })
// // Report review
// router.put('/:review_id/report', (req, res) =>{
//   res.send('report review ')
// })


// app.listen(port, ()=>{
//   console.log(`Server listening at port http://localhost:${port}`);
// })

module.exports = router;