import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../Services/theme.service';
import { Subscription } from 'rxjs';
<<<<<<< HEAD
import { AdminOrdersService, AdminOrder } from '../../../Services/admin-orders.service';
=======
import { OrderCommunicationService, CustomerOrder } from '../../../Services/order-communication.service';
import Swal from 'sweetalert2';


interface Order {
  id: string;
  date: string;
  customer: string;
  payment: 'Pending' | 'Success';
  total: number;
  delivery: string;
  items: number;
  fulfillment: 'Unfulfilled' | 'Fulfilled';
  serviceType?: string;
  vehicle?: string;
  technician?: string;
}
>>>>>>> c4062dfe12cb877b113c6906aebdbd59a3af0a02

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit, OnDestroy {
  private themeSubscription?: Subscription;
  private ordersSubscription?: Subscription;
  isDarkMode = false;

  orders: AdminOrder[] = [];

  // Statistics
  totalOrders = 0;
  orderItems = 0;
  returnOrders = 0;
  fulfilledOrders = 0;
  selectedAction = 'More actions';

  filters = ['All', 'Unfulfilled', 'Unpaid', 'Closed'];
  selectedFilter = 'All';
  filteredOrders: AdminOrder[] = [];

  showMoreActions = false;
  showDateDropdown = false;
  selectedDateRange = 'Aug 1 - Aug 6, 2024';

  constructor(
    private themeService: ThemeService,
    private adminOrdersService: AdminOrdersService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Admin Orders Component initialized');

    // Subscribe to theme changes
    this.themeSubscription = this.themeService.isDarkMode$.subscribe(
      (isDark) => (this.isDarkMode = isDark)
    );

    // Subscribe to Firebase orders
    this.ordersSubscription = this.adminOrdersService.getOrders().subscribe(
      (orders) => {
        console.log('Admin Orders: Received orders from Firebase:', orders);
        this.orders = orders;
        this.updateFilteredOrders();
        this.updateStatistics();
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Admin Orders: Error receiving orders:', error);
      }
    );
  }

  // Update statistics based on current orders
  private updateStatistics(): void {
    this.totalOrders = this.orders.length;
    this.orderItems = this.orders.reduce((sum, order) => sum + order.items, 0);
    this.fulfilledOrders = this.orders.filter(order => order.fulfillment === 'Fulfilled').length;
    this.returnOrders = this.orders.filter(order => order.payment === 'Pending').length;
  }

  // Helper method to update filtered orders based on current filter
  private updateFilteredOrders(): void {
    if (this.selectedFilter === 'All') {
      this.filteredOrders = this.orders;
    } else if (this.selectedFilter === 'Unfulfilled') {
      this.filteredOrders = this.orders.filter(
        (o) => o.fulfillment === 'Unfulfilled'
      );
    } else if (this.selectedFilter === 'Unpaid') {
      this.filteredOrders = this.orders.filter((o) => o.payment === 'Pending');
    } else if (this.selectedFilter === 'Closed') {
      this.filteredOrders = [];
    }
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    if (this.ordersSubscription) {
      this.ordersSubscription.unsubscribe();
    }
  }

  setFilter(filter: string): void {
    this.selectedFilter = filter;
    this.updateFilteredOrders();
  }

  toggleMoreActions(): void {
    this.showMoreActions = !this.showMoreActions;
  }

  toggleDateDropdown(): void {
    this.showDateDropdown = !this.showDateDropdown;
  }

  selectDateRange(range: string): void {
    this.selectedDateRange = range;
    this.showDateDropdown = false;
    // Here you could implement actual date filtering logic
  }

  createOrder(): void {
    console.log('Create new order');
    // Implementation for creating new order
  }

  exportOrders(): void {
    console.log('Export orders');
    // Implementation for exporting orders
  }

  async viewOrder(orderId: string): Promise<void> {
    console.log('View order:', orderId);
    // Implementation for viewing order details
  }

  async editOrder(orderId: string): Promise<void> {
    console.log('Edit order:', orderId);
    // Implementation for editing order
  }

<<<<<<< HEAD
  async deleteOrder(orderId: string): Promise<void> {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        await this.adminOrdersService.deleteOrder(orderId);
        console.log('Order deleted:', orderId);
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Failed to delete order. Please try again.');
      }
    }
=======
  deleteOrder(orderId: string): void {
Swal.fire({
  title: 'Are you sure?',
  text: 'Do you really want to delete this order?',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Yes, delete it!',
  cancelButtonText: 'Cancel',
}).then((result) => {
  if (result.isConfirmed) {
    this.orders = this.orders.filter((order) => order.id !== orderId);
    this.updateFilteredOrders();
    this.updateStatistics();
    this.cdr.detectChanges();
    Swal.fire('Deleted!', 'Order has been deleted.', 'success');
    console.log('Order deleted:', orderId);
  }
});

>>>>>>> c4062dfe12cb877b113c6906aebdbd59a3af0a02
  }

  selectMoreAction(action: string): void {
    this.selectedAction = action;
    this.showMoreActions = false;

    switch (action) {
      case 'Export CSV':
        this.exportOrders();
        break;
      case 'Create Order':
        this.createOrder();
        break;
<<<<<<< HEAD
=======
   case 'Clear Modal Orders':
  Swal.fire({
    title: 'Are you sure?',
    text: 'This will keep only the initial 12 orders (#001-#012).',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, clear orders',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    if (result.isConfirmed) {
      this.clearModalOrders();
    }
  });
  break;
     case 'Remove Duplicate Orders':
  Swal.fire({
    title: 'Are you sure?',
    text: 'This will keep only unique orders based on ID.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, remove duplicates',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    if (result.isConfirmed) {
      this.removeDuplicateOrders();
    }
  });
  break;
>>>>>>> c4062dfe12cb877b113c6906aebdbd59a3af0a02
      default:
        console.log('Selected action:', action);
    }
  }

  // Close dropdowns when clicking outside
  closeDropdowns(): void {
    this.showMoreActions = false;
    this.showDateDropdown = false;
  }

  // Track by function for better performance
  trackByOrderId(index: number, order: AdminOrder): string {
    return order.id || index.toString();
  }
}
