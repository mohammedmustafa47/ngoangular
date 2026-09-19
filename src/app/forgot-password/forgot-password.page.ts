import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false,
})
export class ForgotPasswordPage implements OnInit, OnDestroy {
  step: 1 | 2 = 1;
  email = '';
  otp = '';
  submitting = false;
  cooldown = 0;

  private cooldownTimer: any;

  constructor(private router: Router, private serviceapi: Auth) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    clearInterval(this.cooldownTimer);
  }

  onRequestCode() {
    if (!this.email || this.cooldown > 0) {
      if (!this.email) alert('Please enter your email address');
      return;
    }

    this.submitting = true;
    this.serviceapi.requestPasswordReset(this.email).subscribe({
      next: () => {
        this.submitting = false;
        this.startCooldown(30);
        this.step = 2;
      },
      error: (err) => {
        this.submitting = false;
        if (err.status === 429) {
          alert('Too many requests. Please wait a bit before requesting another code.');
          this.startCooldown(30);
        } else {
          alert(err.error?.detail || err.error?.email?.[0] || 'Could not send reset code. Please try again.');
        }
      }
    });
  }

  onVerifyOtp() {
    if (!this.otp) {
      alert('Please enter the code sent to your email');
      return;
    }

    this.submitting = true;
    this.serviceapi.verifyPasswordResetOtp(this.email, this.otp).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/reset-password'], { queryParams: { email: this.email, otp: this.otp } });
      },
      error: (err) => {
        this.submitting = false;
        alert(err.error?.detail || 'Invalid or expired code. Please try again.');
      }
    });
  }

  private startCooldown(seconds: number) {
    clearInterval(this.cooldownTimer);
    this.cooldown = seconds;
    this.cooldownTimer = setInterval(() => {
      this.cooldown--;
      if (this.cooldown <= 0) {
        clearInterval(this.cooldownTimer);
      }
    }, 1000);
  }
}
