import { ApplicationConfig, provideBrowserGlobalErrorListeners,} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from './enviroment';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';


export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(()=> getFirestore()),
    provideAuth(() => getAuth()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};
