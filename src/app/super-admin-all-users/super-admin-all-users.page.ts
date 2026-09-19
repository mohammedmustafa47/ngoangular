import { Component, OnInit } from '@angular/core';
import { Auth } from '../services/auth.service';
import { describeHttpError } from '../shared/http-error/http-error';

interface AreaGroup {
  areaName: string;
  admin: any | null;
  volunteers: any[];
  donors: any[];
}

@Component({
  selector: 'app-super-admin-all-users',
  templateUrl: './super-admin-all-users.page.html',
  styleUrls: ['./super-admin-all-users.page.scss'],
  standalone: false,
})
export class SuperAdminAllUsersPage implements OnInit {

  loading = true;
  error = false;
  errorMessage = '';

  superAdmins: any[] = [];
  areaGroups: AreaGroup[] = [];
  unassignedVolunteers: any[] = [];
  unassignedDonors: any[] = [];

  editingUserId: number | null = null;
  editUsername = '';
  editEmail = '';

  constructor(private serviceapi: Auth) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.error = false;
    this.serviceapi.getList('users').then((users: any[]) => {
      this.groupUsers(users);
      this.loading = false;
    }).catch((err) => {
      console.error('Error loading users:', err);
      this.loading = false;
      this.error = true;
      this.errorMessage = describeHttpError(err, 'load users');
    });
  }

  /** Groups the flat user list into one container per Area (its Admin + Volunteers + Donors),
   *  since the backend enforces exactly one Admin per Area. Users without an area yet
   *  (pending donor/volunteer signups) and Super Admins (who have no area) get their own buckets. */
  private groupUsers(users: any[]) {
    this.superAdmins = [];
    this.unassignedVolunteers = [];
    this.unassignedDonors = [];
    const groupsByArea: { [area: string]: AreaGroup } = {};

    for (const user of users) {
      if (user.role === 'super_admin') {
        this.superAdmins.push(user);
        continue;
      }

      const hasArea = user.area && user.area !== 'pending';
      if (!hasArea) {
        if (user.role === 'volunteer') this.unassignedVolunteers.push(user);
        else if (user.role === 'donor') this.unassignedDonors.push(user);
        continue;
      }

      if (!groupsByArea[user.area]) {
        groupsByArea[user.area] = { areaName: user.area, admin: null, volunteers: [], donors: [] };
      }
      const group = groupsByArea[user.area];
      if (user.role === 'admin') group.admin = user;
      else if (user.role === 'volunteer') group.volunteers.push(user);
      else if (user.role === 'donor') group.donors.push(user);
    }

    this.areaGroups = Object.values(groupsByArea).sort((a, b) => a.areaName.localeCompare(b.areaName));
  }

  startEdit(user: any) {
    this.editingUserId = user.id;
    this.editUsername = user.username;
    this.editEmail = user.email;
  }

  cancelEdit() {
    this.editingUserId = null;
  }

  saveEdit(user: any) {
    if (!this.editUsername || !this.editEmail) {
      alert('Username and email are required');
      return;
    }
    this.serviceapi.saveRecord('users', { id: user.id, username: this.editUsername, email: this.editEmail })
      .then(() => {
        user.username = this.editUsername;
        user.email = this.editEmail;
        this.editingUserId = null;
      })
      .catch((error) => {
        console.error('Error updating user:', error);
        alert(error?.error?.username?.[0] || error?.error?.email?.[0] || error?.error?.detail || 'Failed to update user.');
      });
  }

  deleteUser(user: any) {
    if (!confirm(`Delete user "${user.username}"? This cannot be undone.`)) return;
    this.serviceapi.deleteRecord('users', user.id).then(() => {
      this.removeUser(user.id);
    }).catch((error) => {
      console.error('Error deleting user:', error);
      alert(error?.error?.detail || 'Failed to delete user.');
    });
  }

  private removeUser(id: number) {
    this.superAdmins = this.superAdmins.filter(u => u.id !== id);
    this.unassignedVolunteers = this.unassignedVolunteers.filter(u => u.id !== id);
    this.unassignedDonors = this.unassignedDonors.filter(u => u.id !== id);
    this.areaGroups.forEach(group => {
      if (group.admin?.id === id) group.admin = null;
      group.volunteers = group.volunteers.filter(u => u.id !== id);
      group.donors = group.donors.filter(u => u.id !== id);
    });
  }

  getRoleColor(role: string): string {
    switch (role) {
      case 'admin': return 'danger';
      case 'donor': return 'success';
      case 'volunteer': return 'primary';
      default: return 'medium';
    }
  }
}
