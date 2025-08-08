import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
})
export class CustomersComponent {
  showProfileModal = false;
  selectedCustomer: any = null;

  customers = [
    {
      id: 1,
      name: 'Ahmed Hassan',
      membershipType: 'Premium',
      totalOrders: 15,
      image: '/assets/customers-img/cust1.jpg',
      joined: 'Jan 2024',
      totalSpent: '12,500',
      location: 'Cairo, Egypt',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Essam El-Sayed',
      membershipType: 'Gold',
      totalOrders: 8,
      image: '/assets/customers-img/cust2.jpg',
      joined: 'Feb 2024',
      totalSpent: '8,200',
      location: 'Alexandria, Egypt',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Mohamed Ali',
      membershipType: 'Premium',
      totalOrders: 22,
      image: '/assets/customers-img/cust3.jpg',
      joined: 'Mar 2024',
      totalSpent: '18,900',
      location: 'Giza, Egypt',
      status: 'Active',
    },
    {
      id: 4,
      name: 'Nour Ibrahim',
      membershipType: 'Silver',
      totalOrders: 12,
      image: '/assets/customers-img/cust4.jpg',
      joined: 'Apr 2024',
      totalSpent: '6,800',
      location: 'Mansoura, Egypt',
      status: 'Inactive',
    },
    {
      id: 5,
      name: 'Omar Mahmoud',
      membershipType: 'Gold',
      totalOrders: 18,
      image: '/assets/customers-img/cust5.jpg',
      joined: 'May 2024',
      totalSpent: '14,300',
      location: 'Aswan, Egypt',
      status: 'Active',
    },
    {
      id: 6,
      name: 'Yassin Farouk',
      membershipType: 'Silver',
      totalOrders: 9,
      image: '/assets/customers-img/cust6.jpg',
      joined: 'Jun 2024',
      totalSpent: '5,600',
      location: 'Luxor, Egypt',
      status: 'Active',
    },
    {
      id: 7,
      name: 'Karim Adel',
      membershipType: 'Premium',
      totalOrders: 25,
      image: '/assets/customers-img/cust7.jpg',
      joined: 'Jul 2024',
      totalSpent: '22,100',
      location: 'Tanta, Egypt',
      status: 'Active',
    },
    {
      id: 8,
      name: 'Mohamed Youssef',
      membershipType: 'Gold',
      totalOrders: 14,
      image: '/assets/customers-img/cust8.jpg',
      joined: 'Aug 2024',
      totalSpent: '9,750',
      location: 'Ismailia, Egypt',
      status: 'Active',
    },
  ];

callCustomer(customer: any) {
  Swal.fire({
    icon: 'info',
    title: `Contacting ${customer.name}`,
    text: `${customer.membershipType} member`,
    confirmButtonText: 'OK'
  });
}

emailCustomer(customer: any) {
  Swal.fire({
    icon: 'info',
    title: `Viewing orders for ${customer.name}`,
    text: `Total orders: ${customer.totalOrders}`,
    confirmButtonText: 'OK'
  });
}



  viewCustomerProfile(customer: any) {
    this.selectedCustomer = customer;
    this.showProfileModal = true;
    console.log('Viewing profile of customer:', customer.name);
  }

  closeProfileModal() {
    this.showProfileModal = false;
    this.selectedCustomer = null;
  }

removeCustomer(customer: any) {
  Swal.fire({
    title: `Are you sure you want to remove ${customer.name}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, remove',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
  }).then((result) => {
    if (result.isConfirmed) {
      this.customers = this.customers.filter((c) => c.id !== customer.id);
      console.log('Customer removed:', customer.name);
      Swal.fire('Removed!', `${customer.name} has been removed.`, 'success');
    }
  });
}

}