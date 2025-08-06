import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AvailabilityStatusService } from '../../../Services/Driver/availability-status.service';


@Component({
  selector: 'app-driver-shared',
  standalone: true,
  templateUrl: './driver-shared.component.html',
  styleUrls: ['./driver-shared.component.css'],
  imports: [RouterModule, CommonModule]
})

export class DriverSharedComponent implements OnInit{
  activeTab: string = 'dashboard';
  availabilityStatus: string = 'Available';

  constructor(private router: Router, private availabilityService: AvailabilityStatusService) { }

  ngOnInit() {
    this.availabilityService.availabilityStatus$.subscribe(status => {
      this.availabilityStatus = status;
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    switch (tab) {
      case 'dashboard':
        this.router.navigate(['/driver/dashboard']);
        break;
      case 'jobs':
        this.router.navigate(['/driver/job']);
        break;
      case 'earnings':
        this.router.navigate(['/driver/earnings']);
        break;
      case 'profile':
        this.router.navigate(['/driver/profile']);
        break;
    }
  }
}
