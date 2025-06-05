
import { useState, useEffect } from 'react';

export const useGeolocation = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  
  // Default fallback location (Addis Ababa)
  const defaultLocation: [number, number] = [9.0307, 38.7407];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          console.log('User location obtained:', latitude, longitude);
        },
        (error) => {
          console.log('Geolocation error:', error.message);
          console.log('Using default location (Addis Ababa)');
          setUserLocation(defaultLocation);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 300000 // Cache for 5 minutes
        }
      );
    } else {
      console.log('Geolocation not supported, using default location');
      setUserLocation(defaultLocation);
    }
  }, []);

  return { userLocation, defaultLocation };
};
