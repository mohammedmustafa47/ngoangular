import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone:false,
})
export class RegisterPage implements OnInit {
  Registerobj={
    username:'',
    email:'',
    pincode:'',
    role:'',
    password:'',
  }
  showPassword = false;
  acceptedTerms = false;

  constructor(private route:Router,private serviceapi:Auth, private toastCtrl: ToastController) { }

  ngOnInit() {
  }

    onRegister(){
      // Validate form
      if (!this.acceptedTerms) {
        this.showToast('Please accept the terms and conditions');
        return;
      }

      if (!this.Registerobj.username || !this.Registerobj.email || !this.Registerobj.pincode || !this.Registerobj.role || !this.Registerobj.password) {
        this.showToast('Please fill in all required fields');
        return;
      }

      this.serviceapi.register(this.Registerobj.username, this.Registerobj.password, this.Registerobj.email, this.Registerobj.pincode, this.Registerobj.role)
      .subscribe({
      next: (res: any) => {
        this.showToast('Registration successful! A verification code has been sent to your email.', 'success');
        this.route.navigate(['/verify-otp'], { queryParams: { email: this.Registerobj.email } });
      },
      error: (err) => {
        console.error('Registration error:', err);
        this.showToast(this.extractError(err));
      }
      });
    }

    private extractError(err: any): string {
      const e = err.error;
      if (e?.non_field_errors) return e.non_field_errors[0];
      if (e?.detail) return e.detail;
      if (e?.role) return Array.isArray(e.role) ? e.role[0] : e.role;
      if (e?.pincode) return Array.isArray(e.pincode) ? e.pincode[0] : e.pincode;
      if (e?.email) return Array.isArray(e.email) ? e.email[0] : e.email;
      return 'Registration failed. Please try again.';
    }

    private async showToast(message: string, color: 'danger' | 'success' = 'danger') {
      const toast = await this.toastCtrl.create({ message, duration: color === 'success' ? 2500 : 3000, color, position: 'top' });
      toast.present();
    }

    // Get role icon
    getRoleIcon(): string {
      switch(this.Registerobj.role) {
        case 'donor': return 'heart';
        case 'volunteer': return 'bicycle';
        default: return 'person';
      }
    }

    // Get role color
    getRoleColor(): string {
      switch(this.Registerobj.role) {
        case 'donor': return 'success';
        case 'volunteer': return 'primary';
        default: return 'medium';
      }
    }

    // Get role title
    getRoleTitle(): string {
      switch(this.Registerobj.role) {
        case 'donor': return 'Donor Account';
        case 'volunteer': return 'Volunteer Account';
        default: return '';
      }
    }

    // Get role description
    getRoleDescription(): string {
      switch(this.Registerobj.role) {
        case 'donor': return 'Donate surplus food to help those in need';
        case 'volunteer': return 'Pick up and deliver food donations';
        default: return '';
      }
    }

  }
