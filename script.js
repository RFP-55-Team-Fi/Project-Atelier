import http from "k6/http";
import { sleep, check } from "k6";

const { server_port } = require("./db/config.js");

// export const options = {
//   vus: 10,
//   duration: "10s",
// };

export const options = {
  stages: [
    { duration: "5s", target: 20 },
    { duration: "5s", target: 200 },
    { duration: "5s", target: 700 },
    { duration: "30s", target: 2700 },
    { duration: "10s", target: 300 },
    { duration: "5s", target: 10 },
  ],
};
export default function () {
  const res = http.get(`http://localhost:${server_port}/reviews/`);
  check(res, { "status was 200": (r) => r.status === 200 });
  sleep(1);
}
