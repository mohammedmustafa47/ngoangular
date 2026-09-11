import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../services/auth.service';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.page.html',
  styleUrls: ['./verify-otp.page.scss'],
  standalone: false,
})
export class VerifyOtpPage implements OnInit {
  email = '';
  otp = '';
  submitting = false;
  resending = false;

  constructor(private route: ActivatedRoute, private router: Router, private serviceapi: Auth) { }

  ngOnInit() {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
  }

  onVerify() {
    if (!this.email || !this.otp) {
      alert('Please enter the verification code');
      return;
    }

    this.submitting = true;
    this.serviceapi.verifyEmail(this.email, this.otp).subscribe({
      next: () => {
        this.submitting = false;
        alert('Email verified successfully. You can now log in.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.submitting = false;
        alert(err.error?.detail || 'Invalid or expired code. Please try again.');
      }
    });
  }

  onResend() {
    if (!this.email) {
      alert('Missing email address');
      return;
    }

    this.resending = true;
    this.serviceapi.resendOtp(this.email).subscribe({
      next: () => {
        this.resending = false;
        alert('A new verification code has been sent to your email.');
      },
      error: (err) => {
        this.resending = false;
        alert(err.error?.detail || 'Could not resend code. Please wait a moment and try again.');
      }
    });
  }
}
