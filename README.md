
# E-Service_System

## Overview

E-Service_System is an ITI Summer Training Project designed to provide a comprehensive car service management platform. The main frontend application is located in the `D2D-Front` directory and is built with Angular 20. The system includes modules for customers, drivers, technicians, administrators, and more, supporting a variety of service workflows.

## Features

- Modern Angular 20 frontend
- Modular structure for Admin, Auth, Customer, Driver, Landing, and Technicians Dashboard
- Interactive dashboard and landing page
- Integrated with Firebase for backend services
- Uses Bootstrap 5 and FontAwesome for UI
- Map and chart visualizations (Leaflet, Chart.js)
- Feedback, testimonials, and about sections

## Project Structure

- `D2D-Front/` — Main Angular frontend application
  - `src/app/Components/` — Feature modules (Admin, Auth, Customer, Driver, Landing, TechniciansDashboard)
  - `src/app/Services/` — Angular services (auth, theme, user data, etc.)
  - `src/app/Guards/` — Route guards
  - `src/app/environments/` — Environment configs
  - `public/assets/` — Images and static assets
- `accounts.json` — Account data (if applicable)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Angular CLI (`npm install -g @angular/cli`)

### Installation

1. Install dependencies:
   ```powershell
   npm install
   ```

### Running the Development Server

Start the Angular development server:

```powershell
ng serve
```

Open your browser at [http://localhost:4200](http://localhost:4200) to view the app.

### Building for Production

To build the project for production:

```powershell
ng build
```

### Testing

Run unit tests:

```powershell
ng test
```

## Technologies Used

- Angular 20
- Bootstrap 5
- FontAwesome
- Firebase
- Leaflet (maps)
- Chart.js (charts)
- RxJS

## Useful Commands

- Generate a new component:
  ```powershell
  ng generate component component-name
  ```
- List available schematics:
  ```powershell
  ng generate --help
  ```

## License

This project is licensed under the MIT License.
