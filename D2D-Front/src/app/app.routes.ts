import { Routes } from '@angular/router';
import { HomeComponent } from '../Components/Landing/home/home.component';
import { LoginComponent } from '../Components/Landing/login/login.component';
import { RegisterComponent } from '../Components/Landing/register/register.component';
import { AboutComponent } from '../Components/Landing/about/about.component';
import { FeedbackComponent } from '../Components/Landing/feedback/feedback.component';
import { ServicesComponent } from '../Components/Landing/services/services.component';
import { TechniciansComponent } from '../Components/Landing/technicians/technicians.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signUp', component: RegisterComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: FeedbackComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'technicians', component: TechniciansComponent }
];
