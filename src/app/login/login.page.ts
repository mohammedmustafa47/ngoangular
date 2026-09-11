import { Component, OnInit } from '@angular/core';
import { Auth } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone:false,
})
export class LoginPage implements OnInit {
  loginobj = {
    email: '',
    password: ''
  };
  showPassword = false;
  rememberMe = false;

  constructor(private route: Router, private serviceapi: Auth, private toastCtrl: ToastController) { }

  ngOnInit() {
  }

  onLogin() {
    this.serviceapi.login(this.loginobj.email, this.loginobj.password).subscribe({
      next: (res: any) => {
        if (res.access) {
          const role = res.user.role;
          if (role === 'super_admin') this.route.navigate(['/super-admin-dashboard']);
          else if (role === 'admin') this.route.navigate(['/tab-admin']);
          else if (role === 'donor') this.route.navigate(['/tab-donor']);
          else if (role === 'volunteer') this.route.navigate(['/tab-volunteer']);
          else this.route.navigate(['/home']);
        } else {
          this.showToast(res.detail || 'Unexpected response. Please try again.');
        }
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.showToast(this.extractError(err));
      }
    });
  }

  private extractError(err: any): string {
    if (err.status === 403) {
      return err.error?.detail || 'Email not verified. Please check your inbox for the verification code.';
    }
    if (err.status === 401) {
      return 'Invalid email or password.';
    }
    return err.error?.detail || 'Login failed. Please try again.';
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 3000, color: 'danger', position: 'top' });
    toast.present();
  }

}
