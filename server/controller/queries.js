const { query } = require("../../db/index.js");

const getReviews = (req) => {
  let { product_id, count, page, sort } = req;
  console.log(product_id, count, page, sort);
  page = page || 1;
  count = count || 5;
  const text = `select * from reviews where product_id = $1;`;
  // const text =  SELECT reviews.reviews_id AS review_id, reviews.rating, reviews.summary, reviews.recommend, reviews.response, reviews.body, to_timestamp(reviews.date/1000) as date, reviews.reviewer_name, reviews.helpfulness, json_agg(json_build_object('id', reviews_photos.id, 'url', reviews_photos.url)) AS photos FROM reviews LEFT JOIN reviews_photos ON reviews_photos.review_id = reviews.id WHERE product_id=40 AND reviews.reported=false GROUP BY reviews.id LIMIT 10
  return query(text, [product_id])
    .then((result) => result.rows)
    .catch((err) => err.stack);
};
//
const addReview = (req) => {
  const date = new Date().getTime().toString();
  const {
    product_id,
    rating,
    summary,
    body,
    recommend,
    reviewer_name,
    reviewer_email,
    photos,
    characteristics,
    response,
  } = req.body;
  const text = `insert into reviews (product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email, response) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning review_id`;

  const isPhotos = photos.length > 0 ? true : false;
  const isCharacteristicsExist = Object.keys(characteristics).length > 0;
  console.log("isCharacteristics", isCharacteristicsExist);

  const insertIntoCharacteristics_reviews = (charIDarr, review_id) => {
    const text2 = `insert into characteristic_reviews (characteristic_id, review_id, value) values ($1, $2, $3)`;
    charIDarr.forEach((id) => {
      query(text2, [id, review_id])
        .then((result) => console.log(result))
        .catch((err) => console.log(err));
    });
  };
  //insert photos
  const values = [
    product_id,
    rating,
    date,
    summary,
    body,
    recommend,
    reviewer_name,
    reviewer_email,
    response,
  ];
  query(text, values)
    .then((result) => {
      const { review_id } = result.rows[0];
      // iterate over photos array and add them to each url row.
      // can i parse characteristics nested array and insert them at the same time as the photos?
      // need to return new characteristics id and insert into characteristic_reviews
      console.log("CHARACTERISTICS", characteristics);
      let characterIDs = [];
      let reviews_Ids = [];
      if (isPhotos) {
        photos.forEach((url) => {
          // insert into reviews_photos
          const text3 = `insert into reviews_photos (review_id, url) values ($1, $2) returning id;`;
          query(text3, [review_id, url])
            // .then(result => console.log(result, 'result from text 3'))
            .then((result) => {
              const { id } = result.rows[0];
              console.log(
                id,
                " this is the reviews_photos primary id which we need to insert into char_reviews table"
              );
              if (isCharacteristicsExist) {
                for (const name in characteristics) {
                  //insert into characteristics
                  const text4 = `insert into characteristics (product_id, name) values ($1, $2) returning id`;
                  query(text4, [product_id, name])
                    .then((result) => {
                      const { id } = result.rows[0];
                      characterIDs.push(id);
                      console.log(
                        id,
                        " this is the characteristic primary id which we need to insert into char_reviews table"
                      );
                      // console.log(result)
                    })
                    .catch((err) => console.log(err, "err from text 4"));
                }
              } else {
                // insert into characteristic_reviews
                insertIntoCharacteristics_reviews;
              }
            })
            .catch((err) => console.log(err, "err from text 3"));
        });
      }
    })
    .then((result) => res.status(201).send(result))
    .catch((err) => res.send(err));
};

const getMetadata = (req, res) => {
  const { product_id } = req.query;
  // get ratings object
  // const text = `SELECT json_build_objet(recommend, -- sum (case when recommend then 1 else 0 end) as recommend, json_build_object(not recommend, coalesce(sum(case when then 0 else 1 end), 0)) as notRecommend
  // as ratings from reviews where product_id = 100 and reported = false
  // group by name, characteristics
  // with json_build
  // get recommended object
  // get characterisstics
};
const markHelpfulReview = (req, res) => {
  const { review_id } = req.params;
  const text = `explain analyze update reviews set helpfulness = helpfulness + 1 where review_id = $1;`;
  query(text, [review_id])
    .then(() => {
      console.log("success");
    })
    .then(() => res.sendStatus(204))
    .catch((err) => console.log(err));
};
const reportReview = (req, res) => {
  const { review_id } = req.params;
  const text = `update reviews set reported = 't' where review_id = $1;`;
  query(text, [review_id])
    .then(() => {
      console.log("success");
    })
    .then(() => res.send(204))
    .catch((err) => res.send(err));
};

module.exports = {
  getReviews,
  getMetadata,
  addReview,
  markHelpfulReview,
  reportReview,
};
const meta = {
  product_id: "40344",
  ratings: {
    1: "7",
    2: "11",
    3: "12",
    4: "21",
    5: "92",
  },
  recommended: {
    false: "32",
    true: "111",
  },
  characteristics: {
    Fit: {
      id: 135219,
      value: "2.5000000000000000",
    },
    Length: {
      id: 135220,
      value: "2.5757575757575758",
    },
    Comfort: {
      id: 135221,
      value: "2.6562500000000000",
    },
    Quality: {
      id: 135222,
      value: "2.9166666666666667",
    },
  },
};

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
