# location-from-ip

[![npm version](https://img.shields.io/npm/v/location-from-ip)](https://www.npmjs.com/package/location-from-ip)
[![npm downloads](https://img.shields.io/npm/dm/location-from-ip)](https://www.npmjs.com/package/location-from-ip)

IP geolocation for any IPv4 or IPv6 address: country, state, city, coordinates and timezone, from the [ipapi.is](https://ipapi.is/geolocation.html?ref=npm) API. It works without an API key, in Node.js 18 or newer and in the browser, and has no dependencies.

```sh
npm install location-from-ip
```

```js
const { ipToGeolocation } = require('location-from-ip');

await ipToGeolocation('85.10.199.76');
```

```js
{
  country: 'Germany',
  state: 'Bavaria',
  city: 'Nuremberg',
  latitude: 49.45421,
  longitude: 11.07752,
  timezone: 'Europe/Berlin'
}
```

That is what a lookup without an API key returns, for up to 30 lookups per day and IP address. Without an argument, `ipToGeolocation()` locates the caller.

## In the browser

Greet a visitor by their city, with no backend and no key:

```html
<script src="https://unpkg.com/location-from-ip@2"></script>
<script>
  ipToGeolocation().then((place) => {
    document.body.textContent = place ? `Hello ${place.city}, ${place.country}!` : 'Hello!';
  });
</script>
```

Each visitor has their own 30 lookups a day. Do not put an API key in page JavaScript: it would be public.

## With an API key

A [free account](https://ipapi.is/app/signup?ref=npm) includes 1,000 lookups a day, commercial use allowed, and the complete location. Put the key in the environment as `IPAPI_KEY`, or pass it as `ipToGeolocation(ip, { key })`:

```js
{
  is_eu_member: true,
  calling_code: '49',
  currency_code: 'EUR',
  continent: 'EU',
  country: 'Germany',
  country_code: 'DE',
  state: 'Bavaria',
  city: 'Nuremberg',
  latitude: 49.45421,
  longitude: 11.07752,
  zip: '90403',
  timezone: 'Europe/Berlin',
  local_time: '2026-11-14T20:33:14+01:00',
  local_time_unix: 1794684794,
  is_dst: false,
  utcoffset: '+01:00',
  accuracy: 'VERY_HIGH'
}
```

`accuracy` is `VERY_HIGH`, `HIGH`, `MEDIUM`, `LOW` or `VERY_LOW`: it says how far the city can be trusted. `VERY_HIGH` usually means the network operator published the location itself, in an [RFC 8805 geofeed](https://datatracker.ietf.org/doc/rfc8805/). All fields are described in the [documentation](https://ipapi.is/developers.html?ref=npm#location-object).

`ipToGeolocation()` resolves to `null` for an address that cannot be located, such as a private one. A failed lookup rejects with an `Error` that carries the HTTP `status` and the API's `error_code` as `code`, for example `ERR_INVALID_IP_OR_ASN` or `ERR_FREE_TIER_EXHAUSTED`.

## Upgrading from 1.x

Since 1 September 2026 the API returns the `location` object only with an API key, so version 1 resolves to `null` for every address. Version 2 works with and without a key. Errors now reject instead of resolving to `null`, and the browser file is `index.js` instead of `dist/ipToGeolocation.min.js`.

## More from ipapi.is

- The same lookup also says who owns the address and whether it is a datacenter, a VPN (and which one), a proxy, a Tor exit or a known abuser: [API documentation](https://ipapi.is/developers.html?ref=npm).
- [ipapi.is-node](https://github.com/NikolaiT/ipapi.is-node): the full response, bulk lookups and an Express middleware that blocks VPN, proxy and Tor traffic.
- For lookups without a network call, there is a [free IP geolocation database](https://github.com/ipapi-is/ipapi#free-ip-geolocation-database) (CSV, IPv4 and IPv6, CC BY-SA 4.0) and a more accurate [full one](https://ipapi.is/geolocation.html?ref=npm) in CSV and MMDB.

ISC license.
