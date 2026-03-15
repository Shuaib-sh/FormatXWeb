import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css']
})
export class AuthModalComponent implements OnInit, OnDestroy {
  isOpen = false;
  activeTab: 'signin' | 'register' = 'signin';
  
  // Sign In Form
  loginEmail = '';
  loginPassword = '';
  
  // Register Form
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
        // Reset form when modal opens
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
    // Validation
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
        const errorMsg = error.error?.message || 'Login failed. Please try again.';
        this.toastService.error(errorMsg);
      }
    });
  }

  onRegister(): void {
    // Validation
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
        const errorMsg = error.error?.message || 'Registration failed. Please try again.';
        this.toastService.error(errorMsg);
      }
    });
  }

  onGoogleSignIn(): void {
    // Placeholder for Google OAuth
    this.toastService.info('Google Sign In coming soon!');
  }

  // Close modal when clicking outside
  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}