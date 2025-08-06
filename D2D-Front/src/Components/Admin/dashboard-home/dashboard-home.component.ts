import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesSummaryCardsComponent } from '../sales-summary-cards/sales-summary-cards.component';
import { TotalSellsChartComponent } from '../total-sells-chart/total-sells-chart.component';
import { ProjectSummaryCardsComponent } from '../project-summary-cards/project-summary-cards.component';
import { ProjectRoadmapComponent } from '../project-roadmap/project-roadmap.component';
import { EarlyBirdLeadsCardComponent } from '../early-bird-leads-card/early-bird-leads-card.component';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    CommonModule,
    SalesSummaryCardsComponent,
    TotalSellsChartComponent,
    ProjectSummaryCardsComponent,
    ProjectRoadmapComponent,
    EarlyBirdLeadsCardComponent,
  ],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css'],
})
export class DashboardHomeComponent {}
