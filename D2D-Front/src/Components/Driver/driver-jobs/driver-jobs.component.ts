import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../Services/auth.service';
import { Firestore, collection, query, where, onSnapshot } from '@angular/fire/firestore';

interface DriverTrip {
  id?: string;
  orderId?: string;
  customer?: string;
  from?: string; // using location as from
  to?: string; // serviceType or vehicle destination placeholder
  distance?: string;
  amount?: number;
  status?: string; // derived from fulfillment/payment
  createdAt?: any;
}

@Component({
  selector: 'app-driver-jobs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './driver-jobs.component.html',
  styleUrl: './driver-jobs.component.css'
})
export class DriverJobsComponent implements OnInit, OnDestroy {
  isNavbarCollapsed = true;
  selectedStatus: string = 'All';
  trips: DriverTrip[] = [];
  filteredTrips: DriverTrip[] = [];
  private sub?: () => void;

  constructor(private auth: AuthService, private firestore: Firestore) {}

  ngOnInit(): void { this.subscribeTrips(); }
  ngOnDestroy(): void { if (this.sub) this.sub(); }

  private subscribeTrips() {
    const user = this.auth.getCurrentUser();
    if (!user) return;
    const ref = collection(this.firestore, 'adminOrders');
    const q = query(ref, where('assignedDriverIds', 'array-contains', user.uid));
    this.sub = onSnapshot(q, snap => {
      const list: DriverTrip[] = [];
      snap.forEach(d => {
        const data:any = d.data();
        list.push({
          id: d.id,
          orderId: data.orderId,
            customer: data.customer,
            from: data.location,
            to: data.serviceType,
            amount: data.amount,
            status: data.fulfillment === 'Fulfilled' ? 'Completed' : 'Active',
            createdAt: data.createdAt
        });
      });
      this.trips = list;
      this.filterTrips(this.selectedStatus);
    });
  }

  toggleNavbar(): void { this.isNavbarCollapsed = !this.isNavbarCollapsed; }

  filterTrips(status: string): void {
    this.selectedStatus = status;
    if (status === 'All') this.filteredTrips = this.trips;
    else this.filteredTrips = this.trips.filter(t => t.status?.toLowerCase() === status.toLowerCase());
  }
}

