const { query } = require('../../db/index.js')

module.exports = {
  getReviews: (req, res) => {
    let { product_id, count, page, sort } = req.body;
    page = page || 1; count = count || 5;
    const text = `select * from reviews where product_id = $1;`
    // const text =  SELECT reviews.reviews_id AS review_id, reviews.rating, reviews.summary, reviews.recommend, reviews.response, reviews.body, to_timestamp(reviews.date/1000) as date, reviews.reviewer_name, reviews.helpfulness, json_agg(json_build_object('id', reviews_photos.id, 'url', reviews_photos.url)) AS photos FROM reviews LEFT JOIN reviews_photos ON reviews_photos.review_id = reviews.id WHERE product_id=40 AND reviews.reported=false GROUP BY reviews.id LIMIT 10
    query(text, [product_id])
    .then((result) =>res.status(200).send(result.rows))
    .catch(err => console.log(err.stack))
  },
  getMetadata: (req, res) => {
    const { product_id } = req.query;
    // get ratings object
    // const text = `SELECT json_build_objet(recommend, -- sum (case when recommend then 1 else 0 end) as recommend, json_build_object(not recommend, coalesce(sum(case when then 0 else 1 end), 0)) as notRecommend
    // as ratings from reviews where product_id = 100 and reported = false
    // group by name, characteristics
    // with json_build
    // get recommended object
    // get characterisstics
  },
  addReview: (req, res) => {
    const date = new Date().getTime().toString();
    const { product_id, rating, summary, body, recommend, reviewer_name, reviewer_email, photos, characteristics, response } = req.body;
    const text = `insert into reviews (product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email, response) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning review_id`;
    const text2 = `insert into characteristic_reviews (characteristic_id, review_id, value) values ($11, $11, $12)`;
    const text3 = `insert into reviews_photos (review_id, url) values ($1, $2);`;
    const text4 = `insert into characteristics (product_id, name) values ($15, $16)`;
    const isPhotos = photos.length > 0 ? true : false;
    query(text, [product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email, response ])
    .then(result => {
      const { review_id } = result.rows[0];
      console.log(review_id)
      console.log(text3)
      console.log(photos, 'photos')
      query(text3, [review_id, photos])
        .then(result=> console.log(result, 'result from text 3'))
        .catch(err => console.log(err, 'err from text 3'))
    })
    .then(result => res.status(201).send(result))
    .catch(err => res.send(err))
  },
  markHelpfulReview: (req, res)=>{
    const { review_id } = req.params;
    const text = `update reviews set helpfulness = helpfulness + 1 where review_id = $1;`
      query(text, [review_id])
      .then(() => {console.log('success')})
      .then(() => res.sendStatus(204))
      .catch(err => console.log(err))
  },
  reportReview: (req, res) => {
    const { review_id } = req.params;
    const text = `update reviews set reported = 't' where review_id = $1;`
    query(text, [review_id])
      .then(() => {console.log('success')})
      .then(() => res.send(204))
      // .catch(err => console.log(err))
      .catch(err => res.send(err))
  },

}

// const view = {
//   "product": "2",
//   "page": 0,
//   "count": 5,
//   "results": [
//     {
//       "review_id": 841126,
//       "rating": 5,
//       "summary": "Very good",
//       "recommend": true,
//       "response": null,
//       "body": "lorem ipsum",
//       "date": "2021-09-17T00:00:00.000Z",
//       "reviewer_name": "tester",
//       "helpfulness": 37,
//       "photos": [
//         {
//             "id": 1235676,
//             "url": "https://images.unsplash.com/photo-1465877783223-4eba513e27c6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"
//         },
//         {
//             "id": 1235677,
//             "url": "https://images.unsplash.com/photo-1555274175-6cbf6f3b137b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80"
//         }
//       ]
//     },
//     {
//       "review_id": 841149,
//       "rating": 5,
//       "summary": "Very good",
//       "recommend": true,
//       "response": null,
//       "body": "lorem ipsum",
//       "date": "2021-09-17T00:00:00.000Z",
//       "reviewer_name": "tester",
//       "helpfulness": 1,
//       "photos": []
//     },
//   ]
// }

// const meta = {
//   "product_id": "40344",
//   "ratings": {
//       "1": "7",
//       "2": "11",
//       "3": "12",
//       "4": "21",
//       "5": "92"
//   },
//   "recommended": {
//       "false": "32",
//       "true": "111"
//   },
//   "characteristics": {
//       "Fit": {
//           "id": 135219,
//           "value": "2.5000000000000000"
//       },
//       "Length": {
//           "id": 135220,
//           "value": "2.5757575757575758"
//       },
//       "Comfort": {
//           "id": 135221,
//           "value": "2.6562500000000000"
//       },
//       "Quality": {
//           "id": 135222,
//           "value": "2.9166666666666667"
//       }
//   }
// }
