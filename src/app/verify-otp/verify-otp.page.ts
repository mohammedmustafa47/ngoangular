import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../services/auth.service';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.page.html',
  styleUrls: ['./verify-otp.page.scss'],
  standalone: false,
})
export class VerifyOtpPage implements OnInit, OnDestroy {
  email = '';
  otp = '';
  submitting = false;
  resending = false;
  cooldown = 0;

  private cooldownTimer: any;

  constructor(private route: ActivatedRoute, private router: Router, private serviceapi: Auth) { }

  ngOnInit() {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
  }

  ngOnDestroy() {
    clearInterval(this.cooldownTimer);
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
    if (!this.email || this.cooldown > 0) {
      return;
    }

    this.resending = true;
    this.serviceapi.resendOtp(this.email).subscribe({
      next: () => {
        this.resending = false;
        alert('A new verification code has been sent to your email.');
        this.startCooldown(30);
      },
      error: (err) => {
        this.resending = false;
        if (err.status === 429) {
          alert('Too many requests. Please wait a bit before requesting another code.');
          this.startCooldown(30);
        } else {
          alert(err.error?.detail || 'Could not resend code. Please try again.');
        }
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
