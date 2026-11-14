'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { ipToGeolocation } = require('.');

delete process.env.IPAPI_KEY;

// Stands in for the API: records the request, answers with `body`.
function stubFetch(body, status = 200) {
  const calls = [];
  globalThis.fetch = async (url, init = {}) => {
    calls.push({ url, ...init });
    return { ok: status < 400, status, json: async () => body };
  };
  return calls;
}

const location = { country: 'Germany', country_code: 'DE', state: 'Bavaria', city: 'Nuremberg', zip: '90403' };
const keyless = {
  ip: '85.10.199.76',
  is_bogon: false,
  company: 'Hetzner Online GmbH',
  asn: 'AS24940 Hetzner Online GmbH',
  city: 'Nuremberg',
  region: 'Bavaria',
  country: 'Germany',
  lat: 49.45421,
  lon: 11.07752,
  timezone: 'Europe/Berlin',
  docs: 'https://ipapi.is/free-tier.html?ref=api',
};

test('with a key: the full location object, the key in the POST body and not in the URL', async () => {
  const calls = stubFetch({ ip: '85.10.199.76', location });
  assert.deepStrictEqual(await ipToGeolocation('85.10.199.76', { key: 'k' }), location);
  assert.strictEqual(calls[0].url, 'https://api.ipapi.is/');
  assert.deepStrictEqual(JSON.parse(calls[0].body), { q: '85.10.199.76', key: 'k' });
});

test('the key is read from IPAPI_KEY', async (t) => {
  process.env.IPAPI_KEY = 'from-env';
  t.after(() => delete process.env.IPAPI_KEY);
  const calls = stubFetch({ location });
  await ipToGeolocation('85.10.199.76');
  assert.strictEqual(JSON.parse(calls[0].body).key, 'from-env');
});

test('without a key: the keyless fields under the names of the location object', async () => {
  const calls = stubFetch(keyless);
  assert.deepStrictEqual(await ipToGeolocation('85.10.199.76'), {
    country: 'Germany',
    state: 'Bavaria',
    city: 'Nuremberg',
    latitude: 49.45421,
    longitude: 11.07752,
    timezone: 'Europe/Berlin',
  });
  assert.strictEqual(calls[0].url, 'https://api.ipapi.is/?q=85.10.199.76');
});

test('without an address: the caller\'s own', async () => {
  const calls = stubFetch(keyless);
  await ipToGeolocation();
  assert.strictEqual(calls[0].url, 'https://api.ipapi.is/');
  const keyed = stubFetch({ location });
  await ipToGeolocation(undefined, { key: 'k' });
  assert.deepStrictEqual(JSON.parse(keyed[0].body), { key: 'k' });
});

test('null for an address that cannot be located', async () => {
  stubFetch({ ip: '10.0.0.1', is_bogon: true });
  assert.strictEqual(await ipToGeolocation('10.0.0.1', { key: 'k' }), null);
  const nulls = Object.fromEntries(Object.keys(keyless).map((k) => [k, null]));
  stubFetch({ ...nulls, ip: '10.0.0.1', is_bogon: true, docs: keyless.docs });
  assert.strictEqual(await ipToGeolocation('10.0.0.1'), null);
});

test('an API error rejects with its status and error_code', async () => {
  stubFetch({ error: 'Daily limit reached', error_code: 'ERR_FREE_TIER_EXHAUSTED' }, 429);
  await assert.rejects(ipToGeolocation('1.1.1.1'), { status: 429, code: 'ERR_FREE_TIER_EXHAUSTED' });
});
