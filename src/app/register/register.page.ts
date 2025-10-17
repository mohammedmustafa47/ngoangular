import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../services/auth.service';

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
    role:'',
    password:'',
  }
  showPassword = false;
  acceptedTerms = false;

  constructor(private route:Router,private serviceapi:Auth) { }

  ngOnInit() {
  }

    onRegister(){
      // Validate form
      if (!this.acceptedTerms) {
        alert('Please accept the terms and conditions');
        return;
      }

      if (!this.Registerobj.username || !this.Registerobj.email || !this.Registerobj.role || !this.Registerobj.password) {
        alert('Please fill in all required fields');
        return;
      }

      // Fix: Correct parameter order is (username, password, email, role)
      this.serviceapi.register(this.Registerobj.username, this.Registerobj.password, this.Registerobj.email, this.Registerobj.role)
      .subscribe({
      next: (res: any) => {
        alert('Registration successful! Welcome to our community!');
        console.warn(this.Registerobj);
        this.route.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration error:', err);
        if (err.error && err.error.non_field_errors) {
          alert(err.error.non_field_errors[0]);
        } else if (err.error && err.error.detail) {
          alert(err.error.detail);
        } else if (err.error && err.error.role) {
          // Handle role validation error from backend
          alert(err.error.role);
        } else {
          alert('Registration failed. Please try again.');
        }
      }
      });
    }

    // Get role icon
    getRoleIcon(): string {
      switch(this.Registerobj.role) {
        case 'donor': return 'heart';
        case 'volunteer': return 'bicycle';
        case 'admin': return 'shield-checkmark';
        default: return 'person';
      }
    }

    // Get role color
    getRoleColor(): string {
      switch(this.Registerobj.role) {
        case 'donor': return 'success';
        case 'volunteer': return 'primary';
        case 'admin': return 'danger';
        default: return 'medium';
      }
    }

    // Get role title
    getRoleTitle(): string {
      switch(this.Registerobj.role) {
        case 'donor': return 'Donor Account';
        case 'volunteer': return 'Volunteer Account';
        case 'admin': return 'Admin Account';
        default: return '';
      }
    }

    // Get role description
    getRoleDescription(): string {
      switch(this.Registerobj.role) {
        case 'donor': return 'Donate surplus food to help those in need';
        case 'volunteer': return 'Pick up and deliver food donations';
        case 'admin': return 'Manage users and monitor donations';
        default: return '';
      }
    }
      
  }

