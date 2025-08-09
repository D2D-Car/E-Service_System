import { Component } from '@angular/core';
import { Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

interface CustomerStats {
  total: string;
  change: string;
  changeType: 'positive' | 'negative';
}

@Component({
  selector: 'app-new-customers-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './new-customers-chart.component.html',
  styleUrls: ['./new-customers-chart.component.css'],
})
export class NewCustomersChartComponent implements OnChanges {
  customerStats: CustomerStats = {
    total: '564',
    change: '+26.5%',
    changeType: 'positive',
  };

  @Input() isDarkMode = false;

  public lineChartType: ChartType = 'bar';
  public lineChartData: ChartConfiguration['data'] = {
    labels: ['New Customers', 'Returning Customers', 'Referrals'],
    datasets: [
      {
        data: [564, 274, 409],
        label: 'Customer Acquisition',
        backgroundColor: [
          '#0072B2', // New Customers (blue)
          '#D55E00', // Returning Customers (orange)
          '#009E73', // Referrals (green)
        ],
        borderColor: ['#0072B2', '#D55E00', '#009E73'],
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: [
          '#005FA3', // blue dark
          '#B34700', // orange dark
          '#007A5E', // green dark
        ],
      },
    ],
  };

  public lineChartOptions: ChartConfiguration['options'] = {};

  constructor() {
    this.updateChartOptions();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isDarkMode']) {
      this.updateChartOptions();
    }
  }

  updateChartOptions() {
    this.lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: this.isDarkMode ? '#222831' : '#f9fafb',
          titleColor: this.isDarkMode ? '#fff' : '#888',
          bodyColor: this.isDarkMode ? '#fff' : '#888',
          borderColor: this.isDarkMode ? '#374151' : '#e5e7eb',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            title: function (context) {
              return context[0].label;
            },
            label: function (context) {
              return `${context.label}: ${context.parsed.y}`;
            },
          },
        },
      },
      scales: {
        x: {
          display: true,
          grid: { color: this.isDarkMode ? '#fff' : '#888' },
          ticks: {
            color: this.isDarkMode ? '#fff' : '#888',
            font: { size: 14 },
          },
        },
        y: {
          display: true,
          grid: { color: this.isDarkMode ? '#fff' : '#888' },
          ticks: {
            color: this.isDarkMode ? '#fff' : '#888',
            font: { size: 14 },
          },
        },
      },
    };
  }

  // Tooltip data points for all three lines
  tooltipData = [
    { date: 'May 04', value: '564', line: 'New Customers' },
    { date: 'May 04', value: '274', line: 'Returning Customers' },
    { date: 'May 04', value: '409', line: 'Referrals' },
  ];
}
