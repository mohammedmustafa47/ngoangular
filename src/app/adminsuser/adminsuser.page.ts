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
