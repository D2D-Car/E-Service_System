import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, where, orderBy, updateDoc, doc, deleteDoc, onSnapshot } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrderIdService } from './order-id.service';

export interface ServiceBooking {
  id?: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  technician?: string; // made optional
  vehicle: string;
  serviceDate: Date;
  rating?: number; // made optional
  status: 'scheduled' | 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  location?: string;
  duration?: string;
  serviceType?: string;
  customerLocation?: { lat: number; lng: number }; // added
}

export interface UpcomingService {
  id?: string;
  day: string;
  month: string;
  title: string;
  description: string;
  vehicle: string;
  time: string;
  status: string;
  statusText: string;
  serviceDate: Date;
  price: number;
  technician?: string; // optional
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceService {
  private servicesSubject = new BehaviorSubject<ServiceBooking[]>([]);
  public services$ = this.servicesSubject.asObservable();

  private upcomingServicesSubject = new BehaviorSubject<UpcomingService[]>([]);
  public upcomingServices$ = this.upcomingServicesSubject.asObservable();

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private orderIdService: OrderIdService
  ) {
    this.initializeRealtimeListeners();
  }

  // Initialize real-time listeners
  private initializeRealtimeListeners(): void {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      this.setupUserServicesListener(currentUser.uid);
    }

    // Listen for auth state changes
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.setupUserServicesListener(user.uid);
      } else {
        this.servicesSubject.next([]);
        this.upcomingServicesSubject.next([]);
      }
    });
  }

  // Setup real-time listener for user services
  private setupUserServicesListener(userId: string): void {
    try {
      const servicesRef = collection(this.firestore, 'services');
      
      // Start with fallback listener to avoid index requirement
      this.setupFallbackListener(userId);
    } catch (error) {
      console.error('Error setting up services listener:', error);
      this.servicesSubject.next([]);
      this.upcomingServicesSubject.next([]);
    }
  }

  // Fallback listener without orderBy to avoid index requirement
  private setupFallbackListener(userId: string): void {
    try {
      const servicesRef = collection(this.firestore, 'services');
      const userServicesQuery = query(
        servicesRef,
        where('userId', '==', userId)
      );

      onSnapshot(userServicesQuery, 
        (snapshot) => {
          const services: ServiceBooking[] = [];
          const upcomingServices: UpcomingService[] = [];

          snapshot.forEach((doc) => {
            const data = doc.data() as ServiceBooking;
            const service = { ...data, id: doc.id };
            services.push(service);

            if (service.status === 'scheduled' || service.status === 'pending') {
              const upcoming = this.convertToUpcomingService(service);
              if (upcoming) {
                upcomingServices.push(upcoming);
              }
            }
          });

          // Sort manually since we can't use orderBy
          services.sort((a, b) => {
            const toDate = (v: any) => {
              if (v instanceof Date) return v;
              if (v && typeof v === 'object' && typeof v.toDate === 'function') return v.toDate();
              try { return new Date(v); } catch { return new Date(0); }
            };
            return toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime();
          });
          upcomingServices.sort((a, b) => new Date(a.serviceDate).getTime() - new Date(b.serviceDate).getTime());

          this.servicesSubject.next(services);
          this.upcomingServicesSubject.next(upcomingServices);
        },
        (error: any) => {
          console.error('Error in fallback services listener:', error);
          this.servicesSubject.next([]);
          this.upcomingServicesSubject.next([]);
        }
      );
    } catch (error) {
      console.error('Error setting up fallback listener:', error);
      this.servicesSubject.next([]);
      this.upcomingServicesSubject.next([]);
    }
  }

  // Add new service booking
  async addServiceBooking(serviceData: Partial<ServiceBooking>): Promise<string> {
    try {
      const currentUser = this.auth.currentUser;
      if (!currentUser) {
        throw new Error('User must be authenticated to book a service');
      }

      // derive customerLocation if provided as object or parsable string
      let customerLocation = serviceData.customerLocation;
      if (!customerLocation && serviceData.location && /-?\d+\.?\d*\s*,\s*-?\d+\.?\d*/.test(serviceData.location)) {
        const [latStr, lngStr] = (serviceData.location as string).split(',');
        const lat = parseFloat(latStr.trim());
        const lng = parseFloat(lngStr.trim());
        if (!isNaN(lat) && !isNaN(lng)) customerLocation = { lat, lng };
      }

      const newService: ServiceBooking = {
        userId: currentUser.uid,
        title: serviceData.title || '',
        description: serviceData.description || '',
        price: serviceData.price || 0,
        // optional fields will be conditionally added below
        vehicle: serviceData.vehicle || '',
        serviceDate: serviceData.serviceDate || new Date(),
        status: 'scheduled',
        createdAt: new Date(),
        updatedAt: new Date(),
        location: serviceData.location || '',
        duration: serviceData.duration || '60 mins',
        serviceType: serviceData.serviceType || 'General Service',
        customerLocation
      };

      // Conditionally attach optional fields only if defined (Firestore rejects undefined)
      if (serviceData.technician !== undefined) (newService as any).technician = serviceData.technician;
      if (serviceData.rating !== undefined) (newService as any).rating = serviceData.rating;
      if (customerLocation === undefined) {
        delete (newService as any).customerLocation; // avoid undefined
      }

      // Safety: remove any accidental undefined values
      Object.keys(newService).forEach(k => {
        if ((newService as any)[k] === undefined) {
          delete (newService as any)[k];
        }
      });

      console.log('[addServiceBooking] attempt user:', currentUser.uid, 'data:', newService);
      const docRef = await addDoc(collection(this.firestore, 'services'), newService).catch(err => {
        console.error('[addServiceBooking] Firestore addDoc error:', err?.code, err?.message, err);
        throw err;
      });
      console.log('[addServiceBooking] success id:', docRef.id);

      // Optimistic update so UI reflects immediately (real-time listener will reconcile)
      const currentList = this.servicesSubject.value.slice();
      const createdService: ServiceBooking = { ...newService, id: docRef.id };
      currentList.unshift(createdService);
      this.servicesSubject.next(currentList);
      if (createdService.status === 'scheduled' || createdService.status === 'pending') {
        const upList = this.upcomingServicesSubject.value.slice();
        const upcoming = this.convertToUpcomingService(createdService);
        if (upcoming) {
          upList.push(upcoming);
          this.upcomingServicesSubject.next(upList);
        }
      }
      
      // Also add to admin orders collection for admin dashboard
      try {
        await this.addToAdminOrders(newService, docRef.id);
      } catch (adminError) {
        console.warn('Failed to add to admin orders, but service was created:', adminError);
        // Don't throw error here as the main service was created successfully
      }
      
      return docRef.id;
    } catch (error: any) {
      console.error('Error adding service booking:', error);
      if (error.code === 'permission-denied') {
        throw new Error('Permission denied. Please check your account permissions or contact support.');
      }
      throw error;
    }
  }

  // Add service to admin orders collection
  private async addToAdminOrders(service: ServiceBooking, serviceId: string): Promise<void> {
    try {
      let sequentialId: string;
      try {
        sequentialId = await this.orderIdService.getNextOrderId();
      } catch (e) {
        console.warn('[addToAdminOrders] getNextOrderId failed, using fallback', e);
        sequentialId = `#SRVFB${Date.now().toString().slice(-5)}`;
      }
      // Attempt to fetch customer displayName
      let customerName = 'Customer';
      try {
        // dynamic import to avoid circular deps (auth service not injected here)
        const { doc, getDoc } = await import('@angular/fire/firestore');
        const userSnap = await getDoc(doc(this.firestore, 'users', service.userId));
        if (userSnap.exists()) {
          const data: any = userSnap.data();
          customerName = data.displayName || data.name || customerName;
        }
      } catch (e) {
        console.warn('[addToAdminOrders] could not fetch customer name', e);
      }
      const orderData: any = {
        serviceId: serviceId,
        orderId: sequentialId,
        date: this.formatDate(service.serviceDate),
        customer: customerName,
        serviceType: service.title,
        amount: service.price,
        status: service.status,
        technician: service.technician || '',
        vehicle: service.vehicle,
        location: service.location,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      if (service.customerLocation) orderData.customerLocation = service.customerLocation;
      try {
        await addDoc(collection(this.firestore, 'adminOrders'), orderData);
        console.log('[addToAdminOrders] created admin order', orderData.orderId);
      } catch (err: any) {
        console.error('[addToAdminOrders] addDoc error', err?.code, err?.message, err);
        // retry once with minimal required fields
        try {
          const minimal = { orderId: orderData.orderId, date: orderData.date, customer: orderData.customer, serviceType: orderData.serviceType, amount: orderData.amount, status: orderData.status, createdAt: new Date(), updatedAt: new Date() };
          await addDoc(collection(this.firestore, 'adminOrders'), minimal);
          console.log('[addToAdminOrders] retry succeeded with minimal data');
        } catch (retryErr) {
          console.error('[addToAdminOrders] retry failed', retryErr);
        }
      }
    } catch (error) {
      console.error('Error adding to admin orders:', error);
    }
  }

  // Get user services
  async getUserServices(userId: string): Promise<ServiceBooking[]> {
    try {
      const servicesRef = collection(this.firestore, 'services');
      const userServicesQuery = query(
        servicesRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(userServicesQuery);
      const services: ServiceBooking[] = [];

      snapshot.forEach((doc) => {
        services.push({ ...doc.data(), id: doc.id } as ServiceBooking);
      });

      return services;
    } catch (error) {
      console.error('Error getting user services:', error);
      return [];
    }
  }

  // Get upcoming services
  async getUpcomingServices(userId: string): Promise<UpcomingService[]> {
    try {
      const servicesRef = collection(this.firestore, 'services');
      const upcomingQuery = query(
        servicesRef,
        where('userId', '==', userId),
        where('status', 'in', ['scheduled', 'pending']),
        orderBy('serviceDate', 'asc')
      );

      const snapshot = await getDocs(upcomingQuery);
      const upcomingServices: UpcomingService[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data() as ServiceBooking;
        const upcoming = this.convertToUpcomingService({ ...data, id: doc.id });
        if (upcoming) upcomingServices.push(upcoming);
      });

      return upcomingServices;
    } catch (error) {
      console.error('Error getting upcoming services:', error);
      return [];
    }
  }

  // Update service status
  async updateServiceStatus(serviceId: string, status: ServiceBooking['status']): Promise<void> {
    try {
      const serviceRef = doc(this.firestore, 'services', serviceId);
      await updateDoc(serviceRef, {
        status,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating service status:', error);
      throw error;
    }
  }

  // Delete service
  async deleteService(serviceId: string): Promise<void> {
    try {
      await deleteDoc(doc(this.firestore, 'services', serviceId));
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }

  // Convert service booking to upcoming service format
  private convertToUpcomingService(service: ServiceBooking): UpcomingService | null {
    let rawDate: any = service.serviceDate;
    let serviceDate: Date | null = null;
    try {
      if (rawDate instanceof Date) {
        serviceDate = rawDate;
      } else if (rawDate && typeof rawDate === 'object' && typeof rawDate.toDate === 'function') {
        // Firestore Timestamp
        serviceDate = rawDate.toDate();
      } else if (rawDate) {
        serviceDate = new Date(rawDate);
      }
    } catch {
      serviceDate = null;
    }
    if (!serviceDate || isNaN(serviceDate.getTime())) {
      console.warn('Skipping service with invalid date', service);
      return null;
    }
    return {
      id: service.id,
      day: serviceDate.getDate().toString(),
      month: serviceDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      title: service.title,
      description: service.description,
      vehicle: service.vehicle,
      time: serviceDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: service.status,
      statusText: this.getStatusText(service.status),
      serviceDate: serviceDate,
      price: service.price,
      technician: service.technician || undefined
    };
  }

  // Get status text
  private getStatusText(status: string): string {
    switch (status) {
      case 'scheduled': return 'Scheduled';
      case 'pending': return 'Pending';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  }

  // Format date for display
  private formatDate(date: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  }

  // Get current user services observable
  getCurrentUserServices(): Observable<ServiceBooking[]> {
    return this.services$;
  }

  // Get current user upcoming services observable
  getCurrentUserUpcomingServices(): Observable<UpcomingService[]> {
    return this.upcomingServices$;
  }
}