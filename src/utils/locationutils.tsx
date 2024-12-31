export const getLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          console.log(`Location: ${latitude}, ${longitude}, Accuracy: ${accuracy}`);
          resolve({ lat: latitude, lng: longitude });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    } else {
      reject(new Error('Geolocation is not supported by this browser.'));
    }
  });
};