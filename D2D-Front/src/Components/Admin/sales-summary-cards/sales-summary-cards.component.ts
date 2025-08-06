import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SummaryCard {
  icon: string;
  value: string;
  label: string;
  status: string;
  colorClass: string;
}

@Component({
  selector: 'app-sales-summary-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales-summary-cards.component.html',
  styleUrls: ['./sales-summary-cards.component.css']
})
export class SalesSummaryCardsComponent {
  summaryCards: SummaryCard[] = [
    {
      icon: 'fa-star',
      value: '57',
      label: 'new orders',
      status: 'Awaiting processing',
      colorClass: 'success'
    },
    {
      icon: 'fa-pause',
      value: '5',
      label: 'orders',
      status: 'On hold',
      colorClass: 'warning'
    },
    {
      icon: 'fa-times',
      value: '15',
      label: 'products',
      status: 'Out of stock',
      colorClass: 'danger'
    }
  ];
}
