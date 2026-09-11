import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: false,
})
export class ResetPasswordPage implements OnInit {
  email = '';
  otp = '';
  newPassword = '';
  confirmPassword = '';
  showPassword = false;
  submitting = false;

  constructor(private route: ActivatedRoute, private router: Router, private serviceapi: Auth) { }

  ngOnInit() {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
    this.otp = this.route.snapshot.queryParamMap.get('otp') || '';
  }

  onReset() {
    if (!this.email || !this.otp) {
      alert('Missing email or verification code — please restart the forgot password flow.');
      this.router.navigate(['/forgot-password']);
      return;
    }

    if (!this.newPassword || !this.confirmPassword) {
      alert('Please fill in both password fields');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    this.submitting = true;
    this.serviceapi.confirmPasswordReset(this.email, this.otp, this.newPassword, this.confirmPassword).subscribe({
      next: () => {
        this.submitting = false;
        alert('Password has been reset successfully. Please log in.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.submitting = false;
        const fieldError = err.error?.new_password?.[0] || err.error?.confirm_password?.[0] || err.error?.detail;
        alert(fieldError || 'Could not reset password. Please try again.');
      }
    });
  }
}
