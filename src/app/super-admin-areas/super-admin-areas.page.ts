import { Component, OnInit } from '@angular/core';
import { Auth } from '../services/auth.service';

@Component({
  selector: 'app-super-admin-areas',
  templateUrl: './super-admin-areas.page.html',
  styleUrls: ['./super-admin-areas.page.scss'],
  standalone: false,
})
export class SuperAdminAreasPage implements OnInit {

  areas: any[] = [];
  loading = true;

  // Create form state
  newAreaName = '';
  newAreaPincodes = '';
  creating = false;

  // Edit form state
  editingAreaId: number | null = null;
  editName = '';
  editPincodes = '';
  editIsActive = true;

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

  createArea() {
    if (!this.newAreaName || !this.newAreaPincodes) {
      alert('Please enter a name and at least one pincode');
      return;
    }
    const pincodes = this.newAreaPincodes.split(',').map(p => p.trim()).filter(p => p.length > 0);
    this.creating = true;
    this.serviceapi.createArea({ name: this.newAreaName, pincodes }).subscribe({
      next: (area: any) => {
        this.areas.push(area);
        this.newAreaName = '';
        this.newAreaPincodes = '';
        this.creating = false;
      },
      error: (err) => {
        console.error('Error creating area:', err);
        alert(err?.error?.name?.[0] || err?.error?.pincodes?.[0] || err?.error?.detail || 'Failed to create area.');
        this.creating = false;
      }
    });
  }

  startEdit(area: any) {
    this.editingAreaId = area.id;
    this.editName = area.name;
    this.editPincodes = (area.pincodes || []).join(', ');
    this.editIsActive = area.is_active;
  }

  cancelEdit() {
    this.editingAreaId = null;
  }

  saveEdit(area: any) {
    const pincodes = this.editPincodes.split(',').map(p => p.trim()).filter(p => p.length > 0);
    this.serviceapi.updateArea(area.id, { name: this.editName, pincodes, is_active: this.editIsActive }).subscribe({
      next: (updated: any) => {
        Object.assign(area, updated);
        this.editingAreaId = null;
      },
      error: (err) => {
        console.error('Error updating area:', err);
        alert(err?.error?.name?.[0] || err?.error?.pincodes?.[0] || err?.error?.detail || 'Failed to update area.');
      }
    });
  }

  deleteArea(area: any) {
    if (!confirm(`Delete area "${area.name}"? This cannot be undone.`)) return;
    this.serviceapi.deleteArea(area.id).subscribe({
      next: () => {
        this.areas = this.areas.filter(a => a.id !== area.id);
      },
      error: (err) => {
        console.error('Error deleting area:', err);
        alert(err?.error?.detail || 'Failed to delete area.');
      }
    });
  }
}
