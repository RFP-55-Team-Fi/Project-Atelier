DROP TABLE IF EXISTS characteristic_reviews;
DROP TABLE IF EXISTS characteristics;
DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS products;

CREATE TABLE "products" (
  "id" int,
  "name" varchar(255) not null,
  "slogan" varchar(255),
  "description" text,
  "category" varchar(50),
  "default_price" int,
  PRIMARY KEY(id)
);

CREATE TABLE "reviews" (
  "review_id" int,
  "product_id" int,
  "rating" int,
  "date" bigint,
  "summary" text,
  "body" text,
  "recommend" boolean,
  "reported" boolean,
  "reviewer_name" varchar(255),
  "reviewer_email" varchar(255),
  "response" text,
  "helpfulness" int,
  PRIMARY KEY(review_id),
  FOREIGN KEY(product_id) REFERENCES products(id)
);

CREATE TABLE "photos" (
  "id" int,
  "product_id" int,
  "url" text,
  "thumbnail_url" text,
  PRIMARY KEY(id),
  FOREIGN KEY(product_id) REFERENCES reviews(review_id)
);

CREATE TABLE "characteristics" (
  "id" int,
  "product_id" int,
  "name" varchar,
  PRIMARY KEY(id),
  FOREIGN KEY(product_id) REFERENCES products(id)
);

CREATE TABLE "characteristic_reviews" (
  "id" int,
  "characteristic_id" int,
  "review_id" int,
  "value" int,
  PRIMARY KEY(id),
  FOREIGN KEY(review_id) REFERENCES reviews(review_id)
);

COPY products
FROM '/Users/aarontran/Documents/data/product.csv'
DELIMITER ','
CSV HEADER;
COPY reviews
FROM '/Users/aarontran/Documents/data/reviews.csv'
DELIMITER ','
CSV HEADER;
COPY photos
FROM '/Users/aarontran/Documents/data/photos.csv'
DELIMITER ','
CSV HEADER;
COPY characteristics
FROM '/Users/aarontran/Documents/data/characteristics.csv'
DELIMITER ','
CSV HEADER;
COPY characteristic_reviews
FROM '/Users/aarontran/Documents/data/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;
-- COPY products
-- FROM '/Users/aarontran/Documents/Hack/SDC/SDC-Ratings-Reviews/server/db/products.csv'
-- DELIMITER ','
-- CSV HEADER;
-- COPY reviews
-- FROM '/Users/aarontran/Documents/Hack/SDC/SDC-Ratings-Reviews/server/db/reviews.csv'
-- DELIMITER ','
-- CSV HEADER;
-- COPY photos
-- FROM '/Users/aarontran/Documents/Hack/SDC/SDC-Ratings-Reviews/server/db/photos.csv'
-- DELIMITER ','
-- CSV HEADER;
-- COPY characteristics
-- FROM '/Users/aarontran/Documents/Hack/SDC/SDC-Ratings-Reviews/server/db/characteristics.csv'
-- DELIMITER ','
-- CSV HEADER;
-- COPY characteristic_reviews
-- FROM '/Users/aarontran/Documents/Hack/SDC/SDC-Ratings-Reviews/server/db/characteristic_reviews.csv'
-- DELIMITER ','
-- CSV HEADER;

-- select * from products;
-- select * from reviews;
-- select * from photos;
-- select * from characteritics;
-- select * from characteristic_reviews;

