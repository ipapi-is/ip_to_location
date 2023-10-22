# IP to Location

[![Npm package version](https://badgen.net/npm/v/location-from-ip)](https://www.npmjs.com/package/location-from-ip)
[![Npm package yearly downloads](https://badgen.net/npm/dy/location-from-ip)](https://npmjs.com/package/location-from-ip)

The npm package `location-from-ip` gives IP Geolocation information for every IPv4 or IPv6 address.

Currently, there are millions of different geolocation records in the database. Learn more, by [reading the documentation](https://ipapi.is/geolocation.html).

## Installation

You can both use this package from Node.js and in the browser with vanilla JavaScript.

```bash
npm install location-from-ip
```

If you want to clone the repository directly from GitHub instead:

```bash
git clone git@github.com:ipapi-is/ip_to_location.git
```

## Usage from Node.js

If you want to lookup the IP address `144.168.164.55`:

```JavaScript
const { ipToGeolocation } = require('location-from-ip');

const ipAddresses = [
  '144.168.164.55',
  '167.99.241.66',
  '97.107.129.77',
  '85.10.199.76',
];

for (let ip of ipAddresses) {
  ipToGeolocation(ip).then(function (location) {
    console.log(`${ip} geolocation:`);
    console.log(location);
  });
}
```

which yields:

```JavaScript
167.99.241.66 geolocation:
{
  continent: 'EU',
  country: 'Germany',
  country_code: 'DE',
  state: 'Hesse',
  city: 'Frankfurt am Main',
  latitude: 50.1109,
  longitude: 8.68213,
  zip: '07022',
  timezone: 'Europe/Berlin',
  local_time: '2023-10-22T13:36:01+02:00',
  local_time_unix: 1697974561,
  is_dst: true
}
85.10.199.76 geolocation:
{
  continent: 'EU',
  country: 'Germany',
  country_code: 'DE',
  state: 'Bavaria',
  city: 'Nürnberg',
  latitude: 49.45421,
  longitude: 11.07752,
  zip: '90403',
  timezone: 'Europe/Berlin',
  local_time: '2023-10-22T13:36:01+02:00',
  local_time_unix: 1697974561,
  is_dst: true
}
97.107.129.77 geolocation:
{
  continent: 'NA',
  country: 'United States',
  country_code: 'US',
  state: 'New Jersey',
  city: 'Morris Plains',
  latitude: 40.82177,
  longitude: -74.48099,
  zip: '07927',
  timezone: 'America/New_York',
  local_time: '2023-10-22T07:36:01-04:00',
  local_time_unix: 1697974561,
  is_dst: true
}
144.168.164.55 geolocation:
{
  continent: 'NA',
  country: 'Canada',
  country_code: 'CA',
  state: 'Quebec',
  city: "Baie-D'Urfé",
  latitude: 45.41397,
  longitude: -73.91586,
  zip: 'H9X',
  timezone: 'America/Toronto',
  local_time: '2023-10-22T07:36:01-04:00',
  local_time_unix: 1697974561,
  is_dst: true
}
```

## Usage from the Browser

Copy the browser JavaScript bundle to your preferred location. After installing the module with

```bash
npm install location-from-ip
```

you can find the minified JavaScript here: `node_modules/location-from-ip/dist/ipToGeolocation.min.js`

```html
<!doctype html>

<html lang="en">

<head>
  <meta charset="utf-8">
  <title>IP to Geolocation Example in Browser</title>
  <meta name="description" content="IP to Geolocation Example">
  <meta name="author" content="ipapi.is">
</head>

<body>
  <pre id="location"></pre>
  <script type="text/javascript" src="dist/ipToGeolocation.min.js"></script>
  <script type="text/javascript">
    ipToGeolocation('43.33.44.11').then((res) => {
      document.getElementById('location').innerText = JSON.stringify(res, null, 2);
    });
  </script>
</body>

</html>
```

## Use the Database Directly

This package uses the [ipapi.is geolocation database](https://ipapi.is/geolocation.html) in order to avoid shipping a huge database in the npm module. If you have a large volume of IP addresses to lookup, you can download the full & free [Geolocation Database](https://ipapi.is/geolocation.html).

GitHub mirror of the database: [Geolocation Database](https://github.com/ipapi-is/ipapi/tree/main/databases)
