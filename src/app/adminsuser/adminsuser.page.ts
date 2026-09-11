import { Component, OnInit } from '@angular/core';
import { Auth } from '../services/auth.service';

@Component({
  selector: 'app-adminsuser',
  templateUrl: './adminsuser.page.html',
  styleUrls: ['./adminsuser.page.scss'],
  standalone:false,
})
export class AdminsuserPage implements OnInit {
  TotalUsers:any;
  editingUserId: number | null = null;
  editUsername = '';
  editEmail = '';

  constructor(private serviceapi:Auth) { }

  ngOnInit() {
    this.GetUsers();
  }

  GetUsers(){
    this.serviceapi.getList('users').then((data)=>{
      this.TotalUsers=data;
      console.log(this.TotalUsers);
    })
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
    // Only username/email are writable via this endpoint — role/area are read-only per ui.md §6
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

  deleteUser(id: number) {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    this.serviceapi.deleteRecord('users', id).then(() => {
      this.TotalUsers = this.TotalUsers.filter((user: any) => user.id !== id);
    }).catch((error) => {
      console.error('Error deleting user:', error);
      alert(error?.error?.detail || 'Failed to delete user.');
    });
  }

  // Get role badge color
  getRoleColor(role: string): string {
    switch(role?.toLowerCase()) {
      case 'admin':
        return 'danger';
      case 'donor':
        return 'success';
      case 'volunteer':
        return 'primary';
      default:
        return 'medium';
    }
  }

  // Get role icon
  getRoleIcon(role: string): string {
    switch(role?.toLowerCase()) {
      case 'admin':
        return 'shield-checkmark';
      case 'donor':
        return 'heart';
      case 'volunteer':
        return 'bicycle';
      default:
        return 'person';
    }
  }

  // Get count of users by role
  getRoleCount(role: string): number {
    if (!this.TotalUsers) return 0;
    return this.TotalUsers.filter((user: any) => 
      user.role?.toLowerCase() === role.toLowerCase()
    ).length;
  }
}
