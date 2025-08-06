import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CouponData {
  label: string;
  percentage: number;
  color: string;
}

@Component({
  selector: 'app-top-coupons-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-coupons-chart.component.html',
  styleUrls: ['./top-coupons-chart.component.css'],
})
export class TopCouponsChartComponent {
  mainPercentage = 72;

  couponData: CouponData[] = [
    { label: 'Percentage discount', percentage: 72, color: '#6366f1' },
    { label: 'Fixed card discount', percentage: 18, color: '#10b981' },
    { label: 'Fixed product discount', percentage: 10, color: '#f59e0b' },
  ];
}
