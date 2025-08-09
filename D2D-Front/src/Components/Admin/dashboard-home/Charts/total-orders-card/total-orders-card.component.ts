import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

interface OrderStats {
  total: string;
  change: string;
  changeType: 'positive' | 'negative';
  completedPercentage: number;
  pendingPercentage: number;
}

@Component({
  selector: 'app-total-orders-card',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './total-orders-card.component.html',
  styleUrls: ['./total-orders-card.component.css'],
})
export class TotalOrdersCardComponent {
  orderStats: OrderStats = {
    total: '16,247',
    change: '-6.8%',
    changeType: 'negative',
    completedPercentage: 52,
    pendingPercentage: 48,
  };

  public barChartType: ChartType = 'bar';

  public barChartData: ChartConfiguration['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        data: [12, 19, 15, 25, 22, 18, 20],
        backgroundColor: '#6366f1',
        borderColor: '#6366f1',
        borderWidth: 2,
        borderRadius: 4,
        barThickness: 12,
      },
    ],
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#fff',
        titleColor: '#1976d2',
        bodyColor: '#333',
        borderColor: '#1976d2',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        titleFont: { size: 16, weight: 'bold' },
        bodyFont: { size: 14 },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(25, 118, 210, 0.1)' },
        ticks: { color: '#1976d2', font: { size: 12 } },
      },
      y: {
        grid: { color: 'rgba(25, 118, 210, 0.1)' },
        ticks: { color: '#1976d2', font: { size: 12 } },
      },
    },
  };
}
