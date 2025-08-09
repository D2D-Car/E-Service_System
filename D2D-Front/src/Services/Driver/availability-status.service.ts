import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { Firestore, doc, updateDoc, getDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AvailabilityStatusService {
  private availabilityStatusSubject = new BehaviorSubject<string>('Available');
  availabilityStatus$ = this.availabilityStatusSubject.asObservable();
  private authSub?: Subscription;

  constructor(private auth: AuthService, private firestore: Firestore) {
    this.authSub = this.auth.currentUser$.subscribe(async user => {
      if (user) { await this.loadAvailability(user.uid); }
    });
  }

  private async loadAvailability(uid: string) {
    try {
      const snap = await getDoc(doc(this.firestore, 'users', uid));
      if (snap.exists()) {
        const data:any = snap.data();
        if (data.availability) this.availabilityStatusSubject.next(data.availability);
      }
    } catch (err) { console.warn('Failed to load availability', err); }
  }

  async setAvailability(status: string) {
    this.availabilityStatusSubject.next(status);
    const user = this.auth.getCurrentUser();
    if (user) {
      try { await updateDoc(doc(this.firestore, 'users', user.uid), { availability: status }); }
      catch (err) { console.warn('Failed to persist availability', err); }
    }
  }

  getAvailability(): string { return this.availabilityStatusSubject.getValue(); }
}
