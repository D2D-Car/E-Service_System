import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-early-bird-leads-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './early-bird-leads-card.component.html',
  styleUrl: './early-bird-leads-card.component.css',
})
export class EarlyBirdLeadsCardComponent {
  comingSoonBadge = 'COMING SOON';
  title = 'Early Bird Leads';
  subtitle = 'Capture Interest Early';
  description =
    'Get notified when potential customers show interest before your service is fully launched.';

  features = [
    'Lead capture forms',
    'Email notifications',
    'Interest tracking',
    'Pre-launch analytics',
  ];

  // Dummy stats for preview
  previewStats = {
    interested: 1247,
    signups: 432,
    conversionRate: 34.7,
  };
}
