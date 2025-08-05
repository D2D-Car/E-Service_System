import { Routes } from '@angular/router';

// Landing Page Components
import { HomeComponent } from '../Components/Landing/home/home.component';
import { LoginComponent } from '../Components/Landing/login/login.component';
import { RegisterComponent } from '../Components/Landing/register/register.component';
import { AboutComponent } from '../Components/Landing/about/about.component';
import { FeedbackComponent } from '../Components/Landing/feedback/feedback.component';
import { ServicesComponent } from '../Components/Landing/services/services.component';
import { TechniciansComponent as LandingTechniciansComponent } from '../Components/Landing/technicians/technicians.component';

// Admin Components
import { DashboardComponent as AdminDashboardComponent } from '../Components/Admin/dashboard/dashboard.component';
import { DashboardHomeComponent } from '../Components/Admin/dashboard-home/dashboard-home.component';
import { CustomersComponent } from '../Components/Admin/customers/customers.component';
import { DriversComponent } from '../Components/Admin/drivers/drivers.component';
import { TechniciansComponent as AdminTechniciansComponent } from '../Components/Admin/technicians/technicians.component';
import { OrdersComponent } from '../Components/Admin/orders/orders.component';
import { StockComponent } from '../Components/Admin/stock/stock.component';
import { FinancialComponent } from '../Components/Admin/financial/financial.component';

// Customer Components
import { DashboardComponent as CustomerDashboardComponent } from '../Components/Customer/dashboard/dashboard.component';
import { VehiclesComponent } from '../Components/Customer/vehicles/vehicles.component';
import { ServiceHistoryComponent } from '../Components/Customer/service-history/service-history.component';
import { ProfileComponent as CustomerProfileComponent } from '../Components/Customer/profile/profile.component';

// Technician Dashboard Components
import { TechniciansDashboardComponent } from '../Components/TechniciansDashboard/dashboard/dashboard.component';
import { JobsComponent } from '../Components/TechniciansDashboard/jobs/jobs.component';
import { TechnicianEarningsComponent } from '../Components/TechniciansDashboard/earnings/earnings.component';
import { ProfileComponent as TechnicianProfileComponent } from '../Components/TechniciansDashboard/profile/profile.component';

export const routes: Routes = [
  // Landing Page Routes
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signUp', component: RegisterComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: FeedbackComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'technicians', component: LandingTechniciansComponent },

  // Customer Dashboard with Child Routes
  {
    path: 'customer',
    component: CustomerDashboardComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: CustomerDashboardComponent },
      { path: 'vehicles', component: VehiclesComponent },
      { path: 'service-history', component: ServiceHistoryComponent },
      { path: 'profile', component: CustomerProfileComponent },
    ],
  },

  // Legacy Customer Routes (redirects to new structure)
  { path: 'dashboard', redirectTo: '/customer/dashboard', pathMatch: 'full' },
  { path: 'vehicles', redirectTo: '/customer/vehicles', pathMatch: 'full' },
  {
    path: 'service-history',
    redirectTo: '/customer/service-history',
    pathMatch: 'full',
  },

  // Technician Dashboard with Child Routes
  {
    path: 'technician',
    component: TechniciansDashboardComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: TechniciansDashboardComponent },
      { path: 'jobs', component: JobsComponent },
      { path: 'earnings', component: TechnicianEarningsComponent },
      { path: 'profile', component: TechnicianProfileComponent },
    ],
  },

  // Legacy Technician Routes (redirects to new structure)
  { path: 'jobs', redirectTo: '/technician/jobs', pathMatch: 'full' },
  {
    path: 'technician-earnings',
    redirectTo: '/technician/earnings',
    pathMatch: 'full',
  },

  // Admin Dashboard with Child Routes
  {
    path: 'admin',
    component: AdminDashboardComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardHomeComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'drivers', component: DriversComponent },
      { path: 'technicians', component: AdminTechniciansComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'stock', component: StockComponent },
      { path: 'financial', component: FinancialComponent },
    ],
  },

  // Fallback - redirect to home page for unknown routes
  { path: '**', redirectTo: '/home' },
];
