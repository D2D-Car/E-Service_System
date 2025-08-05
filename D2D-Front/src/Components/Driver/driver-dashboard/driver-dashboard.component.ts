import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DriverSharedComponent } from '../driver-shared/driver-shared.component';

interface IStatistics {
  icon: string;
  title: string;
  total: number;
  color: string;
}

@Component({
  standalone: true,
  selector: 'app-driver-dashboard',
  imports: [CommonModule,DriverSharedComponent],
  templateUrl: './driver-dashboard.component.html',
  styleUrls: ['./driver-dashboard.component.css']
})
export class DriverDashboardComponent {
}
