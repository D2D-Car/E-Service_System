import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SummaryCard {
  icon: string;
  value: string;
  label: string;
  description: string;
  color: string;
}

@Component({
  selector: 'app-project-summary-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-summary-cards.component.html',
  styleUrls: ['./project-summary-cards.component.css'],
})
export class ProjectSummaryCardsComponent {
  summaryCards: SummaryCard[] = [
    {
      icon: 'bi-grid-3x3',
      value: '32',
      label: 'Projects',
      description: 'Awaiting processing',
      color: '#4f46e5',
    },
    {
      icon: 'bi-people',
      value: '94',
      label: 'Members',
      description: 'Working hard',
      color: '#10b981',
    },
    {
      icon: 'bi-receipt',
      value: '23',
      label: 'Invoices',
      description: 'Soon to be cleared',
      color: '#f59e0b',
    },
    {
      icon: 'bi-arrow-repeat',
      value: '3',
      label: 'Refunds',
      description: 'Fresh start',
      color: '#ef4444',
    },
  ];
}
