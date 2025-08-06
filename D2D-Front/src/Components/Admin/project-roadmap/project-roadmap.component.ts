import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface RoadmapPhase {
  name: string;
  startWeek: number;
  duration: number;
  color: string;
  startDate: string;
  endDate: string;
  progress: number;
}

@Component({
  selector: 'app-project-roadmap',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-roadmap.component.html',
  styleUrls: ['./project-roadmap.component.css']
})
export class ProjectRoadmapComponent {
  projectTitle = 'Project: zero Roadmap';
  phaseDescription = 'Phase 2 is now ongoing';
  progressPercentage = 65;
  
  showProgress = true;
  showLinks = false;
  showAll = true;
  currentPeriod = 'Q1';
  
  selectedPeriod = 'Week';
  periods = ['Q1', 'Q2', 'Q3', 'Q4'];
  
  phases: RoadmapPhase[] = [
    { 
      name: 'Planning', 
      startWeek: 1, 
      duration: 4, 
      color: '#3b82f6',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      progress: 100
    },
    { 
      name: 'Research', 
      startWeek: 2, 
      duration: 3, 
      color: '#10b981',
      startDate: '2024-02-01',
      endDate: '2024-02-28',
      progress: 85
    },
    { 
      name: 'Design', 
      startWeek: 4, 
      duration: 6, 
      color: '#f59e0b',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      progress: 60
    },
    { 
      name: 'Review', 
      startWeek: 8, 
      duration: 2, 
      color: '#ef4444',
      startDate: '2024-04-01',
      endDate: '2024-04-15',
      progress: 25
    },
    { 
      name: 'Develop', 
      startWeek: 9, 
      duration: 3, 
      color: '#8b5cf6',
      startDate: '2024-04-16',
      endDate: '2024-05-15',
      progress: 0
    },
    { 
      name: 'Review II', 
      startWeek: 11, 
      duration: 2, 
      color: '#06b6d4',
      startDate: '2024-05-16',
      endDate: '2024-05-31',
      progress: 0
    }
  ];
  
  totalWeeks = 14;
  
  toggleView(showAll: boolean): void {
    this.showAll = showAll;
  }

  setPeriod(period: string): void {
    this.currentPeriod = period;
  }

  getDisplayPhases(): RoadmapPhase[] {
    return this.phases; // For now, show all phases
  }

  getMonthsInPeriod(): string[] {
    const quarters = {
      'Q1': ['Jan', 'Feb', 'Mar'],
      'Q2': ['Apr', 'May', 'Jun'],
      'Q3': ['Jul', 'Aug', 'Sep'],
      'Q4': ['Oct', 'Nov', 'Dec']
    };
    return quarters[this.currentPeriod as keyof typeof quarters] || quarters.Q1;
  }

  getPhasePosition(phase: RoadmapPhase): { left: number; width: number } {
    const leftPercent = (phase.startWeek / this.totalWeeks) * 100;
    const widthPercent = (phase.duration / this.totalWeeks) * 100;
    
    return {
      left: leftPercent,
      width: widthPercent
    };
  }
  
  getPhaseStyle(phase: RoadmapPhase) {
    const leftPercent = (phase.startWeek / this.totalWeeks) * 100;
    const widthPercent = (phase.duration / this.totalWeeks) * 100;
    
    return {
      'left': leftPercent + '%',
      'width': widthPercent + '%',
      'background-color': phase.color
    };
  }
}
