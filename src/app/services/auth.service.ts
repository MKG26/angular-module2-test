import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, from, map, switchMap, tap } from 'rxjs';
import { User } from '../models/user.model';
import { Database, ref, set, get, push, onValue } from '@angular/fire/database';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from '@angular/fire/auth';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private db: Database, private auth: Auth) {
    this.initializeUsers();
    // Check localStorage for existing session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.userSubject.next(JSON.parse(savedUser));
    }

    // Subscribe to Firebase auth state changes
    auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        // For demo purposes, assign roles based on email
        const role = firebaseUser.email?.includes('librarian')
          ? 'Librarian'
          : 'Member';
        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.email?.split('@')[0] || '',
          role,
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.userSubject.next(user);
      } else {
        localStorage.removeItem('currentUser');
        this.userSubject.next(null);
      }
    });
  }

  private async initializeUsers() {
    // Check if users exist in Firebase, if not add sample users
    const usersRef = ref(this.db, 'users');
    const snapshot = await get(usersRef);

    if (!snapshot.exists()) {
      const sampleUsers: User[] = [
        {
          id: '1',
          email: 'librarian@library.com',
          name: 'Main Librarian',
          role: 'Librarian',
        },
        {
          id: '2',
          email: 'member@library.com',
          name: 'John Member',
          role: 'Member',
        },
      ];

      sampleUsers.forEach((user) => {
        const newUserRef = push(ref(this.db, 'users'));
        set(newUserRef, { ...user, id: newUserRef.key });
      });
    }
  }

  signUp(email: string, password: string): Observable<User | null> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      map((userCredential) => {
        const role = userCredential.user.email?.includes('librarian')
          ? 'Librarian'
          : 'Member';
        const user: User = {
          id: userCredential.user.uid,
          email: userCredential.user.email || '',
          name: email.split('@')[0],
          role,
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      })
    );
  }

  login(email: string, password: string): Observable<User | null> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map((userCredential) => {
        const role = userCredential.user.email?.includes('librarian')
          ? 'Librarian'
          : 'Member';
        const user: User = {
          id: userCredential.user.uid,
          email: userCredential.user.email || '',
          name: email.split('@')[0],
          role,
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      })
    );
  }

  logout(): void {
    signOut(this.auth);
    localStorage.removeItem('currentUser');
    this.userSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  isLibrarian(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'Librarian';
  }

  isMember(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'Member';
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}
