import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator && typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          registration => {
            console.log('Service Worker registered: ', registration);
          },
          error => {
            console.log('Service Worker registration failed: ', error);
          }
        );
      });
    }
  }, []);
  
  return <Component {...pageProps} />;
}