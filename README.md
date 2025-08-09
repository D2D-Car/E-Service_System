# E-Service System (D2D Car Care)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Installation Guide](#installation-guide)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Component Structure](#component-structure)
- [Services Documentation](#services-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Accounts](#accounts)

## 🚗 Overview

E-Service System is a comprehensive car service management platform built as an ITI Summer Training Project. It provides a complete solution for managing car services with separate dashboards for customers, drivers, technicians, and administrators. The system enables seamless booking, tracking, and management of various automotive services.

### 🌐 Live Demo

**Preview URL**: [https://d2ddatabase.web.app/](https://d2ddatabase.web.app/)

### 👥 Team Members

This project was developed by a dedicated team of developers:

- **Yousef Ebrahim Elbaz**
- **Mohamed Saber Ahmed**
- **Yomna Reda Ali**
- **Hana Mohamed Elnegery**
- **Reem Mohamed Elsaid Mohammed**
- **Mahmoud Elsayed Ahmed**
- **Menna Reda Elgazzar**
- **Basma Osama Ahmed**
- **Abduallh Mohamed Abduallh Ebrahim**
- **Basmala Mohamed Abd Elaleem**
- **Ahmed Mohammed Allam**
- **Yousef Elbilkasy**

## ✨ Features

### 🎯 Core Features

- **Multi-Role Management**: Separate interfaces for Admin, Customer, Driver, and Technician
- **Service Booking**: Complete booking system with real-time tracking
- **Interactive Maps**: Location-based services using Leaflet maps
- **Dashboard Analytics**: Comprehensive charts and statistics using Chart.js
- **Firebase Integration**: Real-time database and authentication
- **Responsive Design**: Mobile-first design with Bootstrap 5
- **Real-time Communication**: Live updates and notifications

### 👤 User Roles & Capabilities

#### Admin Dashboard

- User management (customers, drivers, technicians)
- Service management and pricing
- Order tracking and analytics
- Financial reports and statistics
- System configuration and settings
- Project roadmap management

#### Customer Portal

- Service booking and scheduling
- Order history and tracking
- Profile management
- Feedback and reviews
- Payment integration
- Location-based service requests

#### Driver Interface

- Job assignments and navigation
- Route optimization
- Customer communication
- Earnings tracking
- Vehicle management
- Status updates

#### Technician Dashboard

- Service requests management
- Technical diagnostics
- Work order completion
- Tools and inventory tracking
- Skill-based job assignments
- Performance metrics

## 🛠 Technology Stack

### Frontend

- **Framework**: Angular 20.1.6
- **UI Library**: Bootstrap 5.3.7
- **Icons**: FontAwesome 6.5.1
- **Maps**: Leaflet 1.9.4
- **Charts**: Chart.js 4.5.0 with ng2-charts 8.0.0
- **Animations**: Angular Animations
- **HTTP Client**: Angular HTTP Client with RxJS 7.8.2

### Backend & Database

- **Backend as a Service**: Firebase 12.0.0
- **Authentication**: Angular Fire 20.0.1
- **Real-time Database**: Firestore
- **File Storage**: Firebase Storage
- **Hosting**: Firebase Hosting

### Development Tools

- **Language**: TypeScript 5.8.0
- **CSS Preprocessor**: Sass 1.77.0
- **Build Tool**: Angular CLI 20.1.5
- **Linting**: ESLint 9.29.0 with Angular ESLint
- **Testing**: Jasmine & Karma
- **Package Manager**: npm

### Additional Libraries

- **Notifications**: SweetAlert2 11.22.3
- **DOM Manipulation**: jQuery 3.7.1
- **Poppers**: Popper.js 1.16.1
- **Type Definitions**: Various @types packages

## 🏗 Project Architecture

```
D2D-Front/
├── src/
│   ├── app/
│   │   ├── Components/
│   │   │   ├── Admin/           # Admin dashboard modules
│   │   │   ├── Auth/            # Authentication components
│   │   │   ├── Customer/        # Customer portal
│   │   │   ├── Driver/          # Driver interface
│   │   │   ├── Landing/         # Public landing pages
│   │   │   └── TechniciansDashboard/ # Technician workspace
│   │   ├── Services/            # Angular services
│   │   ├── Guards/              # Route protection
│   │   ├── environments/        # Environment configs
│   │   └── directives/          # Custom directives
│   ├── assets/                  # Static assets
│   └── styles.scss             # Global styles
├── public/
│   └── assets/                  # Public assets
├── firebase.json               # Firebase configuration
├── firestore.rules            # Database security rules
└── package.json               # Dependencies
```

## 🚀 Installation Guide

### Prerequisites

- **Node.js**: v20.19.0 or higher
- **npm**: v6.11.0 or higher
- **Angular CLI**: v20.1.5
- **Firebase CLI**: Latest version (for deployment)

### Step-by-Step Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-repo/E-Service_System.git
   cd E-Service_System/D2D-Front
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Firebase Configuration**

   ```bash
   # Install Firebase CLI globally
   npm install -g firebase-tools

   # Login to Firebase
   firebase login

   # Initialize Firebase (if not already done)
   firebase init
   ```

4. **Environment Setup**
   Create environment files in `src/environments/`:

   **environment.ts** (Development)

   ```typescript
   export const environment = {
     production: false,
     firebase: {
       apiKey: "your-api-key",
       authDomain: "your-project.firebaseapp.com",
       projectId: "your-project-id",
       storageBucket: "your-project.appspot.com",
       messagingSenderId: "123456789",
       appId: "your-app-id",
     },
   };
   ```

   **environment.prod.ts** (Production)

   ```typescript
   export const environment = {
     production: true,
     firebase: {
       // Your production Firebase config
     },
   };
   ```

5. **Start Development Server**
   ```bash
   ng serve
   ```
   Navigate to `http://localhost:4200`

## 💡 Usage

### Development Commands

```bash
# Start development server
ng serve

# Build for production
ng build

# Run tests
ng test

# Run e2e tests
ng e2e

# Generate new component
ng generate component component-name

# Generate new service
ng generate service service-name

# Lint code
ng lint
```

### Firebase Commands

```bash
# Deploy to Firebase Hosting
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# View deployment status
firebase hosting:channel:list
```

## 📚 API Documentation

### Firebase Services

#### Authentication Service

- **Login**: Email/password authentication
- **Register**: User registration with role assignment
- **Logout**: Secure session termination
- **Password Reset**: Email-based password recovery

#### Firestore Collections

**Users Collection**

```typescript
interface User {
  uid: string;
  email: string;
  name: string;
  role: "admin" | "customer" | "driver" | "technician";
  phone: string;
  address: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Orders Collection**

```typescript
interface Order {
  id: string;
  customerId: string;
  serviceType: string;
  status: "pending" | "accepted" | "in-progress" | "completed" | "cancelled";
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  assignedDriver?: string;
  assignedTechnician?: string;
  createdAt: Timestamp;
  scheduledAt: Timestamp;
  price: number;
  description: string;
}
```

**Services Collection**

```typescript
interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string;
  isActive: boolean;
}
```

## 🧩 Component Structure

### Admin Components

- **admin-dashboard**: Main dashboard with statistics
- **user-management**: CRUD operations for users
- **order-management**: Order tracking and management
- **service-management**: Service configuration
- **analytics**: Charts and reports
- **project-roadmap**: Development timeline

### Customer Components

- **customer-dashboard**: Personal dashboard
- **service-booking**: Book new services
- **order-history**: View past orders
- **profile**: Profile management
- **feedback**: Leave reviews and ratings

### Driver Components

- **driver-dashboard**: Driver workspace
- **job-assignments**: View assigned jobs
- **navigation**: GPS navigation integration
- **earnings**: Financial tracking
- **vehicle-info**: Vehicle management

### Landing Components

- **home**: Landing page
- **about**: About us page
- **services**: Services showcase
- **contact**: Contact information
- **testimonials**: Customer reviews
- **footer**: Site footer

## 🔧 Services Documentation

### Core Services

#### AuthService

```typescript
class AuthService {
  // Authentication methods
  login(email: string, password: string): Promise<User>;
  register(userData: UserData): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Observable<User | null>;

  // Role-based access
  hasRole(role: string): boolean;
  isAdmin(): boolean;
  isCustomer(): boolean;
}
```

#### UserDataService

```typescript
class UserDataService {
  // User management
  getUserById(uid: string): Observable<User>;
  updateUser(uid: string, data: Partial<User>): Promise<void>;
  deleteUser(uid: string): Promise<void>;

  // Profile management
  updateProfile(data: ProfileData): Promise<void>;
  uploadAvatar(file: File): Promise<string>;
}
```

#### OrderService

```typescript
class OrderService {
  // Order operations
  createOrder(orderData: OrderData): Promise<string>;
  getOrders(userId?: string): Observable<Order[]>;
  updateOrderStatus(orderId: string, status: string): Promise<void>;
  cancelOrder(orderId: string): Promise<void>;

  // Real-time tracking
  trackOrder(orderId: string): Observable<Order>;
}
```

#### ThemeService

```typescript
class ThemeService {
  // Theme management
  setTheme(theme: "light" | "dark"): void;
  getCurrentTheme(): string;
  toggleTheme(): void;
}
```

## 🌐 Deployment

### Firebase Hosting Deployment

1. **Build for Production**

   ```bash
   ng build --configuration production
   ```

2. **Deploy to Firebase**

   ```bash
   firebase deploy
   ```

3. **Custom Domain Setup** (Optional)
   ```bash
   firebase hosting:sites:create your-domain
   firebase target:apply hosting production your-domain
   ```

### Environment-Specific Deployments

```bash
# Deploy to staging
firebase deploy --project staging

# Deploy to production
firebase deploy --project production

# Deploy specific functions
firebase deploy --only functions

# Deploy with specific version
firebase deploy --message "Version 1.2.3"
```

### CI/CD Pipeline

The project includes GitHub Actions workflows:

- **firebase-hosting-merge.yml**: Auto-deploy on main branch
- **firebase-hosting-pull-request.yml**: Deploy preview for PRs

## 🤝 Contributing

### Development Workflow

1. **Fork the Repository**
2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make Changes**
4. **Run Tests**
   ```bash
   ng test
   ng lint
   ```
5. **Commit Changes**
   ```bash
   git commit -m "feat: add new feature"
   ```
6. **Push to Branch**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create Pull Request**

### Code Style Guidelines

- Follow Angular Style Guide
- Use meaningful component and service names
- Write comprehensive unit tests
- Document complex functions
- Use TypeScript strict mode
- Follow conventional commit messages

### Component Development Standards

```typescript
// Component template
@Component({
  selector: "app-component-name",
  templateUrl: "./component-name.component.html",
  styleUrls: ["./component-name.component.scss"],
})
export class ComponentNameComponent implements OnInit, OnDestroy {
  // Properties
  private destroy$ = new Subject<void>();

  constructor(private service: SomeService) {}

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeComponent(): void {
    // Initialization logic
  }
}
```

## 🐛 Troubleshooting

### Common Issues

#### Build Errors

```bash
# Clear Angular cache
ng cache clean

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Update Angular CLI
npm update -g @angular/cli
```

#### Firebase Connection Issues

```bash
# Check Firebase configuration
firebase projects:list

# Verify authentication
firebase auth:revoke

# Re-login
firebase login
```

#### Map Display Issues

- Ensure Leaflet CSS is imported in styles.scss
- Check if marker icons are correctly referenced
- Verify map container has defined height

#### Chart Rendering Problems

- Import Chart.js modules in app.module.ts
- Ensure canvas element has proper dimensions
- Check data format compatibility

### Performance Optimization

1. **Lazy Loading**

   ```typescript
   const routes: Routes = [
     {
       path: "admin",
       loadChildren: () => import("./admin/admin.module").then((m) => m.AdminModule),
     },
   ];
   ```

2. **OnPush Change Detection**

   ```typescript
   @Component({
     changeDetection: ChangeDetectionStrategy.OnPush
   })
   ```

3. **Image Optimization**
   - Use WebP format when possible
   - Implement lazy loading for images
   - Compress images before deployment

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:

- **Email**: support@d2dcare.com
- **Documentation**: [Wiki](https://github.com/your-repo/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)

## 🗺 Roadmap

### Version 2.0 (Planned)

- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] AI-powered service recommendations
- [ ] Multi-language support
- [ ] Payment gateway integration

### Version 1.x (Current)

- [x] Core service booking system
- [x] Multi-role dashboards
- [x] Real-time tracking
- [x] Firebase integration
- [x] Responsive design

---

**Built with ❤️ by the D2D Care Team**

_Last Updated: August 2025_

## Accounts

### Customer

- **Email**: youseffelbazz.1@gmail.com
- **Password**: 12345678

### Driver

- **Email**: Driver@gmail.com
- **Password**: 12345678

### Technician

- **Email**: tech@gmail.com
- **Password**: 12345678

### Admin

- **Email**: abduallhshadow@gmail.com
- **Password**: 12345678
