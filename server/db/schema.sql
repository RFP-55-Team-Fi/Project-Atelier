-- To log in:
  -- psql -d postgres -U postgres

-- To execute this file:
  -- psql -h 127.0.0.1 -d postgress -f schema.sql

DROP TABLE IF EXISTS characteristic_reviews;
DROP TABLE IF EXISTS characteristics;
DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS product;


CREATE TABLE product(
  product_id SERIAL NOT NULL,
  name VARCHAR(255) NOT NULL,
  slogan VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  default_price INT NOT NULL,
  PRIMARY KEY(product_id)
);
CREATE TABLE reviews (
  id SERIAL,
  product_id INT,
  rating INT,
  date BIGINT,
  summary TEXT,
  body TEXT,
  recommend BOOLEAN,
  reported BOOLEAN,
  reviewer_name VARCHAR(255),
  reviewer_email VARCHAR(255),
  response TEXT,
  helpfulness INT,
  PRIMARY KEY (id)
);


CREATE TABLE photos(
  id SERIAL,
  review_id INT NOT NULL,
  url TEXT,
  PRIMARY KEY(id),
  FOREIGN KEY(review_id) REFERENCES reviews(review_id)
);

CREATE TABLE characteristics(
  id SERIAL NOT NULL,
  product_id INT NOT NULL,
  name VARCHAR NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY(product_id) REFERENCES product(product_id)
);

CREATE TABLE characteristic_reviews(
  id SERIAL NOT NULL,
  characteristic_id INT NOT NULL,
  review_id INT NOT NULL,
  value INT NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY(review_id) REFERENCES reviews(review_id)
);

COPY products
FROM '/Users/aarontran/Documents/Hack/SDC/SDC-Ratings-Reviews/server/db/products.csv'
DELIMITER ','
CSV HEADER;
COPY reviews
FROM '/Users/aarontran/Documents/Hack/SDC/SDC-Ratings-Reviews/server/db/reviews.csv'
DELIMITER ','
CSV HEADER;
COPY photos
FROM '/Users/aarontran/Documents/Hack/SDC/SDC-Ratings-Reviews/server/db/photos.csv'
DELIMITER ','
CSV HEADER;
COPY characteristics
FROM '/Users/aarontran/Documents/Hack/SDC/SDC-Ratings-Reviews/server/db/characteristics.csv'
DELIMITER ','
CSV HEADER;
COPY characteristic_reviews
FROM '/Users/aarontran/Documents/Hack/SDC/SDC-Ratings-Reviews/server/db/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;
