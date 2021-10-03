import http from 'k6/http';
import { sleep, check } from 'k6';
const { server_port } = require('./db/config.js');

export default function () {
  // let options = {
  //   vus:10, duration: "10s",
  // }

  let res = http.get(`http://localhost:${server_port}/reviews/`);
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
