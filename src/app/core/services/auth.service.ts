import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../models/tool.model';

declare const google: any;

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private authModalSubject = new BehaviorSubject<boolean>(false);
  public authModalOpen$ = this.authModalSubject.asObservable();

  private isGoogleReady = false;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadUserFromStorage();
    this.initializeGoogleSignIn();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      const user = JSON.parse(userStr);
      this.currentUserSubject.next(user);
    }
  }

  private initializeGoogleSignIn(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const checkInterval = setInterval(() => {
      if (typeof google !== 'undefined' && google.accounts) {
        this.isGoogleReady = true;
        clearInterval(checkInterval);
      }
    }, 100);

    setTimeout(() => clearInterval(checkInterval), 5000);
  }

  openAuthModal(): void {
    this.authModalSubject.next(true);
  }

  closeAuthModal(): void {
    this.authModalSubject.next(false);
  }

  register(data: RegisterRequest): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/User/CreateOrUpdateUser`, data);
  }

  login(data: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/User/login`, data).pipe(
      tap(response => {
        if (response.success && response.data) {
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          this.currentUserSubject.next(response.data.user);
        }
      })
    );
  }

  signInWithGoogle(): Observable<string> {
  return new Observable(observer => {
    if (!isPlatformBrowser(this.platformId)) {
      observer.error('Google Sign-In only available in browser');
      return;
    }

    if (!this.isGoogleReady) {
      observer.error('Google Sign-In not ready');
      return;
    }

    try {
      // Use google.accounts.id to get ID token (secure!)
      google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (response: any) => {
          if (response.credential) {
            // This is the ID TOKEN signed by Google
            observer.next(response.credential);
            observer.complete();
          } else {
            observer.error('No credential received from Google');
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true
      });

      // Show Google One Tap or popup
      google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback: render button and auto-click
          this.renderGoogleButton(observer);
        }
      });

    } catch (error) {
      observer.error(error);
    }
  });
}

// Helper method to render button if prompt fails
private renderGoogleButton(observer: any): void {
  const container = document.createElement('div');
  container.id = 'google-btn-container';
  container.style.position = 'fixed';
  container.style.top = '-9999px';
  document.body.appendChild(container);

  google.accounts.id.renderButton(container, {
    theme: 'outline',
    size: 'large'
  });

  // Auto-click the button
  setTimeout(() => {
    const btn = container.querySelector('div[role="button"]') as HTMLElement;
    if (btn) {
      btn.click();
    }
    setTimeout(() => container.remove(), 1000);
  }, 100);
}

  googleLogin(idToken: string): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/User/google-login`, { idToken }).pipe(
      tap(response => {
        if (response.success && response.data) {
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          this.currentUserSubject.next(response.data.user);
        }
      })
    );
  }

  refreshAccessToken(refreshToken: string): Observable<ApiResponse<{ accessToken: string }>> {
    return this.http.post<ApiResponse<{ accessToken: string }>>(
      `${this.apiUrl}/User/refresh-token`, 
      { refreshToken }
    );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}