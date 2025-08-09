import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-driver-profile',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './driver-profile.component.html',
  styleUrl: './driver-profile.component.css'
})
export class DriverProfileComponent {
  isNavbarCollapsed = true;
  activeLink: string = 'personal';
  profileForm: FormGroup;
  isEditable = false;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      fullName: ['Mike Johnson'],
      phoneNumber: ['+1 (555) 123-4567'],
      emailAddress: ['mike.johnson@gmail.com'],
      dateOfBirth: ['15/03/1985'],
      homeAddress: ['123 Main Street, Apt 4B New York, NY 10001'],
      emergencyContact: ['Sarah Johnson +1 (555) 987-6543'],
      relationship: ['Spouse']
    });
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  setActiveLink(link: string) {
    this.activeLink = link;
  }

editProfileInfo() {
  if (this.isEditable) {
    Swal.fire({
      icon: 'success',
      title: 'Data saved',
      showConfirmButton: false,
      timer: 1500
    });
    this.isEditable = false;
    this.profileForm.disable();
  } else {
    this.isEditable = true;
    this.profileForm.enable();
  }
}


  ngOnInit() {
    this.profileForm.disable();
  }
}
