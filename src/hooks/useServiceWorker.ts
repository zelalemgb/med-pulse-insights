
import { useEffect } from "react";
import { logger } from '@/utils/logger';

function useServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          logger.log("Service worker registered", registration);
        })
        .catch((err) => {
          logger.error("Service worker registration failed", err);
        });
    }
  }, []);
}

export default useServiceWorker;
