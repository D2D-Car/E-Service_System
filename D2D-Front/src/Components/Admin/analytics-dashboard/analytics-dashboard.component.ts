import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalOrdersCardComponent } from '../total-orders-card/total-orders-card.component';
import { NewCustomersChartComponent } from '../new-customers-chart/new-customers-chart.component';
import { TopCouponsChartComponent } from '../top-coupons-chart/top-coupons-chart.component';
import { PayingVsNonPayingChartComponent } from '../paying-vs-non-paying-chart/paying-vs-non-paying-chart.component';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TotalOrdersCardComponent,
    NewCustomersChartComponent,
    TopCouponsChartComponent,
    PayingVsNonPayingChartComponent,
  ],
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.css'],
})
export class AnalyticsDashboardComponent {}
