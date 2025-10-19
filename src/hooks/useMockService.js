import { useEffect, useState } from 'react';

export const useMockService = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeMocks = async () => {
      // Проверяем, находится ли приложение в режиме разработки
      if (process.env.NODE_ENV === 'development') {
        try {
          const { worker } = await import('../mocks/browser');
          await worker.start({
            onUnhandledRequest: 'bypass',
            serviceWorker: {
              url: '/mockServiceWorker.js',
            },
          });
          console.log('Mock Service Worker запущен');
          setIsInitialized(true);
        } catch (error) {
          console.warn('Не удалось запустить Mock Service Worker:', error);
          setIsInitialized(true);
        }
      } else {
        setIsInitialized(true);
      }
    };

    initializeMocks();
  }, []);

  return isInitialized;
};