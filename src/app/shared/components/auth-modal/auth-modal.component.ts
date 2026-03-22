import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css']
})
export class AuthModalComponent implements OnInit, OnDestroy {
  isOpen = false;
  activeTab: 'signin' | 'register' = 'signin';
  
  loginEmail = '';
  loginPassword = '';
  
  registerName = '';
  registerEmail = '';
  registerPassword = '';
  registerConfirmPassword = '';
  
  isLoading = false;
  private subscription?: Subscription;

  constructor(
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.subscription = this.authService.authModalOpen$.subscribe(isOpen => {
      this.isOpen = isOpen;
      if (isOpen) {
        this.resetForms();
        this.activeTab = 'signin';
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  closeModal(): void {
    this.authService.closeAuthModal();
  }

  switchTab(tab: 'signin' | 'register'): void {
    this.activeTab = tab;
    this.resetForms();
  }

  resetForms(): void {
    this.loginEmail = '';
    this.loginPassword = '';
    this.registerName = '';
    this.registerEmail = '';
    this.registerPassword = '';
    this.registerConfirmPassword = '';
  }

  onSignIn(): void {
    if (!this.loginEmail || !this.loginPassword) {
      this.toastService.warning('Please fill in all fields');
      return;
    }

    this.isLoading = true;
    
    this.authService.login({
      email: this.loginEmail,
      password: this.loginPassword
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.toastService.success('Login successful!');
          this.closeModal();
        } else {
          this.toastService.error(response.message || 'Login failed');
        }
      },
      error: (error) => {
        this.isLoading = false;
        const errorMsg = error.error?.message || 'Login failed';
        this.toastService.error(errorMsg);
      }
    });
  }

  onRegister(): void {
    if (!this.registerName || !this.registerEmail || !this.registerPassword || !this.registerConfirmPassword) {
      this.toastService.warning('Please fill in all fields');
      return;
    }

    if (this.registerPassword !== this.registerConfirmPassword) {
      this.toastService.error('Passwords do not match');
      return;
    }

    if (this.registerPassword.length < 6) {
      this.toastService.warning('Password must be at least 6 characters');
      return;
    }

    this.isLoading = true;
    
    this.authService.register({
      username: this.registerName,
      email: this.registerEmail,
      password: this.registerPassword
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.toastService.success('Account created successfully! Please sign in.');
          this.switchTab('signin');
          this.loginEmail = this.registerEmail;
        } else {
          this.toastService.error(response.message || 'Registration failed');
        }
      },
      error: (error) => {
        this.isLoading = false;
        const errorMsg = error.error?.message || 'Registration failed';
        this.toastService.error(errorMsg);
      }
    });
  }

  onGoogleSignIn(): void {
    this.isLoading = true;

    this.authService.signInWithGoogle().subscribe({
      next: (credential) => {
        this.authService.googleLogin(credential).subscribe({
          next: (response) => {
            this.isLoading = false;
            if (response.success) {
              this.toastService.success('Google login successful!');
              this.closeModal();
            } else {
              this.toastService.error(response.message || 'Google login failed');
            }
          },
          error: (error) => {
            this.isLoading = false;
            const errorMsg = error.error?.message || 'Google login failed';
            this.toastService.error(errorMsg);
          }
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.toastService.warning('Please allow popups and try again');
      }
    });
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}