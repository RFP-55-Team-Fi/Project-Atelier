/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import http from "k6/http";
import { sleep, check } from "k6";

const { server_port } = require("./db/config.js");
// Test Constant VUs/Time
// export const options = {
//   thresholds: {
//     http_req_failed: ["rate<0.01"], // http errors should be less than 1%
//     http_req_duration: ["p(95)<200"], // 95% of requests should be below 200ms
//   },
//   vus: 250,
//   duration: "30s",
// };

// Test Ramp
// export const options = {
//   thresholds: {
//     http_req_failed: ["rate<0.01"], // http errors should be less than 1%
//     http_req_duration: ["p(95)<200"], // 95% of requests should be below 200ms
//   },
//   stages: [
//     { duration: "1s", target: 20 },
//     // { duration: "30s", target: 700 },
//     { duration: "30s", target: 2700 },
//     { duration: "10s", target: 300 },
//     { duration: "5s", target: 10 },
//   ],
// };

// Test Get Reviews
export default function () {
  //
  const res = http.get(`http://localhost:3001/reviews/`);
  check(res, { "status was 200": (r) => r.status === 200 });
    console.log(`Response time was ${String(res.timings.duration)}`);
  sleep(1);
}

// Test Get MetaData
// export default function () {
//   //max product 1000011
//   const randomProductID = Math.floor(Math.random() * 30000);
//   const res = http.get(`http://localhost:${server_port}/reviews/meta/?product_id=${randomProductID}`);
//   check(res, { "status was 200": (r) => r.status === 200 });
//   console.log(`Response time was ${String(res.timings.duration)} for product_id: ${randomProductID}`);
//   sleep(1);
// }

// Test Mark Review As Helpful
// export default function () {
// //   // const randomReviewID = Math.floor(Math.random() * 30000)
//   const review_id = 20;
//   const res = http.put(`http://localhost:3001/reviews/${review_id}/helpful`);
//   check(res, { "status was 204": (r) => r.status === 204 });
//     // console.log(`Response time was ${String(res.timings.duration)} for product_id: ${review_id}`);
//   sleep(1);
// }

// Test Post Review
// export default function () {
//   // const body = { product_id : 25 };
//   const params = {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   };
//   const data = JSON.stringify({
//     product_id: 100,
//     rating: 4,
//     summary: "K6",
//     body: "Hello, testing from K6",
//     recommend: "true",
//     reviewer_name: "GO",
//     reviewer_email: "GO@STRESSTEST.COM",
//     photos: ["HOW", "FAST", "CAN", "YOU", "GO"],
//     characteristics: {},
//     response: "null",
//   });

//   const res = http.post(
//     `http://localhost:${server_port}/reviews/`,
//     data,
//     params
//   );
//   check(res, { "status was 201": (r) => r.status === 201 });
//   sleep(1);
// }

// const res = http.get(`http://localhost:${server_port}/reviews/:review_id/helpful/`);
// const res = http.get(`http://localhost:${server_port}/reviews/:review_id/report/`);