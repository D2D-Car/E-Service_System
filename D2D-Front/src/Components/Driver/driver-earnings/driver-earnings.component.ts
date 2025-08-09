import { Component } from '@angular/core';
import { DriverSharedComponent } from "../driver-shared/driver-shared.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-driver-earnings',
  imports: [CommonModule],
  templateUrl: './driver-earnings.component.html',
  styleUrl: './driver-earnings.component.css'
})
export class DriverEarningsComponent {
  selectedPeriod: string = 'Today';

  stats: { [key: string]: any } = {
    'Today': {
      earnings: 247.5,
      trendEarnings: '+12%',
      trips: 18,
      trendTrips: '+8%',
      hours: '8.5h',
      trendHours: '+2h'
    },
    'This Week': {
      earnings: 1125,
      trendEarnings: '+5%',
      trips: 78,
      trendTrips: '+10%',
      hours: '42h',
      trendHours: '+4h'
    },
    'This Month': {
      earnings: 4500,
      trendEarnings: '+15%',
      trips: 310,
      trendTrips: '+20%',
      hours: '168h',
      trendHours: '+10h'
    },
    'This Year': {
      earnings: 55000,
      trendEarnings: '+25%',
      trips: 3200,
      trendTrips: '+18%',
      hours: '1850h',
      trendHours: '+120h'
    }
  };

  // Fixed earnings breakdown data
  earningsBreakdown = {
    tripFares: 1156.30,
    tips: 91.50,
    bonuses: 125.00,
    serviceFees: -125.00,
    netEarnings: 1247.80
  };

  // Recent payouts data
  recentPayouts = [
    { amount: 1247.80, date: '2024-01-15', account: 'Bank Account', status: 'completed' },
    { amount: 1156.30, date: '2024-01-08', account: 'Bank Account', status: 'completed' },
    { amount: 1398.75, date: '2024-01-01', account: 'Bank Account', status: 'completed' }
  ];

  currentStats = this.stats[this.selectedPeriod];

  ngOnInit(): void {
    this.filterStats(this.selectedPeriod);
  }

  filterStats(period: string): void {
    this.selectedPeriod = period;
    this.currentStats = this.stats[period];
  }
}