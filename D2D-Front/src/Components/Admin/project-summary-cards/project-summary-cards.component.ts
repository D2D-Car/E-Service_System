import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SummaryCard {
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
      value: '32',
      label: 'Projects',
      description: 'Awaiting processing',
      color: '#4f46e5',
    },
    {
      value: '94',
      label: 'Members',
      description: 'Working hard',
      color: '#10b981',
    },
    {
      value: '23',
      label: 'Invoices',
      description: 'Soon to be cleared',
      color: '#f59e0b',
    },
    {
      value: '3',
      label: 'Refunds',
      description: 'Fresh start',
      color: '#ef4444',
    },
  ];
}
