//ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TechnicianEarningsComponent } from "../earnings/earnings.component";
import { JobsComponent } from "../jobs/jobs.component";
import { TechnicianProfileComponent } from "../profile/technician-profile.component";
import { UserDataService, UserProfile } from '../../../Services/user-data.service';
import { AuthService } from '../../../Services/auth.service';
import { OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Firestore, collection, query, where, onSnapshot, orderBy, limit } from '@angular/fire/firestore';

@Component({
  selector: 'app-technicians-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, TechnicianEarningsComponent, JobsComponent, TechnicianProfileComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class TechniciansDashboardComponent implements OnInit {
  profile: any = {
    name: 'Loading...',
    rating: 0,
    totalJobs: 0,
    earningsToday: 0,
    earningsWeek: 0,
    earningsMonth: 0
  };

  activeTab = 'Dashboard';
  availability = 'Available';
  
  // Modal states
  showReportsModal = false;
  showMessagesModal = false;
  
  // Unread messages count
  unreadMessages = 3;

  jobsToday: any[] = []; // now dynamic
  private jobsUnsub?: () => void;

  // Static messages data
  messages = [
    {
      id: 1,
      sender: 'Ahmed Tamer',
      avatar: '/assets/customers-img/cust1.jpg',
      preview: 'Thank you for the excellent oil change service! My car runs perfectly now. Would definitely recommend.',
      time: '2 hours ago',
    
      type: 'feedback',
      typeLabel: 'Feedback',
      isOnline: true
    },
    {
      id: 2,
      sender: 'Khaled Waleed',
      avatar: '/assets/customers-img/cust2.jpg',
      preview: 'Hi! I need to reschedule my brake inspection appointment from 2 PM to 4 PM today. Is that possible?',
      time: '4 hours ago',
      unread: true,
      type: 'booking',
      typeLabel: 'Booking',
      isOnline: false
    },
    {
      id: 3,
      sender: 'Ashraf Hassan',
      avatar: '/assets/customers-img/cust3.jpg',
      preview: 'Hello, I have a question about the tire replacement service. What brand of tires do you recommend?',
      time: '6 hours ago',
      unread: true,
      type: 'inquiry',
      typeLabel: 'Inquiry',
      isOnline: true
    },
    {
      id: 4,
      sender: 'Mahmoud Elsayed',
      avatar: '/assets/customers-img/cust4.jpg',
      preview: 'The engine diagnostic was very thorough. Thank you for explaining everything so clearly. Five stars!',
      time: '1 day ago',
      unread: false,
      type: 'feedback',
      typeLabel: 'Feedback',
      isOnline: false
    },
    {
      id: 5,
      sender: 'Shawqi Shokry',
      avatar: '/assets/customers-img/cust5.jpg',
      preview: 'I had an small issue with the service yesterday. The technician arrived 30 minutes late without notice',
      time: '2 days ago',
      unread: false,
      type: 'complaint',
      typeLabel: 'Complaint',
      isOnline: false
    },
    {
      id: 6,
      sender: 'Aser Ayman',
      avatar: '/assets/customers-img/cust6.jpg',
      preview: 'Can you provide a quote for transmission fluid change and filter replacement for my Honda Civic?',
      time: '3 days ago',
      unread: false,
      type: 'inquiry',
      typeLabel: 'Inquiry',
      isOnline: true
    }
  ];

  constructor(
    private userDataService: UserDataService,
    private authService: AuthService,
    private firestore: Firestore
  ) {}

  async ngOnInit() {
    await this.loadUserProfile();
    this.subscribeJobs();
  }

  private subscribeJobs() {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    const ref = collection(this.firestore, 'adminOrders');
    const q = query(ref, where('assignedTechnicianIds', 'array-contains', user.uid), orderBy('createdAt', 'desc'), limit(20));
    this.jobsUnsub = onSnapshot(q, snap => {
      const list: any[] = [];
      snap.forEach(d => {
        const data: any = d.data();
        list.push({
          id: d.id,
          title: data.serviceType,
          status: data.fulfillment === 'Fulfilled' ? 'Completed' : (data.status || 'Pending'),
            time: data.date || '',
            customer: data.customer,
            distance: data.distance || '-',
            price: data.amount
        });
      });
      this.jobsToday = list;
    });
  }

  private async loadUserProfile() {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        const userProfile = await this.userDataService.getUserProfile(currentUser.uid);
        if (userProfile) {
          this.profile = {
            name: userProfile.displayName || 'Technician',
            rating: userProfile.rating || 4.8,
            totalJobs: userProfile.completedJobs || 127,
            earningsToday: 245, // These would come from a separate earnings service
            earningsWeek: 1680,
            earningsMonth: 6420
          };
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Set default values if loading fails
      this.profile = {
        name: 'Ahmed Hassan',
        rating: 4.8,
        totalJobs: 127,
        earningsToday: 245,
        earningsWeek: 1680,
        earningsMonth: 6420
      };
    }
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // Modal methods
  openReportsModal() {
    this.showReportsModal = true;
    document.body.style.overflow = 'hidden'; 
  }

  closeReportsModal() {
    this.showReportsModal = false;
    document.body.style.overflow = 'auto'; 
  }

  openMessagesModal() {
    this.showMessagesModal = true;
    document.body.style.overflow = 'hidden'; 
  }

  closeMessagesModal() {
    this.showMessagesModal = false;
    document.body.style.overflow = 'auto'; 
  }

  // Message actions
  replyToMessage(messageId: number) {
  const message = this.messages.find(m => m.id === messageId);
  if (message) {
Swal.fire({
  icon: 'success',
  title: 'Reply Sent',
  text: `Your reply has been sent to ${message.sender}.`,
  confirmButtonText: 'OK',
  confirmButtonColor: '#ff3b3b'
});
   
  }
}

  markAsRead(messageId: number) {
    const message = this.messages.find(m => m.id === messageId);
    if (message && message.unread) {
      message.unread = false;
      this.unreadMessages = Math.max(0, this.unreadMessages - 1);
    }
  }

  



markAllAsRead() {
  this.messages.forEach(message => {
    if (message.unread) {
      message.unread = false;
    }
  });
  this.unreadMessages = 0;
Swal.fire({
  icon: 'success',
  title: 'Messages Updated',
  text: 'All messages have been marked as read.',
  confirmButtonText: 'OK',
  confirmButtonColor: '#ff3b3b'
});
}

  
  onModalOverlayClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeReportsModal();
      this.closeMessagesModal();
    }
  }

  
}