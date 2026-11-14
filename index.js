'use strict';

// location-from-ip: where an IPv4 or IPv6 address is, from the ipapi.is API
// (https://ipapi.is/developers.html). Runs in Node.js 18+ (require) and in
// browsers (<script>, which defines the global ipToGeolocation).

(() => {
  const API = 'https://api.ipapi.is/';

  // With a key the lookup is a POST: the key stays out of URLs and logs.
  async function lookup(q, key) {
    const signal = AbortSignal.timeout(5000);
    const res = key
      ? await fetch(API, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(q ? { q, key } : { key }),
        signal,
      })
      : await fetch(q ? `${API}?q=${encodeURIComponent(q)}` : API, { signal });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data || data.error) {
      const err = new Error(`ipapi.is: ${(data && data.error) || `HTTP ${res.status}`}`);
      err.status = res.status;
      err.code = data && data.error_code;
      throw err;
    }
    return data;
  }

  /**
   * Where `ip` is (default: the caller's own address), or null when unknown.
   * With an API key (`options.key` or the environment variable IPAPI_KEY) this
   * is the API's full `location` object; without one it is the six fields a
   * keyless lookup returns, under the same names.
   */
  async function ipToGeolocation(ip, options = {}) {
    const env = typeof process !== 'undefined' && process.env ? process.env : {};
    const data = await lookup(ip, options.key !== undefined ? options.key : env.IPAPI_KEY);
    // `docs` marks the keyless response, which is flat and null where unknown.
    if (!data.docs) return data.location || null;
    if (data.country === null && data.lat === null) return null;
    return {
      country: data.country,
      state: data.region,
      city: data.city,
      latitude: data.lat,
      longitude: data.lon,
      timezone: data.timezone,
    };
  }

  if (typeof module === 'object' && module.exports) module.exports = { ipToGeolocation };
  else globalThis.ipToGeolocation = ipToGeolocation;
})();
