import { useEffect } from "react";

export default function useServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service worker registered", registration);
        })
        .catch((err) => {
          console.error("Service worker registration failed", err);
        });
    }
  }, []);
}
