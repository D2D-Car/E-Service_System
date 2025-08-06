import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './drivers.component.html',
  styleUrl: './drivers.component.css',
})
export class DriversComponent {
  showAddDriverForm = false;
  showAddDriverModal = false;

  // المعاينة قبل الحفظ
  previewImage: string | null = null;

  newDriver = {
    name: '',
    licenseNumber: '',
    experience: '',
    vehicleType: '',
    joined: '',
    rating: 0,
    totalTrips: 0,
    email: '',
    password: '',
    image: ''
  };

  drivers = [
    {
      id: 1,
      name: 'Mahmoud Reda',
      licenseNumber: 'EG-DL-123456',
      experience: '5 Years',
      image: './assets/dashboard-img/friend-01.jpg',
      joined: 'Jan 2022',
      rating: 4.8,
      totalTrips: 1250,
      vehicleType: 'Sedan',
      email: 'mahmoud@example.com',
      password: '****'
    },
    {
      id: 2,
      name: 'Omar Khaled',
      licenseNumber: 'EG-DL-789012',
      experience: '3 Years',
      image: './assets/dashboard-img/friend-02.jpg',
      joined: 'May 2023',
      rating: 4.6,
      totalTrips: 890,
      vehicleType: 'SUV',
      email: 'omar@example.com',
      password: '****'
    },
    {
      id: 3,
      name: 'Hassan Ali',
      licenseNumber: 'EG-DL-345678',
      experience: '7 Years',
      image: './assets/dashboard-img/friend-03.jpg',
      joined: 'Aug 2021',
      rating: 4.9,
      totalTrips: 2100,
      vehicleType: 'Pickup',
      email: 'hassan@example.com',
      password: '****'
    },
    {
      id: 4,
      name: 'Ahmed Nasser',
      licenseNumber: 'EG-DL-901234',
      experience: '2 Years',
      image: './assets/dashboard-img/friend-04.jpg',
      joined: 'Oct 2023',
      rating: 4.4,
      totalTrips: 520,
      vehicleType: 'Sedan',
      email: 'ahmed@example.com',
      password: '****'
    },
    {
      id: 5,
      name: 'Youssef Ibrahim',
      licenseNumber: 'EG-DL-567890',
      experience: '4 Years',
      image: './assets/dashboard-img/friend-05.jpg',
      joined: 'Dec 2022',
      rating: 4.7,
      totalTrips: 950,
      vehicleType: 'Van',
      email: 'youssef@example.com',
      password: '****'
    },
    {
      id: 6,
      name: 'Karim Fouad',
      licenseNumber: 'EG-DL-234567',
      experience: '6 Years',
      image: './assets/dashboard-img/friend-01.jpg',
      joined: 'Mar 2021',
      rating: 4.8,
      totalTrips: 1680,
      vehicleType: 'SUV',
      email: 'karim@example.com',
      password: '****'
    },
    {
      id: 7,
      name: 'Tamer Said',
      licenseNumber: 'EG-DL-678901',
      experience: '8 Years',
      image: './assets/dashboard-img/friend-02.jpg',
      joined: 'Jun 2020',
      rating: 5.0,
      totalTrips: 2850,
      vehicleType: 'Pickup',
      email: 'tamer@example.com',
      password: '****'
    },
    {
      id: 8,
      name: 'Mostafa Ahmed',
      licenseNumber: 'EG-DL-012345',
      experience: '3 Years',
      image: './assets/dashboard-img/friend-03.jpg',
      joined: 'Sep 2023',
      rating: 4.5,
      totalTrips: 720,
      vehicleType: 'Sedan',
      email: 'mostafa@example.com',
      password: '****'
    },
  ];

  toggleAddDriverForm() {
    this.showAddDriverForm = !this.showAddDriverForm;
  }

  openAddDriverModal() {
    this.showAddDriverModal = true;
  }

  closeAddDriverModal() {
    this.showAddDriverModal = false;
    this.previewImage = null; // مسح المعاينة عند الغلق
  }

  // اختيار الصورة + معاينة قبل الحفظ
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // إضافة السائق
  addDriver() {
    if (
      !this.newDriver.name ||
      !this.newDriver.licenseNumber ||
      !this.newDriver.experience ||
      !this.newDriver.vehicleType ||
      !this.newDriver.joined ||
      !this.newDriver.rating ||
      !this.newDriver.totalTrips ||
      !this.newDriver.email ||
      !this.newDriver.password ||
      !this.previewImage
    ) {
      return;
    }

    const newDriverData = {
      ...this.newDriver,
      id: this.drivers.length + 1,
      image: this.previewImage // استخدام المعاينة كصورة السائق
    };

    this.drivers.push(newDriverData);

    // تصفير البيانات
    this.newDriver = {
      name: '',
      licenseNumber: '',
      experience: '',
      vehicleType: '',
      joined: '',
      rating: 0,
      totalTrips: 0,
      email: '',
      password: '',
      image: ''
    };
    this.previewImage = null;

    this.closeAddDriverModal();
  }

  callDriver(driver: any) {
    alert(`License: ${driver.licenseNumber} - ${driver.experience} experience`);
  }

  emailDriver(driver: any) {
    alert(`${driver.name} has completed ${driver.totalTrips} trips with ${driver.rating}⭐ rating`);
  }

  viewDriverProfile(driver: any) {
    console.log('Viewing profile of driver:', driver.name);
  }

  removeDriver(driver: any) {
    const confirmRemove = confirm(`Are you sure you want to remove ${driver.name}?`);
    if (confirmRemove) {
      this.drivers = this.drivers.filter((d) => d.id !== driver.id);
    }
  }

  togglePasswordVisibility() {
  const passwordInput = document.getElementById('passwordField') as HTMLInputElement;
  const toggleIcon = document.getElementById('togglePassword') as HTMLElement;

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleIcon.classList.remove('fa-eye');
    toggleIcon.classList.add('fa-eye-slash');
  } else {
    passwordInput.type = 'password';
    toggleIcon.classList.remove('fa-eye-slash');
    toggleIcon.classList.add('fa-eye');
  }
}


}
