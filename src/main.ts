import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
  providers: [
        provideAnimations(), // Add this line
    ...appConfig.providers, 
    importProvidersFrom(HttpClientModule) ,provideHttpClient()
  ]
 
}).catch(err => console.error(err));

