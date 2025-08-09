import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ModalData {
  title: string;
  subtitle: string;
  stats: Array<{
    icon: string;
    value: string;
    label: string;
  }>;
  details: Array<{
    label: string;
    value: string;
  }>;
}

@Component({
  selector: 'app-financial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './financial.component.html',
  styleUrl: './financial.component.css',
})
export class FinancialComponent {
  touchStartY: number = 0;
  showModal: boolean = false;
  modalData: ModalData = {
    title: '',
    subtitle: '',
    stats: [],
    details: [],
  };

  ngOnInit(): void {
    // Simulate loading overlay
    setTimeout(() => {
      const overlay = document.getElementById('loadingOverlay');
      if (overlay) overlay.classList.add('hidden');
      this.initializeDashboard();
    }, 1000);

    // Keyboard interaction
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'r') {
        location.reload();
      }
      if (e.key.toLowerCase() === 'u') {
        this.updateAllData();
      }
      if (e.key === 'Escape' && this.showModal) {
        this.closeModal();
      }
    });

    // Touch support
    document.addEventListener('touchstart', (e: TouchEvent) => {
      this.touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diff = this.touchStartY - touchEndY;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.updateAllData();
        } else {
          location.reload();
        }
      }
    });

    // Auto-refresh every 30 seconds
    setInterval(() => {
      this.updateAllData();
    }, 30000);
  }

  openModal(type: 'revenue' | 'projects' | 'team'): void {
    this.showModal = true;
    
    switch (type) {
      case 'revenue':
        this.modalData = {
          title: 'Revenue Details',
          subtitle: 'Financial performance and revenue metrics',
          stats: [
            { icon: '💰', value: '$18,340', label: 'Current Revenue' },
            { icon: '📈', value: '+12.5%', label: 'Growth Rate' },
            { icon: '🎯', value: '$25,000', label: 'Target Revenue' },
            { icon: '📊', value: '83%', label: 'Target Achievement' }
          ],
          details: [
            { label: 'Monthly Average', value: '$15,280' },
            { label: 'Highest Month', value: '$22,450 (March)' },
            { label: 'Lowest Month', value: '$8,920 (January)' },
            { label: 'Year-to-Date', value: '$156,780' },
            { label: 'Projected Annual', value: '$220,080' },
            { label: 'Revenue per Customer', value: '$1,245' }
          ]
        };
        break;
        
      case 'projects':
        this.modalData = {
          title: 'Projects Overview',
          subtitle: 'Project management and completion statistics',
          stats: [
            { icon: '📊', value: '25', label: 'Total Projects' },
            { icon: '✅', value: '18', label: 'Completed' },
            { icon: '🔄', value: '5', label: 'In Progress' },
            { icon: '⏳', value: '2', label: 'Pending' }
          ],
          details: [
            { label: 'Completion Rate', value: '72%' },
            { label: 'Average Duration', value: '45 days' },
            { label: 'On-Time Delivery', value: '85%' },
            { label: 'Customer Satisfaction', value: '4.8/5' },
            { label: 'Team Efficiency', value: '92%' },
            { label: 'Budget Adherence', value: '88%' }
          ]
        };
        break;
        
      case 'team':
        this.modalData = {
          title: 'Team Growth Details',
          subtitle: 'Team expansion and performance metrics',
          stats: [
            { icon: '👥', value: '13', label: 'Current Members' },
            { icon: '➕', value: '+3', label: 'This Quarter' },
            { icon: '⭐', value: '4.6', label: 'Team Rating' },
            { icon: '🎯', value: '82%', label: 'Growth Target' }
          ],
          details: [
            { label: 'Department Distribution', value: 'Tech: 6, Sales: 4, Support: 3' },
            { label: 'Average Experience', value: '3.2 years' },
            { label: 'Training Completion', value: '95%' },
            { label: 'Employee Satisfaction', value: '4.7/5' },
            { label: 'Retention Rate', value: '94%' },
            { label: 'Performance Score', value: '88%' }
          ]
        };
        break;
    }
  }

  closeModal(): void {
    this.showModal = false;
  }

  initializeDashboard(): void {
    setTimeout(() => {
      (document.getElementById('moneyProgress') as HTMLElement).style.width =
        '80%';
    }, 500);

    setTimeout(() => {
      (document.getElementById('projectsProgress') as HTMLElement).style.width =
        '59%';
    }, 800);

    setTimeout(() => {
      (document.getElementById('teamProgress') as HTMLElement).style.width =
        '75%';
    }, 1100);

    this.animateNumber('moneyValue', 0, 18340, 2000, '$');
    this.animateNumber('projectsValue', 0, 23, 2000);
    this.animateNumber('teamValue', 0, 12, 2000);

    setTimeout(() => {
      this.animateNumber('totalTickets', 0, 2403, 1500);
      this.animateNumber('pendingTickets', 0, 340, 1500);
      this.animateNumber('closedTickets', 0, 1540, 1500);
      this.animateNumber('deletedTickets', 0, 103, 1500);
    }, 500);
  }

  animateNumber(
    elementId: string,
    start: number,
    end: number,
    duration: number,
    prefix: string = ''
  ): void {
    const element = document.getElementById(elementId);
    if (!element) return;

    const startTime = performance.now();

    const update = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * easeOutCubic);
      element.textContent = prefix + current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }

  updateTarget(element: HTMLElement, type: string): void {
    element.style.transform = 'scale(0.98)';
    setTimeout(() => {
      element.style.transform = 'scale(1)';

      const progressBar = element.querySelector(
        '.progress-fill'
      ) as HTMLElement;
      const percentage = element.querySelector(
        '.progress-percentage'
      ) as HTMLElement;
      const currentWidth = parseInt(progressBar.style.width);
      const newWidth = Math.min(currentWidth + Math.random() * 10, 100);
      progressBar.style.width = `${newWidth}%`;
      percentage.textContent = `${Math.floor(newWidth)}%`;

      if (type === 'money') {
        const valueEl = document.getElementById('moneyValue');
        const current = parseInt(
          valueEl?.textContent?.replace(/,/g, '') || '0'
        );
        const newValue = current + Math.floor(Math.random() * 1000);
        this.animateNumber('moneyValue', current, newValue, 1000, '$');
      } else if (type === 'projects') {
        const valueEl = document.getElementById('projectsValue');
        const current = parseInt(valueEl?.textContent || '0');
        const newValue = current + Math.floor(Math.random() * 3);
        this.animateNumber('projectsValue', current, newValue, 1000);
      } else if (type === 'team') {
        const valueEl = document.getElementById('teamValue');
        const current = parseInt(valueEl?.textContent || '0');
        const newValue = current + Math.floor(Math.random() * 2);
        this.animateNumber('teamValue', current, newValue, 1000);
      }
    }, 100);
  }

  animateCard(element: HTMLElement, type: string): void {
    element.style.transform = 'scale(0.95) rotateY(5deg)';
    setTimeout(() => {
      element.style.transform = 'scale(1) rotateY(0deg)';
      const numberElement = element.querySelector(
        '.stat-number'
      ) as HTMLElement;
      const current = parseInt(
        numberElement?.textContent?.replace(/,/g, '') || '0'
      );
      let change = 0;

      if (type === 'pending') {
        change = Math.floor(Math.random() * 10) - 5;
      } else if (type === 'closed') {
        change = Math.floor(Math.random() * 20);
      } else if (type === 'deleted') {
        change = Math.floor(Math.random() * 5);
      } else {
        change = Math.floor(Math.random() * 15);
      }

      const newValue = Math.max(0, current + change);
      this.animateNumber(numberElement.id, current, newValue, 800);

      if (type !== 'total') {
        setTimeout(() => this.updateTotal(), 800);
      }
    }, 150);
  }

  updateTotal(): void {
    const pending = parseInt(
      document
        .getElementById('pendingTickets')
        ?.textContent?.replace(/,/g, '') || '0'
    );
    const closed = parseInt(
      document
        .getElementById('closedTickets')
        ?.textContent?.replace(/,/g, '') || '0'
    );
    const deleted = parseInt(
      document
        .getElementById('deletedTickets')
        ?.textContent?.replace(/,/g, '') || '0'
    );
    const current = parseInt(
      document.getElementById('totalTickets')?.textContent?.replace(/,/g, '') ||
        '0'
    );
    const newTotal = pending + closed + deleted;

    if (newTotal !== current) {
      this.animateNumber('totalTickets', current, newTotal, 600);
    }
  }

  updateAllData(): void {
    const types = ['money', 'projects', 'team'];
    const targetCards = document.querySelectorAll('.target-card');

    targetCards.forEach((item, index) => {
      setTimeout(() => {
        this.updateTarget(item as HTMLElement, types[index]);
      }, index * 200);
    });

    setTimeout(() => {
      const statCards = document.querySelectorAll('.stat-card');
      const statTypes = ['total', 'pending', 'closed', 'deleted'];

      statCards.forEach((card, index) => {
        setTimeout(() => {
          this.animateCard(card as HTMLElement, statTypes[index]);
        }, index * 150);
      });
    }, 600);
  }
}
