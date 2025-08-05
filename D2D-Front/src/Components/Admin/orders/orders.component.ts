import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Order {
  id: string;
  date: string;
  customer: string;
  payment: 'Pending' | 'Success';
  total: number;
  delivery: string;
  items: number;
  fulfillment: 'Unfulfilled' | 'Fulfilled';
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orders: Order[] = [
    { id: '#002', date: '11 Feb, 2024', customer: 'Wade Warren', payment: 'Pending', total: 20.00, delivery: 'N/A', items: 2, fulfillment: 'Unfulfilled' },
    { id: '#004', date: '13 Feb, 2024', customer: 'Esther Howard', payment: 'Success', total: 22.00, delivery: 'N/A', items: 3, fulfillment: 'Fulfilled' },
    { id: '#007', date: '15 Feb, 2024', customer: 'Jenny Wilson', payment: 'Pending', total: 25.00, delivery: 'N/A', items: 1, fulfillment: 'Unfulfilled' },
    { id: '#009', date: '17 Feb, 2024', customer: 'Guy Hawkins', payment: 'Success', total: 27.00, delivery: 'N/A', items: 5, fulfillment: 'Fulfilled' },
    { id: '#011', date: '19 Feb, 2024', customer: 'Jacob Jones', payment: 'Pending', total: 32.00, delivery: 'N/A', items: 4, fulfillment: 'Unfulfilled' },
    { id: '#013', date: '21 Feb, 2024', customer: 'Kristin Watson', payment: 'Success', total: 25.00, delivery: 'N/A', items: 3, fulfillment: 'Fulfilled' },
    { id: '#015', date: '23 Feb, 2024', customer: 'Albert Flores', payment: 'Pending', total: 28.00, delivery: 'N/A', items: 2, fulfillment: 'Unfulfilled' },
    { id: '#018', date: '25 Feb, 2024', customer: 'Eleanor Pena', payment: 'Success', total: 35.00, delivery: 'N/A', items: 1, fulfillment: 'Fulfilled' },
    { id: '#019', date: '27 Feb, 2024', customer: 'Theresa Webb', payment: 'Pending', total: 20.00, delivery: 'N/A', items: 2, fulfillment: 'Unfulfilled' }
  ];

  totalOrders = 21;
  orderItems = 15;
  returnOrders = 0;
  fulfilledOrders = 12;
  selectedAction = 'More actions';


  filters = ['All', 'Unfulfilled', 'Unpaid', 'Closed'];
  selectedFilter = 'All';
  filteredOrders: Order[] = [];

  showMoreActions = false;
  showDateDropdown = false;
  selectedDateRange = 'Jan 1 - Jan 30, 2024';

  ngOnInit(): void {
    this.filteredOrders = this.orders;
  }

  setFilter(filter: string): void {
    this.selectedFilter = filter;
    if (filter === 'All') {
      this.filteredOrders = this.orders;
    } else if (filter === 'Unfulfilled') {
      this.filteredOrders = this.orders.filter(o => o.fulfillment === 'Unfulfilled');
    } else if (filter === 'Unpaid') {
      this.filteredOrders = this.orders.filter(o => o.payment === 'Pending');
    } else if (filter === 'Closed') {
      this.filteredOrders = [];
    }
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
  }

  createOrder(): void {
    console.log('Create new order');
  }

  exportOrders(): void {
    console.log('Export orders');
  }

  viewOrder(orderId: string): void {
    console.log('View order:', orderId);
  }

  editOrder(orderId: string): void {
    console.log('Edit order:', orderId);
  }

  deleteOrder(orderId: string): void {
    console.log('Delete order:', orderId);
  }

  selectMoreAction(action: string): void {
  this.selectedAction = action;
  this.showMoreActions = false;
  console.log('Selected action:', action);
}

}
