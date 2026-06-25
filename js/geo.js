function detectLocation(onResult) {
  if (!navigator.geolocation) {
    onResult(null);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const url =
          "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" +
          lat + "&longitude=" + lon + "&localityLanguage=en";
        const response = await fetch(url);
        const data = await response.json();
        onResult({
          country: data.countryName,
          countryCode: data.countryCode,
          city: data.city || data.locality || ""
        });
      } catch (error) {
        onResult(null);
      }
    },
    () => onResult(null)
  );
}