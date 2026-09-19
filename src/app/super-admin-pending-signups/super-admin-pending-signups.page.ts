import { Component, OnInit } from '@angular/core';
import { Auth } from '../services/auth.service';

@Component({
  selector: 'app-super-admin-pending-signups',
  templateUrl: './super-admin-pending-signups.page.html',
  styleUrls: ['./super-admin-pending-signups.page.scss'],
  standalone: false,
})
export class SuperAdminPendingSignupsPage implements OnInit {

  pendingUsers: any[] = [];
  areas: any[] = [];
  loading = true;
  selectedAreaId: { [userId: number]: number } = {};
  assigning: { [userId: number]: boolean } = {};

  constructor(private serviceapi: Auth) { }

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.loading = true;
    this.serviceapi.getPendingAreaUsers().subscribe({
      next: (data: any) => {
        this.pendingUsers = Array.isArray(data) ? data : (data?.results ?? []);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading pending signups:', err);
        this.loading = false;
      }
    });

    this.serviceapi.getAreas().subscribe({
      next: (data: any) => {
        this.areas = Array.isArray(data) ? data : (data?.results ?? []);
      },
      error: (err) => console.error('Error loading areas:', err)
    });
  }

  assign(user: any) {
    const areaId = this.selectedAreaId[user.id];
    if (!areaId) {
      alert('Please select an area first');
      return;
    }
    this.assigning[user.id] = true;
    this.serviceapi.assignArea(user.id, areaId).subscribe({
      next: () => {
        this.pendingUsers = this.pendingUsers.filter(u => u.id !== user.id);
        this.assigning[user.id] = false;
      },
      error: (err) => {
        console.error('Error assigning area:', err);
        alert(err?.error?.detail || 'Failed to assign area — that area may already have an Area Admin.');
        this.assigning[user.id] = false;
      }
    });
  }
}
