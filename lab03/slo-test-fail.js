import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,
  duration: '1m',
  thresholds: {
    'http_req_duration{name:cart}': ['p(95)<200'],
    'http_req_failed{name:pay}': ['rate<0.08'],
    'checks': ['rate>0.90'],
    'http_req_duration{name:report}': ['p(95)<100'], // ZORIUD EVDEH: Server is 200-400ms
  },
};

export default function () {
  const base = 'http://localhost:3000';

  const c = http.post(`${base}/cart/add`, null, { tags: { name: 'cart' } });
  check(c, { 'cart 200': (x) => x.status === 200 });

  const r = http.get(`${base}/report`, { tags: { name: 'report' } });
  check(r, { 'report 200': (x) => x.status === 200 });

  const p = http.post(`${base}/pay`, null, { tags: { name: 'pay' } });
  check(p, { 'pay 200': (x) => x.status === 200 });

  sleep(1);
}
