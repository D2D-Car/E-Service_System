import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { VehiclesComponent } from '../vehicles/vehicles.component';
import { ServiceHistoryComponent } from '../service-history/service-history.component';
import { CustomerProfileComponent } from '../profile/profile.component';
import { FirebaseServiceService, ServiceBooking, UpcomingService } from '../../../Services/firebase-service.service';
import { AuthService } from '../../../Services/auth.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';


interface RecentActivity {
  icon: string;
  title: string;
  description: string;
  time: string;
}


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, VehiclesComponent, ServiceHistoryComponent, CustomerProfileComponent, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  activeTab: string = 'dashboard';
  private subscriptions: Subscription[] = [];
  isLoading = false;
  errorMessage = '';

  upcomingServices: UpcomingService[] = [];
  allServices: ServiceBooking[] = [];

  recentActivities: RecentActivity[] = [
    {
      icon: '🔧',
      title: 'Oil Change Completed',
      description: 'Service completed for Toyota Camry',
      time: '2 hours ago'
    },
    {
      icon: '🚗',
      title: 'Vehicle Added',
      description: 'New vehicle Honda Civic added to profile',
      time: '1 day ago'
    },
    {
      icon: '📅',
      title: 'Appointment Scheduled',
      description: 'Brake inspection scheduled for Aug 20',
      time: '2 days ago'
    },
    {
      icon: '💰',
      title: 'Payment Processed',
      description: 'Payment of $85.00 processed for oil change',
      time: '3 days ago'
    }
  ];

  // Modal state
  showAddServiceModal: boolean = false;
  isGettingLocation: boolean = false;
  currentLocation: string = '';

  addServiceForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseServiceService,
    private authService: AuthService
  ) {
    this.addServiceForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      technician: ['', Validators.required],
      vehicle: ['', Validators.required],
      date: ['', Validators.required],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      serviceType: ['General Service', Validators.required],
      location: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadUserData(): void {
    // Subscribe to upcoming services
    const upcomingSub = this.firebaseService.getCurrentUserUpcomingServices().subscribe(
      (services) => {
        this.upcomingServices = services;
        console.log('Upcoming services loaded:', services);
      },
      (error) => {
        console.error('Error loading upcoming services:', error);
      }
    );

    // Subscribe to all services for service history
    const servicesSub = this.firebaseService.getCurrentUserServices().subscribe(
      (services) => {
        this.allServices = services;
        console.log('All services loaded:', services);
      },
      (error) => {
        console.error('Error loading services:', error);
      }
    );

    this.subscriptions.push(upcomingSub, servicesSub);
  }

  openAddServiceModal(): void {
    console.log('Customer Dashboard: Opening modal...');
    console.log('Customer Dashboard: Current showAddServiceModal value:', this.showAddServiceModal);
    this.showAddServiceModal = true;
    console.log('Customer Dashboard: showAddServiceModal set to:', this.showAddServiceModal);
    this.addServiceForm.reset({
      title: '',
      description: '',
      price: 0,
      technician: '',
      vehicle: '',
      date: '',
      rating: 5,
      serviceType: 'General Service',
      location: ''
    });
    console.log('Customer Dashboard: Modal should be visible now');
    
    // Force change detection
    setTimeout(() => {
      console.log('Customer Dashboard: Modal state after timeout:', this.showAddServiceModal);
    }, 100);
  }

  closeAddServiceModal(): void {
    this.showAddServiceModal = false;
    this.errorMessage = '';
    this.addServiceForm.reset({
      title: '',
      description: '',
      price: 0,
      technician: '',
      vehicle: '',
      date: '',
      rating: 5,
      serviceType: 'General Service',
      location: ''
    });
  }

  async addNewService(): Promise<void> {
    if (this.addServiceForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const formValue = this.addServiceForm.value;
      console.log('Customer Dashboard: Adding new service with form data:', formValue);
      
      try {
        // Prepare service data for Firebase
        const serviceData = {
          title: formValue.title,
          description: formValue.description,
          price: formValue.price,
          technician: formValue.technician,
          vehicle: formValue.vehicle,
          serviceDate: new Date(formValue.date),
          rating: formValue.rating,
          serviceType: formValue.serviceType,
          location: formValue.location
        };

        // Add service to Firebase
        const serviceId = await this.firebaseService.addServiceBooking(serviceData);
        console.log('Customer Dashboard: Service added to Firebase with ID:', serviceId);

        // Close modal and show success message
        this.closeAddServiceModal();
        
        // Show SweetAlert success message
      Swal.fire({
  icon: 'success',
  title: 'Success!',
  text: 'Service booked successfully.',
  confirmButtonText: 'OK',
  confirmButtonColor: '#3085d6'
});
        
      } catch (error: any) {
        console.error('Customer Dashboard: Error adding service:', error);
        if (error.message && error.message.includes('Permission denied')) 
          
        {
Swal.fire({
    icon: 'error',
    title: 'Permission Denied',
    text: 'Please check your account permissions or contact support.',
    confirmButtonText: 'OK',
    confirmButtonColor: '#d33'
  });        } 
        
        else {

          Swal.fire({
    icon: 'error',
    title: 'Booking Failed',
    text: 'Failed to book service. Please try again.',
    confirmButtonText: 'OK',
    confirmButtonColor: '#d33'
  });

        }
      } finally {
        this.isLoading = false;
      }
    } else {
      console.log('Customer Dashboard: Form is invalid:', this.addServiceForm.errors);
      // Mark all fields as touched to show validation errors
      Object.keys(this.addServiceForm.controls).forEach(key => {
        this.addServiceForm.get(key)?.markAsTouched();
      });
    }
  }

  // Get field error message
  getFieldError(fieldName: string): string {
    const field = this.addServiceForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['min']) return `${fieldName} must be greater than 0`;
    }
    return '';
  }

  // Get current location
  getCurrentLocation(): void {
    if (!navigator.geolocation) {
  Swal.fire({
  icon: 'error',
  title: 'Error',
  text: 'Your browser does not support location services.',
  confirmButtonText: 'OK',
  confirmButtonColor: '#d33'
});

      return;
    }

    this.isGettingLocation = true;
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Use reverse geocoding to get address
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=YOUR_API_KEY&language=ar&pretty=1`
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data.results && data.results.length > 0) {
              const address = data.results[0].formatted;
              this.currentLocation = address;
              this.addServiceForm.patchValue({ location: address });
            } else {
              // Fallback to coordinates if no address found
              this.currentLocation = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
              this.addServiceForm.patchValue({ location: this.currentLocation });
            }
          } else {
            // Fallback to coordinates if API fails
            this.currentLocation = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            this.addServiceForm.patchValue({ location: this.currentLocation });
          }
          
       Swal.fire({
  icon: 'success',
  title: 'Location Found',
  text: 'Your current location has been detected.',
  timer: 2000,
  showConfirmButton: false,
  toast: true,
  position: 'top-end'
});

        } catch (error) {
          console.error('Error getting location details:', error);
          // Use coordinates as fallback
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.currentLocation = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          this.addServiceForm.patchValue({ location: this.currentLocation });
          
       Swal.fire({
  icon: 'info',
  title: 'Location Detected',
  text: 'Your location coordinates have been obtained',
  timer: 2000,
  showConfirmButton: false
});

        } finally {
          this.isGettingLocation = false;
        }
      },
      (error) => {
        this.isGettingLocation = false;
let errorMessage = 'Failed to determine location';

switch (error.code) {
  case error.PERMISSION_DENIED:
    errorMessage = 'Permission to access location was denied';
    break;
  case error.POSITION_UNAVAILABLE:
    errorMessage = 'Location information is unavailable';
    break;
  case error.TIMEOUT:
    errorMessage = 'Location request timed out';
    break;
}
        
    Swal.fire({
  icon: 'error',
  title: 'Location Error',
  text: errorMessage,
  confirmButtonText: 'OK',
  confirmButtonColor: '#d33'
});

      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  // Get today's date in YYYY-MM-DD format for date input min attribute
  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
