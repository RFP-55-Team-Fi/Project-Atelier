// const { Pool } = require("pg");
const { pool } = require("../../db/index.js");

// ===================== GET '/reviews/' ROUTES =====================>
// GET: /reviews - check
// function getReviews
// function get photos

// GET: /reviews/meta - check
// function getMetaData
// function getRatings
// function getRecommended
// function get Characteristics
// getReviewIDs
// function getCharValues

// POST: /reviews - check
// function add to photos table
// function get latest review ID
// function addToCharReviews
// function get latest review ID

// PUT: /reviews/:review_id/helpful
// function markHelpfulReview

// PUT: /reviews/:review_id/report

// Gets photo_id and url for every review_id
const getPhotos = (reviewIDs) => {
  console.log("function get photos");
  const photosPromises = [];
  for (let i = 0; i < reviewIDs.length; i++) {
    // const query = `SELECT id, url FROM reviews_photos WHERE review_id = ${reviewIDs[i]}`;
    const query = `SELECT id, url FROM reviews_photos WHERE review_id = $1`;
    photosPromises.push(
      pool
        .query(query, [reviewIDs[i]])
        .then((photos) => {
          if (photos.rows.length === 0) {
            return null;
          }
          return photos.rows;
        })
        .catch((err) => console.error(err))
        // .catch((err) => err)
    );
  }

  return Promise.all(photosPromises).then((photos) => photos);
};

// Gets all reviews for given product_id
const getReviews = (params) => {
  console.log("function getReviews");
  const { page, count } = params;
  const productID = params.product_id || 18;
  const reviewIDsArr = [];
  const query = `SELECT review_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness FROM reviews WHERE product_id = $1`;

  const productReview = {
    product: productID,
    page,
    count,
  };

  return pool
    .query(query, [productID])
    .then((reviews) => {
      productReview.results = reviews.rows;

      // Gets all reviewIDs of a product
      for (let i = 0; i < reviews.rows.length; i++) {
        reviewIDsArr.push(reviews.rows[i].review_id);
      }

      // Gets all photos of a reviewID
      return getPhotos(reviewIDsArr)
        .then((photos) => {
          for (let i = 0; i < productReview.results.length; i++) {
            productReview.results[i].photos = photos[i];
          }
          return productReview;
        })
        .catch((err) => console.error(err));
    })
    .catch((err) => console.error(err));
};

// ===================== GET '/reviews/meta' ROUTES =====================>

// Get all ratings of a given productID
const getRatings = (product_id) => {
  console.log("function getRatings");
  const ratings = {};
  const query = `SELECT rating FROM reviews WHERE product_id = $1`;
  const startTime = Date.now();
  return pool
    .query(query, [product_id])
    .then((response) => {
      for (let i = 0; i < response.rows.length; i++) {
        if (ratings[response.rows[i].rating] === undefined) {
          ratings[response.rows[i].rating] = 1;
        } else {
          ratings[response.rows[i].rating]++;
        }
      }

      // Stringifies number values
      for (const key in ratings) {
        ratings[key] = JSON.stringify(ratings[key]);
      }
      return ratings;
    })
    .then(() => {
      const finishTime = Date.now();
      const newLocal = finishTime - startTime;
      console.log(`Time taken:${newLocal}ms`);
    })
    .catch((err) => console.error(err));
  //     let startTime = Date.now();
  // timeTest().then(() => {
  //   let finishTime = Date.now();
  //   let timeTaken = finishTime - startTime;
  //   alert("Time taken in milliseconds: " + timeTaken);
  // })
};

// Gets number of recommended input for a given productID
const getRecommended = (productID) => {
  console.log("function getRecommended");
  const recommended = {};
  const query = `SELECT recommend FROM reviews WHERE product_id = $1`;
  return pool
    .query(query, [productID])
    .then((response) => {
      for (let i = 0; i < response.rows.length; i++) {
        if (recommended[response.rows[i].recommend] === undefined) {
          recommended[response.rows[i].recommend] = 1;
        } else {
          recommended[response.rows[i].recommend]++;
        }
      }

      // Stringifies number values
      for (const key in recommended) {
        recommended[key] = JSON.stringify(recommended[key]);
      }

      return recommended;
    })
    .catch((err) => console.error(err));
};

// Gets all review IDs
const getReviewIDs = (productID) => {
  console.log("getReviewIDs");
  const reviewIDs = [];
  const query = `SELECT review_id FROM reviews WHERE product_id = $1`;
  return pool
    .query(query, [productID])
    .then((response) => {
      response.rows.map((review) => reviewIDs.push(review.review_id));
      console.log(reviewIDs)
      return reviewIDs;
    })
    .catch((err) => console.error(err));
};

// Gets characteristic_id and values for given review_id
const getCharValues = (reviewIDs) => {
  console.log("function getCharValues");
  const charValues = [];
  for (let i = 0; i < reviewIDs.length; i++) {
    const query = `SELECT characteristic_id, value FROM characteristic_reviews WHERE review_id = $1`;
    return pool
      .query(query, [reviewIDs[i]])
      .then((values) => {
        for (let i = 0; i < values.rows.length; i++) {
          const charObj = {
            id: JSON.stringify(values.rows[i].characteristic_id),
            value: JSON.stringify(values.rows[i].value),
          };
          charValues.push(charObj);
        }

        return charValues;
      })
      .catch((err) => console.error(err));
  }
};

// Retrieves characteristics of a given product
const getCharacteristics = (productID) => {
  console.log("function get Characteristics");
  const characteristics = {};
  const charNameQuery = `SELECT name FROM characteristics WHERE product_id = $1`;

  return pool
    .query(charNameQuery, [productID])
    .then((charNames) => {
      // Adds characteristic names to object
      for (let i = 0; i < charNames.rows.length; i++) {
        const charName = charNames.rows[i].name;
        characteristics[charName] = {};
      }
      return getReviewIDs(productID)
        .then((reviewIDs) =>
          getCharValues(reviewIDs)
            .then((charValues) => {
              let counter = 0;
              for (const key in characteristics) {
                characteristics[key] = charValues[counter];
                counter++;
              }
              return characteristics;
            })
            .catch((err) => console.error(err))
        )
        .catch((err) => console.error(err));
    })
    .catch((err) => console.error(err));
};

// Gets review metadata for given product_id
const getMetadata = (params) => {
  console.log("function getMetaData");
  const product_id = params.product_id || 18;
  const metadata = {
    product: product_id,
  };
  const startTime = Date.now()
  return getRatings(product_id)
    .then((ratingsMeta) => {
      metadata.ratings = ratingsMeta; // values need to be wrapped in double quotes
    })
    .then(() =>
      getRecommended(product_id).then((data) => {
        metadata.recommended = data; // values need to be wrapped in double quotes
      })
    )
    .then(() =>
      getCharacteristics(product_id).then((data) => {
        metadata.characteristics = data;
        const finishTime = Date.now();
        const newLocal = finishTime - startTime;
        console.log(`Time taken:${newLocal}ms`);
        return metadata;
      })
    )
    .catch((err) => console.error(err));
};

// ===================== POST '/reviews/' ROUTES =====================>

// Update reviews table
const addToReviewTable = (params) => {
  console.log('function addToReviewTable')
  const { product_id, rating, summary, body, reviewer_name, reviewer_email } =
    params;
  const date = new Date().getTime().toString();
  const recommend = params.recommend === "true";
  const query = `INSERT INTO reviews(product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email, reported, helpfulness) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, false, 0)`;
  const values = [
    product_id,
    rating,
    date,
    summary,
    body,
    recommend,
    reviewer_name,
    reviewer_email,
  ];
  return pool.query(query, values).catch((err) => console.log(err));
};

// Gets the most recent review_id
const getLatestReviewID = () => {
  console.log("function get latest review ID");
  const query = "SELECT review_id FROM reviews ORDER BY review_id DESC LIMIT 1";
  return pool
    .query(query)
    .then((response) => response.rows[0].review_id)
    .catch((err) => console.error(err));
};

// Update photo table
const addToPhotoTable = (url) => {
  // fill block for case of no photo
  console.log("function add to photos table ");
  if (!url) {
  } else {
    return getLatestReviewID()
      .then((id) => {
        const query = `INSERT INTO reviews_photos(review_id, url) VALUES ($1, $2)`;
        const values = [id, url];
        return pool.query(query, values).catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  }
};

// Update characteristic_reviews table
const addToCharReviews = (chars) => {
  const charIDs = Object.keys(chars);
  const charVals = Object.values(chars);
  const addToCharReviewsTablePromise = [];
  getLatestReviewID()
    .then((id) => {
      for (let i = 0; i < charIDs.length; i++) {
        const query = `INSERT INTO characteristic_reviews(characteristic_id, review_id, value) VALUES ($1 ,$2 ,$3)`;
        const values = [charIDs[i], id, charVals[i]];
        addToCharReviewsTablePromise.push(pool.query(query, values).catch((err) => console.error(err)));
      }
    })
    .catch((err) => console.error(err));
  return Promise.all(addToCharReviewsTablePromise);
  // .then((id) => {
  //   const testPromise = charIDs.map((charID, i) => {
  //     const query = `INSERT INTO characteristic_reviews(characteristic_id, review_id, value) VALUES ($1 ,$2 ,$3)`;
  //     const values = [charIDs[i], id, charVals[i]];
  //     addToCharReviewsTablePromise.push(pool.query(query, values).catch((err) => console.error(err)));
  //   })
  //   return Promise.all(testPromise);
  // });
};

// Adds a review to the database
// const addReview = (params) =>
//   addToReviewTable(params)
//  .then(() => addToPhotoTable(params.photos)
//  .then(() =>addToCharReviews(params.characteristics)
//  .catch((err) => console.error(err)
//       )
//     )
//   );
const addReview = async (params) => {
  try {
    await addToReviewTable(params);
    await addToPhotoTable(params.photos);
    await addToCharReviews(params.characteristics);
  } catch (err) {
    console.log(err);
  } finally {
    console.log("finally");
  }
};

const markHelpfulReview = (review_id) => {
  // console.log("function markHelpfulReview ");
  const query = `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE review_id = $1`;
  return pool
    .query(query, [review_id])
    // .then((res) => res)
    .catch((err) => err);
};

const reportReview = (review_id) => {
  console.log("function reportreview");
  const query = `UPDATE reviews SET reported = true WHERE review_id = $1`;
  return pool.query(query, [review_id]).catch((err) => console.error(err));
};

module.exports = {
  getReviews,
  getMetadata,
  addReview,
  markHelpfulReview,
  reportReview,
};
