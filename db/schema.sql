DROP TABLE IF EXISTS characteristic_reviews;
DROP TABLE IF EXISTS characteristics;
DROP TABLE IF EXISTS reviews_photos;
DROP TABLE IF EXISTS reviews;

CREATE TABLE "reviews" (
  "review_id" serial,
  "product_id" int not null,
  "rating" int not null,
  "date" bigint not null,
  "summary" text not null,
  "body" text not null,
  "recommend" boolean default false,
  "reported" boolean default false,
  "reviewer_name" varchar(255) not null,
  "reviewer_email" varchar(255) not null,
  "response" text default null,
  "helpfulness" int default 0,
  PRIMARY KEY(review_id)
);

CREATE TABLE "reviews_photos" (
  "id" SERIAL primary key,
  "review_id" INTEGER REFERENCES reviews(review_id) ON DELETE CASCADE,
  "url" text
);

CREATE TABLE "characteristics" (
  "id" SERIAL primary key,
  "product_id" int not null,
  "name" varchar
);

CREATE TABLE "characteristic_reviews" (
  "id" SERIAL primary key,
  "characteristic_id" INTEGER REFERENCES characteristics(id) ON DELETE CASCADE,
  "review_id" INTEGER REFERENCES reviews(review_id) ON DELETE CASCADE,
  "value" int
);

-- Copy From Extracted Data

COPY reviews
FROM '/Users/aarontran/Documents/data/reviews.csv'
DELIMITER ','
CSV HEADER;

COPY reviews_photos
FROM '/Users/aarontran/Documents/data/reviews_photos.csv'
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

-- Get Max ID from table
SELECT MAX(review_id) FROM reviews;

-- Get Next ID from table
SELECT nextval('reviews_review_id_seq');

-- Set Next ID Value to MAX ID
SELECT setval('reviews_review_id_seq', (SELECT MAX(review_id) FROM reviews));
SELECT setval('reviews_photos_id_seq', (SELECT MAX(id) FROM reviews_photos));
SELECT setval('characteristics_id_seq', (SELECT MAX(id) FROM characteristics));
SELECT setval('characteristic_reviews_id_seq', (SELECT MAX(id) FROM characteristic_reviews));

-- Drop Indexes
DROP INDEX idx_review_id;
DROP INDEX idx_reviews_photos_id;
DROP INDEX idx_characteristics_id;
DROP INDEX idx_characteristic_reviews_id;

-- Create BTREE Indexes
-- CREATE INDEX idx_review_id ON public.reviews USING btree (product_id);
-- CREATE INDEX idx_characteristics_id ON public.characteristics USING btree (product_id);
-- CREATE INDEX idx_characteristic_reviews_id ON public.characteristic_reviews USING btree (review_id);
-- CREATE INDEX idx_reviews_photos_id ON public.reviews_photos USING btree (review_id);

-- Create HASH Indexes
CREATE INDEX idx_review_id ON public.reviews USING hash (product_id);
CREATE INDEX idx_characteristics_id ON public.characteristics USING hash (product_id);
CREATE INDEX idx_characteristic_reviews_id ON public.characteristic_reviews USING hash (review_id);
CREATE INDEX idx_reviews_photos_id ON public.reviews_photos USING hash (review_id);
/************ below are head files ***********/

-- COPY products
-- FROM '/Users/aarontran/Documents/Hack/SDC/SDC-Ratings-Reviews/db/head_csv/products.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY reviews
-- FROM '/Users/aarontran/Documents/Hack/SDC/SDC-Ratings-Reviews/db/head_csv/reviews.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY reviews_photos
-- FROM '/Users/aarontran/Documents/Hack/SDC/SDC-Ratings-Reviews/db/head_csv/reviews_photos.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY characteristics
-- FROM '/Users/aarontran/Documents/Hack/SDC/SDC-Ratings-Reviews/db/head_csv/characteristics.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY characteristic_reviews
-- FROM '/Users/aarontran/Documents/Hack/SDC/SDC-Ratings-Reviews/db/head_csv/characteristic_reviews.csv'
-- DELIMITER ','
-- CSV HEADER;

-- select * from products;
-- select * from reviews;
-- select * from photos;
-- select * from characteritics;
-- select * from characteristic_reviews;

--  setval
-- ---------
--  5774952
-- (1 row)

--  setval
-- ---------
--  2742540
-- (1 row)

--  setval
-- ---------
--  3347679
-- (1 row)

--   setval
-- ----------
--  19327575
-- (1 row)