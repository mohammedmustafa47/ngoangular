import { Component, OnInit } from '@angular/core';
import { Auth } from '../services/auth.service';

@Component({
  selector: 'app-donorprofile',
  templateUrl: './donorprofile.page.html',
  styleUrls: ['./donorprofile.page.scss'],
  standalone:false,
})
export class DonorprofilePage implements OnInit {

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

  logout() {
    this.service.logout();
  }

}
