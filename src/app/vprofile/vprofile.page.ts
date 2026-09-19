import { Component, OnInit } from '@angular/core';
import { Auth } from '../services/auth.service';

@Component({
  selector: 'app-vprofile',
  templateUrl: './vprofile.page.html',
  styleUrls: ['./vprofile.page.scss'],
  standalone:false,
})
export class VprofilePage implements OnInit {

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
