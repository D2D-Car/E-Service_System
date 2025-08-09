import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, orderBy, onSnapshot, updateDoc, doc, deleteDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrderIdService } from './order-id.service';

export interface AdminOrder {
  id?: string;
  orderId: string;
  serviceId?: string;
  date: string;
  customer: string;
  serviceType: string;
  amount: number;
  status: 'pending' | 'completed' | 'in-progress' | 'scheduled' | 'cancelled';
  technician: string;
  vehicle: string;
  location: string;
  items: number;
  fulfillment: 'Unfulfilled' | 'Fulfilled';
  payment: 'Pending' | 'Success';
  createdAt: Date;
  updatedAt: Date;
  // New assignment fields
  assignedDriverIds?: string[];
  assignedTechnicianIds?: string[];
  // Geo location shared by customer (optional)
  customerLocation?: { lat: number; lng: number };
}

@Injectable({
  providedIn: 'root'
})
export class AdminOrdersService {
  private ordersSubject = new BehaviorSubject<AdminOrder[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  constructor(private firestore: Firestore, private orderIdService: OrderIdService) {
    this.initializeRealtimeListener();
  }

  // Initialize real-time listener for admin orders
  private initializeRealtimeListener(): void {
    try {
      const ordersRef = collection(this.firestore, 'adminOrders');
      const ordersQuery = query(ordersRef, orderBy('createdAt', 'desc'));

      onSnapshot(ordersQuery, 
        (snapshot) => {
          const orders: AdminOrder[] = [];
          snapshot.forEach((doc) => {
            orders.push({ ...doc.data(), id: doc.id } as AdminOrder);
          });
          this.ordersSubject.next(orders);
        },
        (error: any) => {
          console.error('Error in admin orders snapshot listener:', error);
          if (error.code === 'permission-denied') {
            console.warn('Firebase permission denied for admin orders. Please check Firestore security rules.');
          } else if (error.code === 'failed-precondition') {
            console.warn('Firebase index missing for admin orders. Please create the required composite index.');
          }
          // Set empty array to prevent UI errors
          this.ordersSubject.next([]);
        }
      );
    } catch (error) {
      console.error('Error setting up admin orders listener:', error);
      this.ordersSubject.next([]);
    }
  }

  // Add new order from customer service booking
  async addOrderFromService(serviceData: any, customerName: string): Promise<string> {
    try {
      const sequentialId = await this.orderIdService.getNextOrderId();
      const newOrder: Omit<AdminOrder, 'id'> = {
        orderId: sequentialId,
        serviceId: serviceData.id,
        date: this.formatDate(serviceData.serviceDate || new Date()),
        customer: customerName,
        serviceType: serviceData.title,
        amount: serviceData.price,
        status: 'scheduled',
        technician: serviceData.technician,
        vehicle: serviceData.vehicle,
        location: serviceData.location || 'Main Branch',
        items: 1,
        fulfillment: 'Unfulfilled',
        payment: 'Pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(this.firestore, 'adminOrders'), newOrder);
      return docRef.id;
    } catch (error: any) {
      console.error('Error adding admin order:', error);
      if (error.code === 'permission-denied') {
        throw new Error('Permission denied. Unable to create admin order. Please check account permissions.');
      }
      throw error;
    }
  }

  // Get all orders
  async getAllOrders(): Promise<AdminOrder[]> {
    try {
      const ordersRef = collection(this.firestore, 'adminOrders');
      const ordersQuery = query(ordersRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(ordersQuery);
      
      const orders: AdminOrder[] = [];
      snapshot.forEach((doc) => {
        orders.push({ ...doc.data(), id: doc.id } as AdminOrder);
      });

      return orders;
    } catch (error) {
      console.error('Error getting orders:', error);
      return [];
    }
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: AdminOrder['status']): Promise<void> {
    try {
      const orderRef = doc(this.firestore, 'adminOrders', orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Update entire order
  async updateOrder(orderId: string, orderData: Partial<AdminOrder>): Promise<void> {
    try {
      const orderRef = doc(this.firestore, 'adminOrders', orderId);
      // Remove id from the data to be updated (if present)
      const { id, ...dataToUpdate } = orderData;
      
      // Ensure updatedAt is set to current time
      await updateDoc(orderRef, {
        ...dataToUpdate,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  // New: assign drivers & technicians to order
  async assignOrder(orderId: string, driverIds: string[], technicianIds: string[]): Promise<void> {
    try {
      const orderRef = doc(this.firestore, 'adminOrders', orderId);
      await updateDoc(orderRef, {
        assignedDriverIds: driverIds,
        assignedTechnicianIds: technicianIds,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error assigning order:', error);
      throw error;
    }
  }

  // Delete order
  async deleteOrder(orderId: string): Promise<void> {
    try {
      await deleteDoc(doc(this.firestore, 'adminOrders', orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }

  // Get orders observable
  getOrders(): Observable<AdminOrder[]> {
    return this.orders$;
  }

  // Format date for display
  private formatDate(date: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  }
}