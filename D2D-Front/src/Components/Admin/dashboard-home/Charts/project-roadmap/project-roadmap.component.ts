import { AfterViewInit, Component, ElementRef, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type Status = 'completed' | 'active' | 'upcoming';

interface RoadmapPhase {
  id: string;
  label: string; // step name shown on Y axis
  startWeek: number; // inclusive
  endWeek: number; // inclusive
  color: string;
  progress: number; // 0-100
  status: Status;
  assignedTo?: string; // technician name
}

interface Technician {
  name: string;
  specialization: string;
  experienceYears: number;
  availability: 'Available' | 'Busy' | 'On Leave';
  color: string;
  visible?: boolean; // toggle visibility on chart
}

@Component({
  selector: 'app-project-roadmap',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-roadmap.component.html',
  styleUrls: ['./project-roadmap.component.css'],
})
export class ProjectRoadmapComponent implements AfterViewInit {
  @Input() isDarkMode: boolean = false;
  // Accept currentPeriod from parent
  @Input() currentPeriod: '1M' | '6M' | '1Y' = '1M';
  // Dynamic theme color variable
  themeVars = {
    bgPrimary: getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim() || '#fff',
    bgSecondary: getComputedStyle(document.documentElement).getPropertyValue('--bg-secondary').trim() || '#f8fafc',
    textPrimary: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#111827',
    textSecondary: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#4b5563',
    primaryColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#ff3b3be8',
    successColor: getComputedStyle(document.documentElement).getPropertyValue('--success-color').trim() || '#10b981',
    successBg: getComputedStyle(document.documentElement).getPropertyValue('--success-bg').trim() || 'rgba(16,185,129,0.2)',
    borderColor: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim() || '#d1d5db',
  };

  // Listen for theme changes and update themeVars
  ngOnInit(): void {
    const updateThemeVars = () => {
      this.themeVars.bgPrimary = getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim() || '#fff';
      this.themeVars.bgSecondary = getComputedStyle(document.documentElement).getPropertyValue('--bg-secondary').trim() || '#f8fafc';
      this.themeVars.textPrimary = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#111827';
      this.themeVars.textSecondary = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#4b5563';
      this.themeVars.primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#ff3b3be8';
      this.themeVars.successColor = getComputedStyle(document.documentElement).getPropertyValue('--success-color').trim() || '#10b981';
      this.themeVars.successBg = getComputedStyle(document.documentElement).getPropertyValue('--success-bg').trim() || 'rgba(16,185,129,0.2)';
      this.themeVars.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim() || '#d1d5db';
    };
    window.addEventListener('themechange', updateThemeVars);
    updateThemeVars();
  }
  @ViewChild('roadmapCanvas', { static: true })
  roadmapCanvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

  // UI state
  showAll = true;
  periods: ('1M' | '6M' | '1Y')[] = ['1M', '6M', '1Y'];

  // Technicians
  technicians: Technician[] = [
    {
      name: 'Ahmed Hassan',
      specialization: 'Engine',
      experienceYears: 8,
      availability: 'Available',
      color: '#10b981',
      visible: true,
    },
    {
      name: 'Omar Khaled',
      specialization: 'Electrical',
      experienceYears: 5,
      availability: 'Busy',
      color: '#3b82f6',
      visible: true,
    },
    {
      name: 'Mahmoud Ali',
      specialization: 'Body & Paint',
      experienceYears: 7,
      availability: 'Available',
      color: '#f59e0b',
      visible: true,
    },
    {
      name: 'Youssef Samir',
      specialization: 'Diagnostics',
      experienceYears: 4,
      availability: 'On Leave',
      color: '#8b5cf6',
      visible: true,
    },
  ];

  // Roadmap steps (these are y-axis labels). Each element is a task/phase.
  roadmap: RoadmapPhase[] = [
    {
      id: 'checkin',
      label: 'Vehicle Check-In',
      startWeek: 1,
      endWeek: 2,
      color: '#94f2c7',
      progress: 99,
      status: 'completed',
      assignedTo: 'Ahmed Hassan',
    },
    {
      id: 'inspection',
      label: 'Initial Inspection',
      startWeek: 1,
      endWeek: 2,
      color: '#60a5fa',
      progress: 85,
      status: 'active',
      assignedTo: 'Youssef Samir',
    },
    {
      id: 'assignment',
      label: 'Service Assignment',
      startWeek: 2,
      endWeek: 2,
      color: '#f59e0b',
      progress: 90,
      status: 'active',
      assignedTo: 'Omar Khaled',
    },
    {
      id: 'parts',
      label: 'Parts Ordering',
      startWeek: 2,
      endWeek: 4,
      color: '#fb923c',
      progress: 60,
      status: 'active',
      assignedTo: 'Mahmoud Ali',
    },
    {
      id: 'repair',
      label: 'Repair & Assembly',
      startWeek: 3,
      endWeek: 7,
      color: '#ef4444',
      progress: 35,
      status: 'active',
      assignedTo: 'Ahmed Hassan',
    },
    {
      id: 'paint',
      label: 'Paint & Finish',
      startWeek: 6,
      endWeek: 8,
      color: '#a78bfa',
      progress: 0,
      status: 'upcoming',
      assignedTo: 'Mahmoud Ali',
    },
    {
      id: 'qc',
      label: ' Final Testing',
      startWeek: 8,
      endWeek: 8,
      color: '#64748b',
      progress: 0,
      status: 'upcoming',
      assignedTo: 'Youssef Samir',
    },
    {
      id: 'handover',
      label: 'Customer Handover',
      startWeek: 9,
      endWeek: 9,
      color: '#16a34a',
      progress: 0,
      status: 'upcoming',
    },
  ];

  constructor() {}

  ngAfterViewInit(): void {
    this.createChart();
  }

  // UI actions
  toggleView(showAll: boolean) {
    this.showAll = showAll;
    this.updateChartData();
  }


  ngOnChanges() {
    this.updateChartOptions();
    this.updateChartData();
  }

  // Toggle technician markers (shows technician midpoints on chart)
  toggleTechnicianVisibility(tech: Technician) {
    tech.visible = !tech.visible;
    this.updateChartData();
  }

  // Refresh (demo): randomize small progress values and re-render
  refreshRoadmap() {
    this.roadmap = this.roadmap.map((r) => ({
      ...r,
      progress:
        r.status === 'completed'
          ? 100
          : Math.max(0, Math.min(100, r.progress + (Math.random() * 20 - 10))),
    }));
    this.updateChartData();
  }

  // Build Chart.js and initial configs
  private createChart() {
    const ctx = this.roadmapCanvas.nativeElement.getContext('2d')!;
    const gridColor = this.isDarkMode ? '#fff' : '#888';
    const config = {
      type: 'bar' as const,
      data: {
        // single dataset used for floating bars; data objects will include y, x, x2
        datasets: [
          {
            label: 'Tasks',
            data: this.buildChartDataPoints(),
            backgroundColor: this.roadmap.map((r) => r.color),
            borderColor: '#222',
            borderWidth: 0,
          },
          // technicians markers dataset
          {
            label: 'Technicians',
            type: 'bar' as const,
            data: this.buildTechnicianPoints(),
            backgroundColor: this.buildTechnicianColors(),
            barThickness: 6,
          },
        ],
      },
      options: {
        indexAxis: 'y' as const, // horizontal bars
        responsive: true,
        maintainAspectRatio: false,
        parsing: {
          // tell chart.js to use x and x2 keys for the horizontal data range
          xAxisKey: 'x',
          x2AxisKey: 'x2',
          yAxisKey: 'y',
        },
        scales: {
          x: {
            min: 0,
            max: 10, // will be updated by updateChartOptions
            grid: { color: gridColor },
            ticks: {
              stepSize: 1,
              color: gridColor,
              callback: (v: any) => `W${v}`,
            },
            title: { display: true, text: 'Week number', color: gridColor },
          },
          y: {
            type: 'category' as const,
            labels: this.getVisibleLabels(),
            grid: { color: gridColor },
            ticks: { font: { size: 13 }, color: gridColor },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx: any) => {
                const d = ctx.raw;
                if (d && d.x !== undefined && d.x2 !== undefined) {
                  const label = d.y;
                  const start = d.x;
                  const end = d.x2;
                  const task = this.roadmap.find((t) => t.label === label);
                  const progress = task ? `${task.progress}%` : '';
                  return `${label} — W${start} → W${end} • ${progress}`;
                }
                return ctx.dataset.label;
              },
            },
          },
          legend: { display: false },
        },
        animation: { duration: 350 },
      },
    };

    this.chart = new Chart(ctx, config as any);
    this.updateChartOptions();
    this.updateChartData();
  }

  // Build the main dataset data points for Chart.js: objects with x, x2, y
  private buildChartDataPoints() {
    const visible = this.roadmap.filter(
      (r) => this.showAll || r.status === 'active'
    );
    // Chart expects order matching y labels: we'll return in that order
    const labels = this.getVisibleLabels();
    return visible.map((r) => ({
      x: r.startWeek,
      x2: r.endWeek,
      y: r.label,
      backgroundColor: r.color,
      progress: r.progress,
    }));
  }

  // Technician markers positioned at midpoints of assigned tasks (if any)
  private buildTechnicianPoints() {
    // For each visible tech, add a bar-like point at the y-position of their assigned task(s)
    const techPoints: any[] = [];
    const visibleTechs = this.technicians.filter((t) => t.visible);
    visibleTechs.forEach((tech, idx) => {
      // find first assigned task or skip
      const assignedTask = this.roadmap.find(
        (r) =>
          r.assignedTo === tech.name && (this.showAll || r.status === 'active')
      );
      if (!assignedTask) return;
      const midpoint = Math.round(
        (assignedTask.startWeek + assignedTask.endWeek) / 2
      );
      techPoints.push({
        x: midpoint,
        x2: midpoint + 0.1, // small width to render as thin marker
        y: assignedTask.label,
        techName: tech.name,
      });
    });
    return techPoints;
  }

  private buildTechnicianColors() {
    return this.technicians.filter((t) => t.visible).map((t) => t.color);
  }

  // Visible Y labels depend on showAll filter
  private getVisibleLabels() {
    return this.roadmap
      .filter((r) => this.showAll || r.status === 'active')
      .map((r) => r.label);
  }

  // Update chart data and y-axis labels
  private updateChartData() {
    if (!this.chart) return;

    // Update primary dataset (tasks)
    const tasks = this.buildChartDataPoints();
    (this.chart.data.datasets![0].data as any[]) = tasks;
    // Update colors per task
    this.chart.data.datasets![0].backgroundColor = tasks.map(
      (t: any) => t.backgroundColor
    );

    // Update technician dataset
    const techPoints = this.buildTechnicianPoints();
    (this.chart.data.datasets![1].data as any[]) = techPoints;
    this.chart.data.datasets![1].backgroundColor = this.buildTechnicianColors();

    // Update Y labels
    (this.chart.options!.scales! as any).y.labels = this.getVisibleLabels();
    (this.chart.options!.scales! as any).y.ticks = {
      callback: (v: any, i: number) => this.getVisibleLabels()[i],
    };

    this.chart.update();
  }

  // Update x-axis range according to selected period
  private updateChartOptions() {
    if (!this.chart) return;

    const x = (this.chart.options!.scales! as any).x;
    if (this.currentPeriod === '1M') {
      x.min = 1;
      x.max = 6; // show 6 weeks as 1 month sample
    } else if (this.currentPeriod === '6M') {
      x.min = 1;
      x.max = 24; // 6 months ~ 24 weeks
    } else {
      // 1Y
      x.min = 1;
      x.max = 52; // 52 weeks
    }
    this.chart.update();
  }
}
