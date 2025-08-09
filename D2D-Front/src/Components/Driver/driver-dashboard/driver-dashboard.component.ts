import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AvailabilityStatusService } from '../../../Services/Driver/availability-status.service';
import { Firestore, collection, query, where, orderBy, limit, onSnapshot } from '@angular/fire/firestore';
import { AuthService } from '../../../Services/auth.service';

interface IStatistics {
  icon: string;
  title: string;
  total: number;
  color: string;
}

@Component({
  standalone: true,
  selector: 'app-driver-dashboard',
  imports: [CommonModule],
  templateUrl: './driver-dashboard.component.html',
  styleUrls: ['./driver-dashboard.component.css']
})
export class DriverDashboardComponent implements OnInit{
  availablityStatus: string = 'Available';
  statistics: IStatistics[] = [
    {
      icon: "fa-solid fa-dollar-sign",
      title: "Today's Earnings",
      total: 245,
      color: "money-icon"
    },
    {
      icon: "fas fa-chart-line",
      title: "This Week",
      total: 1680,
      color: "services-icon"
    },
    {
      icon: "fas fa-chart-line",
      title: "This Month",
      total: 6420,
      color: "loyalty-icon"
    },
    {
      icon: "fa-solid fa-toolbox",
      title: "Total Jobs",
      total: 340,
      color: "member-icon"
    }
  ];
  recentTrips: any[] = [];
  private tripsUnsub?: () => void;
  
  constructor(private availabilityService: AvailabilityStatusService, private firestore: Firestore, private auth: AuthService) {}

  ngOnInit(): void {
    this.availabilityService.availabilityStatus$.subscribe(status => {
      this.availablityStatus = status;
    });
    this.subscribeRecentTrips();
  }

  private subscribeRecentTrips() {
    const user = this.auth.getCurrentUser();
    if (!user) return;
    const ref = collection(this.firestore, 'adminOrders');
    const q = query(ref, where('assignedDriverIds', 'array-contains', user.uid), orderBy('createdAt','desc'), limit(3));
    this.tripsUnsub = onSnapshot(q, snap => {
      const list:any[] = [];
      const now = Date.now();
      snap.forEach(d => {
        const data:any = d.data();
        const created = data.createdAt?.toMillis ? data.createdAt.toMillis() : (data.createdAt?._seconds? data.createdAt._seconds * 1000 : now);
        const diffMin = Math.max(0, Math.round((now - created)/60000));
        list.push({
          id: d.id,
          to: data.serviceType,
          distance: data.distance || '-',
          amount: data.amount,
          status: data.fulfillment === 'Fulfilled' ? 'Completed' : 'Active',
          timeAgo: diffMin < 60 ? diffMin + ' min ago' : Math.round(diffMin/60) + 'h ago'
        });
      });
      this.recentTrips = list;
    });
  }

  onStatusChange(event: Event) {
    const newStatus = (event.target as HTMLSelectElement).value;
    this.availabilityService.setAvailability(newStatus);
  }
}
