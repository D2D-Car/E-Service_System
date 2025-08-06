import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
interface IStatistics {
  icon: string;
  title: string;
  total: number;
  color: string;
}

@Component({
  selector: 'app-driver-shared',
  standalone: true,
  templateUrl: './driver-shared.component.html',
  styleUrls: ['./driver-shared.component.css'],
  imports: [RouterModule, CommonModule,FormsModule]
})

export class DriverSharedComponent {
  availabilityStatus: string = 'Available';
  activeTab: string = 'dashboard';

  statistics: IStatistics[] = [
    {
      icon: "fa-solid fa-dollar-sign",
      title: "Today's Earnings",
      total: 245,
      color: "money-icon"
    },
    {
      icon: "fas fa-chart-line",
      title: "This Week",
      total: 1680,
      color: "services-icon"
    },
    {
      icon: "fas fa-chart-line",
      title: "This Month",
      total: 6420,
      color: "loyalty-icon"
    },
    {
      icon: "fa-solid fa-toolbox",
      title: "Total Jobs",
      total: 340,
      color: "member-icon"
    }
  ];
  constructor(private router: Router) { }

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
