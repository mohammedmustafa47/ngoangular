import { Component, OnInit } from '@angular/core';
import { Auth } from '../services/auth.service';

@Component({
  selector: 'app-super-admin-create-admin',
  templateUrl: './super-admin-create-admin.page.html',
  styleUrls: ['./super-admin-create-admin.page.scss'],
  standalone: false,
})
export class SuperAdminCreateAdminPage implements OnInit {

  areas: any[] = [];
  loading = true;
  creating = false;

  username = '';
  email = '';
  password = '';
  areaId: number | null = null;

  // Set once creation succeeds — shown back to the Super Admin to hand off out-of-band (no invite-link flow yet).
  created: { username: string; email: string; password: string; area: string } | null = null;

  constructor(private serviceapi: Auth) { }

  ngOnInit() {
    this.loadAreas();
  }

  loadAreas() {
    this.loading = true;
    this.serviceapi.getAreas().subscribe({
      next: (data: any) => {
        this.areas = Array.isArray(data) ? data : (data?.results ?? []);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading areas:', err);
        this.loading = false;
      }
    });
  }

  createAdmin() {
    if (!this.username || !this.email || !this.password || !this.areaId) {
      alert('Please fill in all fields and select an area');
      return;
    }

    const passwordForHandoff = this.password;
    const selectedArea = this.areas.find(a => a.id === this.areaId);

    this.creating = true;
    this.serviceapi.createAreaAdmin({
      username: this.username,
      email: this.email,
      password: this.password,
      area_id: this.areaId
    }).subscribe({
      next: (user: any) => {
        this.created = {
          username: user.username,
          email: user.email,
          password: passwordForHandoff,
          area: user.area || selectedArea?.name || ''
        };
        this.resetForm();
        this.creating = false;
      },
      error: (err) => {
        console.error('Error creating area admin:', err);
        alert(err?.error?.area_id?.[0] || err?.error?.username?.[0] || err?.error?.email?.[0] || err?.error?.detail || 'Failed to create Area Admin — that area may already have one.');
        this.creating = false;
      }
    });
  }

  createAnother() {
    this.created = null;
  }

  private resetForm() {
    this.username = '';
    this.email = '';
    this.password = '';
    this.areaId = null;
  }
}
