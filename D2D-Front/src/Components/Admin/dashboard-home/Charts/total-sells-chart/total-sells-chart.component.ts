import {
  Component,
  OnInit,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-total-sells-chart',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './total-sells-chart.component.html',
  styleUrls: ['./total-sells-chart.component.css'],
})
export class TotalSellsChartComponent implements OnInit, OnChanges {
  @Input() isDarkMode: boolean = false;
  @Input() selectedFilter: 'ALL' | '1M' | '6M' | '1Y' = '1M';
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedFilter']) {
      this.applyFilter();
    }
  }

  applyFilter() {
    let filter = this.selectedFilter;
    if (filter === 'ALL') filter = '1M'; // Default to 1M for ALL
    const chartData = this.chartDataSets[filter];
    this.lineChartData.labels = chartData.labels;
    this.lineChartData.datasets.forEach((ds, i) => {
      Object.assign(ds, chartData.datasets[i]);
    });
    if (this.lineChartData.datasets.length < chartData.datasets.length) {
      for (
        let i = this.lineChartData.datasets.length;
        i < chartData.datasets.length;
        i++
      ) {
        this.lineChartData.datasets.push(chartData.datasets[i]);
      }
    }
    if (this.lineChartData.datasets.length > chartData.datasets.length) {
      this.lineChartData.datasets.splice(chartData.datasets.length);
    }
    this.chart?.update();
  }

  private chartDataSets: Record<
    '1M' | '6M' | '1Y',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    {
      labels: string[];
      datasets: any[];
    }
  > = {
    '1M': {
      labels: [
        '01 May',
        '05 May',
        '10 May',
        '15 May',
        '20 May',
        '25 May',
        '30 May',
      ],
      datasets: [
        {
          data: [100, 120, 110, 200, 250, 180, 150],
          label: 'Current Period',
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          borderWidth: 3,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: '#6366f1',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 8,
        },
        {
          data: [80, 70, 90, 150, 190, 220, 180],
          label: 'Previous Period',
          borderColor: '#10b981',
          color: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 3,
          borderDash: [8, 4],
          fill: false,
          tension: 0.4,
          pointBackgroundColor: '#10b981',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 8,
        },
        {
          data: [90, 110, 130, 170, 210, 230, 200],
          label: 'Forecast',
          borderColor: '#f59e42',
          backgroundColor: 'rgba(245, 158, 66, 0.1)',
          borderWidth: 3,
          borderDash: [4, 4],
          fill: false,
          tension: 0.4,
          pointBackgroundColor: '#f59e42',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 8,
        },
        {
          data: [110, 130, 120, 210, 260, 200, 170],
          label: 'Actual',
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          borderDash: [2, 6],
          fill: false,
          tension: 0.4,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 8,
        },
        {
          data: [130, 140, 150, 190, 230, 210, 180],
          label: 'Target',
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 3,
          borderDash: [6, 2],
          fill: false,
          tension: 0.4,
          pointBackgroundColor: '#ef4444',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 8,
        },
      ],
    },
    '6M': {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          data: [120, 140, 135, 180, 200, 190], // small dip in March, slight fall in June
          label: 'Current Period',
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          borderWidth: 3,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: '#6366f1',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 8,
        },
        {
          data: [100, 95, 110, 130, 170, 160], // drop in Feb, rebound then slight dip
          label: 'Previous Period',
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 3,
          borderDash: [8, 4],
          fill: false,
          tension: 0.4,
          pointBackgroundColor: '#10b981',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 8,
        },
        {
          data: [110, 115, 125, 160, 190, 185], // slow rise but not perfect
          label: 'Forecast',
          borderColor: '#f59e42',
          backgroundColor: 'rgba(245, 158, 66, 0.1)',
          borderWidth: 3,
          borderDash: [4, 4],
          fill: false,
          tension: 0.4,
          pointBackgroundColor: '#f59e42',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 8,
        },
        {
          data: [130, 145, 140, 200, 220, 210], // drop in Mar, big jump Apr, slight drop June
          label: 'Actual',
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          borderDash: [2, 6],
          fill: false,
          tension: 0.4,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 8,
        },
        {
          data: [140, 150, 155, 180, 210, 205], // steady but slight dip last month
          label: 'Target',
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 3,
          borderDash: [6, 2],
          fill: false,
          tension: 0.4,
          pointBackgroundColor: '#ef4444',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 8,
        },
      ],
    },
    '1Y': {
      labels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      datasets: [
        {
          data: [120, 135, 130, 150, 170, 210, 200, 190, 210, 220, 210, 200], // multiple dips/rebounds
          label: 'Current Period',
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          borderWidth: 3,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: '#6366f1',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 8,
        },
        {
          data: [100, 110, 105, 120, 160, 180, 170, 160, 180, 175, 165, 155], // more wavy
          label: 'Previous Period',
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 3,
          borderDash: [8, 4],
          fill: false,
          tension: 0.4,
          pointBackgroundColor: '#10b981',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 8,
        },
        {
          data: [110, 115, 120, 140, 180, 200, 190, 185, 195, 205, 200, 195],
          label: 'Forecast',
          borderColor: '#f59e42',
          backgroundColor: 'rgba(245, 158, 66, 0.1)',
          borderWidth: 3,
          borderDash: [4, 4],
          fill: false,
          tension: 0.4,
          pointBackgroundColor: '#f59e42',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 8,
        },
        {
          data: [130, 140, 135, 160, 200, 230, 220, 215, 225, 240, 235, 225],
          label: 'Actual',
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          borderDash: [2, 6],
          fill: false,
          tension: 0.4,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 8,
        },
        {
          data: [140, 145, 150, 170, 210, 240, 230, 225, 235, 250, 245, 235],
          label: 'Target',
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 3,
          borderDash: [6, 2],
          fill: false,
          tension: 0.4,
          pointBackgroundColor: '#ef4444',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 8,
        },
      ],
    },
  };

  onFilterChange(filter: '1M' | '6M' | '1Y') {
    this.selectedFilter = filter;
    const chartData = this.chartDataSets[filter];
    this.lineChartData.labels = chartData.labels;
    this.lineChartData.datasets.forEach((ds, i) => {
      Object.assign(ds, chartData.datasets[i]);
    });
    // If more datasets, add them
    if (this.lineChartData.datasets.length < chartData.datasets.length) {
      for (
        let i = this.lineChartData.datasets.length;
        i < chartData.datasets.length;
        i++
      ) {
        this.lineChartData.datasets.push(chartData.datasets[i]);
      }
    }
    // If fewer datasets, remove extra
    if (this.lineChartData.datasets.length > chartData.datasets.length) {
      this.lineChartData.datasets.splice(chartData.datasets.length);
    }
    this.chart?.update();
  }
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public loading = true;
  public lineChartType: ChartType = 'line';

  public lineChartData: ChartConfiguration['data'] = {
    labels: [
      '01 May',
      '05 May',
      '10 May',
      '15 May',
      '20 May',
      '25 May',
      '30 May',
    ],
    datasets: [
      {
        data: [100, 120, 110, 200, 250, 180, 150],
        label: 'Current Period',
        fill: false,
        tension: 0.4,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
      {
        data: [80, 70, 90, 150, 190, 220, 180],
        label: 'Previous Period',
        fill: false,
        tension: 0.4,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        borderDash: [8, 4],
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
      {
        data: [90, 110, 130, 170, 210, 230, 200],
        label: '2025 Forecast',
        fill: false,
        tension: 0.4,
        borderColor: '#f59e42',
        backgroundColor: 'rgba(245, 158, 66, 0.1)',
        borderWidth: 3,
        borderDash: [4, 4],
        pointBackgroundColor: '#f59e42',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
      {
        data: [110, 130, 120, 210, 260, 200, 170],
        label: '2025 Actual',
        fill: false,
        tension: 0.4,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        borderDash: [2, 6],
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
      {
        data: [130, 140, 150, 190, 230, 210, 180],
        label: '2025 Target',
        fill: false,
        tension: 0.4,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        borderDash: [6, 2],
        pointBackgroundColor: '#ef4444',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  public get lineChartOptions(): ChartConfiguration['options'] {
    return {
      responsive: true,
      animation: {
        duration: 1200,
        easing: 'easeInOutQuart',
      },
      plugins: {
        legend: {
          display: true,
          labels: {
            color: '#1976d2',
            font: { size: 14, weight: 'bold' },
          },
        },
        tooltip: {
          enabled: true,
          backgroundColor: '#fff',
          titleColor: '#1976d2',
          bodyColor: '#333',
          borderColor: '#1976d2',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          titleFont: { size: 16, weight: 'bold' },
          bodyFont: { size: 14 },
          callbacks: {
            label: (context) => {
              // Show dataset label and value in tooltip
              const label = context.dataset?.label || '';
              return `${label}: ${context.parsed.y}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { color: this.isDarkMode ? '#fff' : '#888' },
          ticks: {
            color: this.isDarkMode ? '#fff' : '#888',
            font: { size: 12 },
          },
        },
        y: {
          grid: { color: this.isDarkMode ? '#fff' : '#888' },
          ticks: {
            color: this.isDarkMode ? '#fff' : '#888',
            font: { size: 12 },
          },
        },
      },
    };
  }

  selectedDateRange = 'Mar 1 - 31, 2022';
  dateRanges = ['Mar 1 - 31, 2022', 'Apr 1 - 30, 2022', 'May 1 - 31, 2022'];

  ngOnInit(): void {
    // Show loading animation for 1.5s, then show chart
    setTimeout(() => {
      this.loading = false;
    }, 1500);
  }

  onDateRangeChange(range: string): void {
    this.selectedDateRange = range;
    // Example: update chart data based on selected range
    if (range === 'Apr 1 - 30, 2022') {
      this.lineChartData.datasets[0].data = [90, 100, 95, 180, 210, 160, 140];
      this.lineChartData.datasets[1].data = [70, 60, 80, 130, 170, 200, 160];
    } else if (range === 'May 1 - 31, 2022') {
      this.lineChartData.datasets[0].data = [130, 150, 140, 240, 290, 220, 200];
      this.lineChartData.datasets[1].data = [100, 90, 110, 170, 210, 250, 210];
    } else {
      this.lineChartData.datasets[0].data = [100, 120, 110, 200, 250, 180, 150];
      this.lineChartData.datasets[1].data = [80, 70, 90, 150, 190, 220, 180];
    }
    // Refresh chart
    this.chart?.update();
  }

  onPeriodChange(period: 'current' | 'previous') {
    if (period === 'current') {
      this.lineChartData.datasets[0].data = [180, 220, 210, 300, 350, 320, 280];
      this.lineChartData.datasets[1].data = [120, 110, 130, 200, 250, 180, 150];
    } else {
      this.lineChartData.datasets[0].data = [120, 110, 130, 200, 250, 180, 150];
      this.lineChartData.datasets[1].data = [180, 220, 210, 300, 350, 320, 280];
    }
    this.chart?.update();
  }
}
