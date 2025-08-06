import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth, connectAuthEmulator } from '@angular/fire/auth';
import { getFirestore, provideFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => {
      const app = initializeApp(environment.firebase);
      return app;
    }),
    provideAuth(() => {
      const auth = getAuth();
      // Only connect to emulator in development and if not already connected
      if (!environment.production && !auth.app.options.authDomain?.includes('localhost')) {
        try {
          // connectAuthEmulator(auth, 'http://localhost:9099');
        } catch (error) {
          console.log('Auth emulator already connected or not available');
        }
      }
      return auth;
    }),
    provideFirestore(() => {
      const firestore = getFirestore();
      // Only connect to emulator in development and if not already connected
      if (!environment.production) {
        try {
          // connectFirestoreEmulator(firestore, 'localhost', 8080);
        } catch (error) {
          console.log('Firestore emulator already connected or not available');
        }
      }
      return firestore;
    })
  ]
};
