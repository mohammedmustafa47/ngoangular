import { Component, OnInit } from '@angular/core';
import { Auth } from '../services/auth.service';

@Component({
  selector: 'app-super-admin-unattended-donations',
  templateUrl: './super-admin-unattended-donations.page.html',
  styleUrls: ['./super-admin-unattended-donations.page.scss'],
  standalone: false,
})
export class SuperAdminUnattendedDonationsPage implements OnInit {

  donations: any[] = [];
  loading = true;

  constructor(private serviceapi: Auth) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.serviceapi.getUnattendedDonations().subscribe({
      next: (data: any) => {
        this.donations = Array.isArray(data) ? data : (data?.results ?? []);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading unattended donations:', err);
        this.loading = false;
      }
    });
  }
}
