/* eslint-disable import/extensions */
const { query } = require("../../db/index.js");

const insertIntoCharacteristics_reviews = (charIDarr, review_id) => {
  const text2 = `insert into characteristic_reviews (characteristic_id, review_id, value) values ($1, $2, $3)`;
  charIDarr.forEach((id) => {
    query(text2, [id, review_id])
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  });
};

const insertIntoCharacteristicsTable = (characteristics, product_id, name) => {
  const text4 = `insert into characteristics (product_id, name) values ($1, $2) returning id`;
  characteristics.forEach((characteristic) =>  {
    // insert into characteristics
    query(text4, [product_id, name])
      .then((result) => {
        const { id } = result.rows[0];
        characterIDs.push(id);
        console.log(
          id,
          "this is the characteristic primary id which we need to insert into char_reviews table"
        );
      })
      .catch((err) => console.log(err, "err from text 4"));
  });
};

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
  } = req;
  const text = `insert into reviews (product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email, response) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning review_id`;
  const isPhotos = photos.length > 0;
  const isCharacteristicsExist = Object.keys(characteristics).length > 0;
  console.log("isCharacteristics", isCharacteristicsExist);
  // eslint-disable-next-line prettier/prettier
  query(text, [product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email, response])
    .then((result) => {
      const { review_id } = result.rows[0];
      console.log("review_id", review_id);
      if (isCharacteristicsExist) {
        for (const number in characteristics)
        insertIntoCharacteristics_reviews(review_id)
      }
    })
    .catch((err) => console.log(err));
};

const insertPhotosIntoReviews_Photos = (review_id, url) => {
  query(text, values)
    .then((result) => {
      const { review_id } = result.rows[0];
      console.log("CHARACTERISTICS", characteristics);
      const characterIDs = [];
      const reviews_Ids = [];
      if (isPhotos) {
        photos.forEach((url) => {
          // insert into reviews_photos
          const text3 = `insert into reviews_photos (review_id, url) values ($1, $2) returning id;`;
          return (
            query(text3, [review_id, url])
              // .then(result => console.log(result, 'result from text 3'))
              .then((result) => {
                const { id } = result.rows[0];
                console.log(
                  id,
                  " this is the reviews_photos primary id which we need to insert into char_reviews table"
                );
              })
              .catch((err) => err)
          );
        });
      }
    })
    .catch((err) => err);
};
// insert photos


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
