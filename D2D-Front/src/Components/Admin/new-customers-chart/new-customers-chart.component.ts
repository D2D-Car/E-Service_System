import { Component } from '@angular/core';
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
export class NewCustomersChartComponent {
  customerStats: CustomerStats = {
    total: '356',
    change: '+26.5%',
    changeType: 'positive',
  };

  public lineChartType: ChartType = 'line';

  public lineChartData: ChartConfiguration['data'] = {
    labels: [
      '01 May',
      '02 May',
      '03 May',
      '04 May',
      '05 May',
      '06 May',
      '07 May',
    ],
    datasets: [
      {
        data: [150, 180, 160, 200, 170, 190, 220],
        label: 'New Customers',
        fill: false,
        tension: 0.4,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function (context) {
            return context[0].label;
          },
          label: function (context) {
            return context.parsed.y.toString();
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    elements: {
      point: {
        hoverBackgroundColor: '#10b981',
      },
    },
  };

  // Tooltip data points visible in screenshot
  tooltipData = [
    { date: 'May 04', value: '200' },
    { date: 'Apr 04', value: '100' },
  ];
}
