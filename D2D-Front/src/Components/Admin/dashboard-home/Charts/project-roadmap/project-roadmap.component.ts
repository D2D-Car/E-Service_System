import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface RoadmapPhase {
  name: string;
  startWeek: number;
  endWeek: number;
  duration: number;
  color: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'completed' | 'active' | 'upcoming';
}

interface Technician {
  name: string;
  specialization: string;
  experienceYears: number;
  availability: 'Available' | 'Busy' | 'On Leave';
}

@Component({
  selector: 'app-project-roadmap',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-roadmap.component.html',
  styleUrls: ['./project-roadmap.component.css'],
})
export class ProjectRoadmapComponent {
  // Toggle between showAll and active only
  toggleView(showAll: boolean): void {
    this.showAll = showAll;
  }

  // Provide months for grid lines per quarter
  getMonthsInPeriod(): string[] {
    const quarters: Record<string, string[]> = {
      Q1: ['Jan', 'Feb', 'Mar'],
      Q2: ['Apr', 'May', 'Jun'],
      Q3: ['Jul', 'Aug', 'Sep'],
      Q4: ['Oct', 'Nov', 'Dec'],
    };
    return quarters[this.currentPeriod] || quarters['Q1'];
  }
  showLinks = false;
  selectedPeriod = 'Week';
  showAll = true;
  currentPeriod = 'Q1';
  periods = ['Q1', 'Q2', 'Q3', 'Q4'];

  /** -------------------------
   * TECHNICIANS DATA
   * ------------------------- */
  techniciansData: Technician[] = [
    {
      name: 'Ahmed Hassan',
      specialization: 'Engine Specialist',
      experienceYears: 8,
      availability: 'Available',
    },
    {
      name: 'Omar Khaled',
      specialization: 'Electrical Systems',
      experienceYears: 5,
      availability: 'Busy',
    },
    {
      name: 'Mahmoud Ali',
      specialization: 'Body & Paint',
      experienceYears: 7,
      availability: 'Available',
    },
    {
      name: 'Youssef Samir',
      specialization: 'Diagnostics',
      experienceYears: 4,
      availability: 'On Leave',
    },
    {
      name: 'Hassan Mohamed',
      specialization: 'Transmission',
      experienceYears: 6,
      availability: 'Available',
    },
  ];

  /** -------------------------
   * CAR REPAIR ROADMAP
   * ------------------------- */
  carRepairRoadmap: RoadmapPhase[] = [
    {
      name: 'Initial Inspection',
      startWeek: 1,
      endWeek: 1,
      duration: 1,
      color: '#10b981',
      startDate: '2024-01-02',
      endDate: '2024-01-08',
      progress: 100,
      status: 'completed',
    },
    {
      name: 'Parts Ordering',
      startWeek: 2,
      endWeek: 3,
      duration: 2,
      color: '#f59e0b',
      startDate: '2024-01-09',
      endDate: '2024-01-22',
      progress: 90,
      status: 'active',
    },
    {
      name: 'Engine & Transmission Repair',
      startWeek: 4,
      endWeek: 6,
      duration: 3,
      color: '#ef4444',
      startDate: '2024-01-23',
      endDate: '2024-02-12',
      progress: 60,
      status: 'active',
    },
    {
      name: 'Body & Paint Work',
      startWeek: 7,
      endWeek: 8,
      duration: 2,
      color: '#8b5cf6',
      startDate: '2024-02-13',
      endDate: '2024-02-26',
      progress: 30,
      status: 'upcoming',
    },
    {
      name: 'Final Testing & Delivery',
      startWeek: 9,
      endWeek: 9,
      duration: 1,
      color: '#64748b',
      startDate: '2024-02-27',
      endDate: '2024-03-04',
      progress: 0,
      status: 'upcoming',
    },
  ];

  /** -------------------------
   * EXISTING ANALYTICS
   * ------------------------- */
  analyticsChartData: Record<
    string,
    { label: string; value: number; color: string; start: number }[]
  > = {
    Q1: [
      { label: 'Total Cars', value: 120, color: '#6366f1', start: 0 },
      { label: 'Technicians', value: 28, color: '#10b981', start: 20 },
      { label: 'Branches', value: 15, color: '#f59e0b', start: 45 },
      { label: 'Rev', value: 32, color: '#ef4444', start: 55 },
      { label: 'Growth', value: 12, color: '#8b5cf6', start: 65 },
    ],
    Q2: [
      { label: 'Diagnosis', value: 28, color: '#6366f1', start: 0 },
      { label: 'Spare Parts Ordering', value: 20, color: '#10b981', start: 18 },
      { label: 'Repair Work', value: 22, color: '#f59e0b', start: 30 },
      { label: 'Quality Check', value: 10, color: '#ef4444', start: 48 },
      { label: 'Delivery', value: 10, color: '#8b5cf6', start: 58 },
    ],
    Q3: [
      { label: 'Diagnosis', value: 30, color: '#6366f1', start: 0 },
      { label: 'Spare Parts Ordering', value: 32, color: '#10b981', start: 12 },
      { label: 'Repair Work', value: 45, color: '#f59e0b', start: 22 },
      { label: 'Quality Check', value: 28, color: '#ef4444', start: 52 },
      { label: 'Delivery', value: 20, color: '#8b5cf6', start: 62 },
    ],
    Q4: [
      { label: 'Diagnosis', value: 32, color: '#6366f1', start: 0 },
      { label: 'Spare Parts Ordering', value: 34, color: '#10b981', start: 14 },
      { label: 'Repair Work', value: 48, color: '#f59e0b', start: 24 },
      { label: 'Quality Check', value: 30, color: '#ef4444', start: 54 },
      { label: 'Delivery', value: 22, color: '#8b5cf6', start: 64 },
    ],
  };

  analyticsByQuarter: Record<string, string[]> = {
    Q1: [
      'Total Cars: 120',
      'Technicians: 18',
      'Branches: 5',
      'Rev: $32,000',
      'Growth: +12%',
    ],
    Q2: [
      'Total Cars: 135',
      'Technicians: 20',
      'Branches: 6',
      'Rev: $41,000',
      'Growth: +15%',
    ],
    Q3: [
      'Total Cars: 150',
      'Technicians: 22',
      'Branches: 7',
      'Rev: $48,000',
      'Growth: +18%',
    ],
    Q4: [
      'Total Cars: 160',
      'Technicians: 24',
      'Branches: 8',
      'Rev: $53,000',
      'Growth: +20%',
    ],
  };

  /** -------------------------
   * METHODS
   * ------------------------- */
  setPeriod(period: string) {
    this.currentPeriod = period;
  }

  getAnalyticsChartData() {
    return this.analyticsChartData[this.currentPeriod] || [];
  }

  getMaxAnalyticsValue(): number {
    const data = this.getAnalyticsChartData();
    return Math.max(...data.map((d) => d.value));
  }

  getAnalyticsLabels(): string[] {
    return this.analyticsByQuarter[this.currentPeriod] || [];
  }
}
