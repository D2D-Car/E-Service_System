import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PaymentData {
  label: string;
  percentage: number;
  color: string;
}

@Component({
  selector: 'app-paying-vs-non-paying-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paying-vs-non-paying-chart.component.html',
  styleUrls: ['./paying-vs-non-paying-chart.component.css'],
})
export class PayingVsNonPayingChartComponent {
  paymentData: PaymentData[] = [
    { label: 'Paying customer', percentage: 30, color: '#6366f1' },
    { label: 'Non-paying customer', percentage: 70, color: '#94a3b8' },
  ];

  // Calculate the rotation for the progress arc
  get progressRotation(): string {
    const percentage = this.paymentData[0].percentage;
    const degrees = (percentage / 100) * 180; // Half circle = 180 degrees
    return `rotate(${degrees}deg)`;
  }

  get progressPercentage(): number {
    return this.paymentData[0].percentage;
  }
}
