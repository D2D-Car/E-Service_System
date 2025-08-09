import { Injectable } from '@angular/core';
import { Firestore, doc, runTransaction, collection, getDocs } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class OrderIdService {
  private initialized = false;
  private counterDocRef: any;

  constructor(private firestore: Firestore) {
    this.counterDocRef = doc(this.firestore, 'counters', 'orders');
  }

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;
    try {
      // Detect existing highest order number if counter doc is missing
      await runTransaction(this.firestore, async (tx) => {
        const snap = await tx.get(this.counterDocRef as any);
        if (!snap.exists()) {
          // Scan existing orders to find current max
            const ordersCol = collection(this.firestore, 'adminOrders');
            const existing = await getDocs(ordersCol);
            let maxNum = 0;
            existing.forEach(d => {
              const data: any = d.data();
              const id: string | undefined = data?.orderId;
              if (id) {
                const match = id.match(/#SRV(\d+)/i);
                if (match) {
                  const num = parseInt(match[1], 10);
                  if (!isNaN(num) && num > maxNum) maxNum = num;
                }
              }
            });
            // Initialize counter with max found
            tx.set(this.counterDocRef as any, { lastOrderNumber: maxNum });
        }
      });
      this.initialized = true;
    } catch (e) {
      console.warn('OrderIdService initialization failed (will still attempt increments):', e);
    }
  }

  async getNextOrderId(): Promise<string> {
    await this.ensureInitialized();
    const nextNumber = await runTransaction(this.firestore, async (tx) => {
      const snap = await tx.get(this.counterDocRef as any);
      let last = 0;
      if (snap.exists()) {
        const data: any = snap.data();
        last = data?.lastOrderNumber || 0;
      }
      const next = last + 1;
      tx.set(this.counterDocRef as any, { lastOrderNumber: next }, { merge: true });
      return next;
    });
    const padded = nextNumber.toString().padStart(3, '0');
    return `#SRV${padded}`;
  }
}
