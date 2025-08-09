import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Firestore, collection, query, where, onSnapshot, orderBy } from '@angular/fire/firestore';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css'],
})
export class JobsComponent implements OnInit {
  userName = 'John Doe';
  userRate = 4.8;
  reviewCount = 1250;
  jobsCompleted = 24;
  dailyRevenue = 150;
  weeklyRevenue = 1250;
  isAvailable = true;

  jobs: any[] = []; // dynamic now
  private jobsUnsub?: () => void;

  performanceData = {
    jobsCompleted: 50,
    averageRate: 4.9,
    responseTime: '30 min',
    completionRate: '95%',
  };

  topServices = [
    { service: 'Brake Repair', price: '$150', count: 12 },
    { service: 'Engine Tune-up', price: '$200', count: 8 },
    { service: 'Oil Change', price: '$50', count: 20 },
  ];

  specialties: string[] = ['Brake Systems', 'Engine Repair', 'Tire Services'];
  newSpecialty = '';

  // Modal control
  modalOpen = false;
  selectedJob: any = null;
  loadingDetails = false;

  constructor(private firestore: Firestore, private auth: AuthService) {}

  ngOnInit(): void { this.subscribeJobs(); }

  private subscribeJobs() {
    const user = this.auth.getCurrentUser();
    if (!user) return;
    const ref = collection(this.firestore, 'adminOrders');
    const q = query(ref, where('assignedTechnicianIds', 'array-contains', user.uid), orderBy('createdAt','desc'));
    this.jobsUnsub = onSnapshot(q, snap => {
      const list: any[] = [];
      snap.forEach(d => {
        const data:any = d.data();
        list.push({
          id: d.id,
          title: data.serviceType,
          status: data.fulfillment === 'Fulfilled' ? 'Completed' : (data.status || 'Pending'),
          customerName: data.customer,
          carModel: data.vehicle,
          time: data.date,
          distance: data.distance || '-',
          price: data.amount,
          date: data.createdAt
        });
      });
      this.jobs = list;
    });
  }

  openModal(job: any) {
    this.modalOpen = true;
    this.loadingDetails = true;
    this.selectedJob = null;

    // Simulate loading delay for 1 second
    setTimeout(() => {
      this.selectedJob = job;
      this.loadingDetails = false;
    }, 1000);
  }

  closeModal() {
    this.modalOpen = false;
    this.selectedJob = null;
    this.loadingDetails = false;
  }

 addSpecialty() {
  const trimmed = this.newSpecialty.trim();
  if (trimmed && !this.specialties.includes(trimmed)) {
    this.specialties.push(trimmed);
    Swal.fire({
      title: 'Added!',
      text: `${trimmed} has been added to your specialties.`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  }
  this.newSpecialty = '';
}


  removeSpecialty(specialty: string) {
    this.specialties = this.specialties.filter(s => s !== specialty);
  }

 callCustomer(job: any) {
  Swal.fire({
    title: `Call ${job.customerName}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, Call',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      window.open(`tel:+1234567890`, '_self');
    }
  });
}


  acceptJob(job: any) {
  Swal.fire({
    title: 'Accept this job?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, Accept',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      job.status = 'Accepted';
      Swal.fire({
        title: 'Accepted!',
        text: 'The job has been accepted.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    }
  });
}

 rejectJob(job: any) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to reject this job?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, reject it',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then((result) => {
    if (result.isConfirmed) {
      job.status = 'Rejected';
      Swal.fire(
        'Rejected!',
        'The job has been rejected.',
        'success'
      );
    }
  });
}

completeJob(job: any) {
  Swal.fire({
    title: 'Mark this job as completed?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, Complete',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      job.status = 'Completed';
      this.jobsCompleted++;

      Swal.fire({
        title: 'Completed!',
        text: 'The job has been marked as completed.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    }
  });
}

  selectedStatus = 'all-status';
  selectedService = 'all-services';

  get filteredJobs() {
    return this.jobs.filter(job => {
      const statusMatch =
        this.selectedStatus === 'all-status' ||
        job.status.toLowerCase() === this.selectedStatus.toLowerCase();
      const serviceMatch =
        this.selectedService === 'all-services' ||
        job.title.toLowerCase().includes(this.selectedService.toLowerCase());
      return statusMatch && serviceMatch;
    });
  }

  onStatusFilterChange(event: any) {
    this.selectedStatus = event.target.value;
  }

  onServiceFilterChange(event: any) {
    this.selectedService = event.target.value;
  }

  toggleAvailability() {
    this.isAvailable = !this.isAvailable;
  }

  openLocation(job: any) {
    if (job.customerLocation && job.customerLocation.lat && job.customerLocation.lng) {
      const { lat, lng } = job.customerLocation;
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    } else if (job.customerName) {
      const q = encodeURIComponent(job.customerName + ' location');
      window.open(`https://www.google.com/maps/search/?api=1&query=${q}`,'_blank');
    } else {
      alert('Location not available');
    }
  }
}
