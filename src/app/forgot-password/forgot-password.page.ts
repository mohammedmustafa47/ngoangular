import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false,
})
export class ForgotPasswordPage implements OnInit {
  step: 1 | 2 = 1;
  email = '';
  otp = '';
  submitting = false;

  constructor(private router: Router, private serviceapi: Auth) { }

  ngOnInit() {
  }

  onRequestCode() {
    if (!this.email) {
      alert('Please enter your email address');
      return;
    }

    this.submitting = true;
    this.serviceapi.requestPasswordReset(this.email).subscribe({
      next: () => {
        this.submitting = false;
        this.step = 2;
      },
      error: (err) => {
        this.submitting = false;
        alert(err.error?.detail || err.error?.email?.[0] || 'Could not send reset code. Please try again.');
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
}
