// @ts-ignore
declare var process: any;

export const environment = {
  production: true,
  firebase: {
    apiKey: process?.env?.['NG_APP_FIREBASE_API_KEY'] || "AIzaSyBef27wt27Y59ko3iTHE97Ap2UL-DpOhR0",
    authDomain: process?.env?.['NG_APP_FIREBASE_AUTH_DOMAIN'] || "d2ddatabase.firebaseapp.com",
    databaseURL: process?.env?.['NG_APP_FIREBASE_DATABASE_URL'] || "https://d2ddatabase-default-rtdb.firebaseio.com",
    projectId: process?.env?.['NG_APP_FIREBASE_PROJECT_ID'] || "d2ddatabase",
    storageBucket: process?.env?.['NG_APP_FIREBASE_STORAGE_BUCKET'] || "d2ddatabase.firebasestorage.app",
    messagingSenderId: process?.env?.['NG_APP_FIREBASE_MESSAGING_SENDER_ID'] || "49961156364",
    appId: process?.env?.['NG_APP_FIREBASE_APP_ID'] || "1:49961156364:web:40dd7d0207127ca2d65329",
    measurementId: process?.env?.['NG_APP_FIREBASE_MEASUREMENT_ID'] || "G-XS6P2WGWNY"
  },
  recaptcha: {
    siteKey: process?.env?.['NG_APP_RECAPTCHA_SITE_KEY'] || "your-recaptcha-site-key"
  }
};
