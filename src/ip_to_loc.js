const https = require('https');

function ipToGeolocation(ip) {
  return new Promise(function (resolve) {
    const options = {
      hostname: 'api.ipapi.is',
      port: 443,
      path: '/?q=' + ip,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const req = https.request(options, function (res) {
      res.on('data', function (response) {
        try {
          let parsed = JSON.parse(response);
          if (parsed && parsed.location) {
            resolve(parsed.location);
          }
        } catch (err) { }
        resolve(null);
      });
    });

    req.on('error', function (error) {
      reject(null);
    });

    req.end();
  });
}

exports.ipToGeolocation = ipToGeolocation;