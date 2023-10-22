function ipToGeolocation(ip) {
  return new Promise(function (resolve) {
    fetch(`https://api.ipapi.is/?q=${ip}`)
      .then(res => res.json())
      .then(function (parsed) {
        try {
          if (parsed && parsed.location) {
            resolve(parsed.location);
          }
        } catch (err) { }
        resolve(null);
      });
  });
}