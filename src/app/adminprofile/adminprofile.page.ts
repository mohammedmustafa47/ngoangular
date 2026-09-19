import { Component, OnInit } from '@angular/core';
import { Auth } from '../services/auth.service';

@Component({
  selector: 'app-adminprofile',
  templateUrl: './adminprofile.page.html',
  styleUrls: ['./adminprofile.page.scss'],
  standalone: false,
})
export class AdminprofilePage implements OnInit {

  loading = true;
  error = false;
  profile: any = null;

  constructor(private service: Auth) { }

  ngOnInit() {
    this.service.getProfile().subscribe({
      next: (data: any) => {
        this.profile = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load profile:', err);
        this.loading = false;
        this.error = true;
      }
    });
  }

  get roleLabel(): string {
    if (!this.profile) return '';
    return this.profile.role === 'super_admin' ? 'Super Admin' : 'Area Admin';
  }

  get backHref(): string {
    return this.profile?.role === 'super_admin' ? '/super-admin-dashboard' : '/tab-admin';
  }

  logout() {
    this.service.logout();
  }

}
