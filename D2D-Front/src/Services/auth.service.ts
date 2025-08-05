import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, sendEmailVerification, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, updateProfile } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { Router } from '@angular/router';
import { map, switchMap, catchError } from 'rxjs/operators';

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin' | 'technician';
  createdAt: Date;
  lastLoginAt: Date;
  emailVerified: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private userDataSubject = new BehaviorSubject<UserData | null>(null);
  public userData$ = this.userDataSubject.asObservable();

  constructor() {
    // Listen to auth state changes
    this.auth.onAuthStateChanged(async (user) => {
      this.currentUserSubject.next(user);
      if (user) {
        await this.loadUserData(user.uid);
      } else {
        this.userDataSubject.next(null);
      }
    });
  }

  // Sign up with email and password
  async signUp(email: string, password: string, displayName: string): Promise<void> {
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);
      
      // Update profile with display name
      await updateProfile(credential.user, { displayName });
      
      // Send email verification
      await sendEmailVerification(credential.user);
      
      // Create user document in Firestore
      const userData: UserData = {
        uid: credential.user.uid,
        email: credential.user.email!,
        displayName,
        role: 'user',
        createdAt: new Date(),
        lastLoginAt: new Date(),
        emailVerified: false
      };
      
      await setDoc(doc(this.firestore, 'users', credential.user.uid), userData);
      this.userDataSubject.next(userData);
      
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<void> {
    try {
      const credential = await signInWithEmailAndPassword(this.auth, email, password);
      
      // Update last login time
      await this.updateLastLogin(credential.user.uid);
      
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Sign in with Google
  async signInWithGoogle(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(this.auth, provider);
      
      // Check if user exists in Firestore, if not create profile
      await this.createUserProfileIfNotExists(credential.user);
      
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Sign in with Facebook
  async signInWithFacebook(): Promise<void> {
    try {
      const provider = new FacebookAuthProvider();
      const credential = await signInWithPopup(this.auth, provider);
      
      // Check if user exists in Firestore, if not create profile
      await this.createUserProfileIfNotExists(credential.user);
      
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Send email verification
  async sendEmailVerification(): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      await sendEmailVerification(user);
    }
  }

  // Check email verification status
  async checkEmailVerification(): Promise<boolean> {
    const user = this.auth.currentUser;
    if (user) {
      await user.reload();
      const isVerified = user.emailVerified;
      
      // Update user data in Firestore
      if (isVerified) {
        await updateDoc(doc(this.firestore, 'users', user.uid), {
          emailVerified: true
        });
        
        // Update local user data
        const currentData = this.userDataSubject.value;
        if (currentData) {
          this.userDataSubject.next({
            ...currentData,
            emailVerified: true
          });
        }
      }
      
      return isVerified;
    }
    return false;
  }

  // Sign out
  async signOut(): Promise<void> {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Get user data
  getUserData(): UserData | null {
    return this.userDataSubject.value;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  // Check if email is verified
  isEmailVerified(): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.emailVerified : false;
  }

  // Private helper methods
  private async loadUserData(uid: string): Promise<void> {
    try {
      const userDoc = await getDoc(doc(this.firestore, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data() as UserData;
        this.userDataSubject.next(data);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  private async updateLastLogin(uid: string): Promise<void> {
    try {
      await updateDoc(doc(this.firestore, 'users', uid), {
        lastLoginAt: new Date()
      });
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  private async createUserProfileIfNotExists(user: User): Promise<void> {
    const userDoc = await getDoc(doc(this.firestore, 'users', user.uid));
    
    if (!userDoc.exists()) {
      const userData: UserData = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || 'User',
        role: 'user',
        createdAt: new Date(),
        lastLoginAt: new Date(),
        emailVerified: user.emailVerified
      };
      
      await setDoc(doc(this.firestore, 'users', user.uid), userData);
      this.userDataSubject.next(userData);
    } else {
      await this.updateLastLogin(user.uid);
    }
  }

  private handleAuthError(error: any): string {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
}