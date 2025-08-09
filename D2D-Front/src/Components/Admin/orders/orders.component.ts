import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../Services/theme.service';
import { Subscription } from 'rxjs';
import { AdminOrdersService, AdminOrder } from '../../../Services/admin-orders.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { UserDataService, UserProfile } from '../../../Services/user-data.service';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule,FormsModule],
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
  
  // Modal properties
  showOrderDetailsModal = false;
  selectedOrder: AdminOrder | null = null;

  // Assignment modal state
  showAssignModal = false;
  drivers: UserProfile[] = [];
  technicians: UserProfile[] = [];
  selectedDriverIds = new Set<string>();
  selectedTechnicianIds = new Set<string>();
  loadingAssignments = false;
  assignmentError: string | null = null;

  constructor(
    private themeService: ThemeService,
    private adminOrdersService: AdminOrdersService,
    private cdr: ChangeDetectorRef,
    private userDataService: UserDataService,
    private firestore: Firestore
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
    // Find the order by ID
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      this.selectedOrder = order;
      this.showOrderDetailsModal = true;
    } else {
      await Swal.fire('Error', 'Order not found', 'error');
    }
  }

  // Properties for edit modal
  showEditOrderModal = false;
  orderToEdit: AdminOrder | null = null;

  async editOrder(orderId: string): Promise<void> {
    console.log('Edit order:', orderId);
    const orderToEdit = this.orders.find(order => order.id === orderId);
    if (orderToEdit) {
      this.orderToEdit = { ...orderToEdit }; // Create a copy to avoid direct mutation
      this.showEditOrderModal = true;
    }
  }

  // Open assignment modal
  async openAssignModal(order: AdminOrder): Promise<void> {
    this.selectedOrder = order;
    this.showAssignModal = true;
    this.assignmentError = null;
    this.loadingAssignments = true;
    this.selectedDriverIds = new Set(order.assignedDriverIds || []);
    this.selectedTechnicianIds = new Set(order.assignedTechnicianIds || []);
    try {
      const [drivers, technicians] = await Promise.all([
        this.userDataService.getUsersByRole('driver'),
        this.userDataService.getUsersByRole('technician')
      ]);
      this.drivers = drivers;
      this.technicians = technicians;
    } catch (e:any) {
      this.assignmentError = 'Failed to load users';
    } finally {
      this.loadingAssignments = false;
      this.cdr.detectChanges();
    }
  }

  closeAssignModal(): void {
    this.showAssignModal = false;
  }

  toggleDriver(uid: string): void { this.selectedDriverIds.has(uid) ? this.selectedDriverIds.delete(uid) : this.selectedDriverIds.add(uid); }
  toggleTechnician(uid: string): void { this.selectedTechnicianIds.has(uid) ? this.selectedTechnicianIds.delete(uid) : this.selectedTechnicianIds.add(uid); }

  async saveAssignment(): Promise<void> {
    if (!this.selectedOrder?.id) return;
    try {
      await this.adminOrdersService.assignOrder(
        this.selectedOrder.id,
        Array.from(this.selectedDriverIds),
        Array.from(this.selectedTechnicianIds)
      );
      Swal.fire('Success','Order Saved','success');
      this.closeAssignModal();
    } catch (e:any) {
      Swal.fire('Error','Failed to save assignment','error');
    }
  }

  closeEditOrderModal(): void {
    this.showEditOrderModal = false;
    this.orderToEdit = null;
  }

  saveOrderChanges(): void {
    if (!this.orderToEdit || !this.orderToEdit.id) return;
    
    // Update the order in the service
    this.adminOrdersService.updateOrder(this.orderToEdit.id, this.orderToEdit)
      .then(() => {
        // Close the modal after successful update
        this.closeEditOrderModal();
        // Show success message
        Swal.fire({
          title: 'Success!',
          text: 'Order updated successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      })
      .catch(error => {
        console.error('Error updating order:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to update order',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  }

  async deleteOrder(orderId: string): Promise<void> {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await this.adminOrdersService.deleteOrder(orderId);
        this.orders = this.orders.filter(order => order.id !== orderId);
        this.updateFilteredOrders();
        this.updateStatistics();
        this.cdr.detectChanges();
        await Swal.fire('Deleted!', 'Order has been deleted.', 'success');
        console.log('Order deleted:', orderId);
      } catch (error) {
        console.error('Error deleting order:', error);
        await Swal.fire('Error', 'Failed to delete order. Please try again.', 'error');
      }
    }
  }

  async selectMoreAction(action: string): Promise<void> {
    this.selectedAction = action;
    this.showMoreActions = false;

    switch (action) {
      case 'Export CSV':
        this.exportOrders();
        break;
      case 'Create Order':
        this.createOrder();
        break;
      case 'Clear Modal Orders':
        const clearResult = await Swal.fire({
          title: 'Are you sure?',
          text: 'This will keep only the initial 12 orders (#001-#012).',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, clear orders',
          cancelButtonText: 'Cancel',
        });
        if (clearResult.isConfirmed) {
          await this.clearModalOrders();
        }
        break;
      case 'Remove Duplicate Orders':
        const duplicateResult = await Swal.fire({
          title: 'Are you sure?',
          text: 'This will keep only unique orders based on ID.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, remove duplicates',
          cancelButtonText: 'Cancel',
        });
        if (duplicateResult.isConfirmed) {
          await this.removeDuplicateOrders();
        }
        break;
      default:
        console.log('Selected action:', action);
    }
  }

  // Close dropdowns when clicking outside
  closeDropdowns(): void {
    this.showMoreActions = false;
    this.showDateDropdown = false;
  }
  
  // Close order details modal
  closeOrderDetailsModal(): void {
    this.showOrderDetailsModal = false;
    this.selectedOrder = null;
  }

  // Clear only the modal orders (keeps first 12 orders)
  private async clearModalOrders(): Promise<void> {
    try {
      // Keep only the first 12 orders (assuming they have IDs #001-#012)
      this.orders = this.orders.slice(0, 12);
      this.updateFilteredOrders();
      this.updateStatistics();
      this.cdr.detectChanges();
      await Swal.fire('Success', 'Modal orders have been cleared.', 'success');
    } catch (error) {
      console.error('Error clearing modal orders:', error);
      await Swal.fire('Error', 'Failed to clear modal orders.', 'error');
    }
  }

  // Remove duplicate orders based on order ID
  private async removeDuplicateOrders(): Promise<void> {
    try {
      const uniqueOrders = Array.from(new Map(this.orders.map(order => [order.id, order])).values());
      if (uniqueOrders.length === this.orders.length) {
        await Swal.fire('Info', 'No duplicate orders found.', 'info');
        return;
      }
      
      this.orders = uniqueOrders;
      this.updateFilteredOrders();
      this.updateStatistics();
      this.cdr.detectChanges();
      
      const removedCount = this.orders.length - uniqueOrders.length;
      await Swal.fire(
        'Success', 
        `Removed ${removedCount} duplicate order${removedCount === 1 ? '' : 's'}.`, 
        'success'
      );
    } catch (error) {
      console.error('Error removing duplicate orders:', error);
      await Swal.fire('Error', 'Failed to remove duplicate orders.', 'error');
    }
  }

  // Track by function for better performance
  trackByOrderId(index: number, order: AdminOrder): string {
    return order.id || index.toString();
  }
}
