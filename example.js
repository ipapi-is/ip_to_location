const { ipToGeolocation } = require('./src/ip_to_loc');

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