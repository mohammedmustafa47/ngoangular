import { Component, OnInit } from '@angular/core';
import { Auth } from '../services/auth.service';

@Component({
  selector: 'app-vpickup',
  templateUrl: './vpickup.page.html',
  styleUrls: ['./vpickup.page.scss'],
  standalone:false,
})
export class VpickupPage implements OnInit {
  DonationList: any;

  constructor(private serviceapi: Auth) { }

  ngOnInit() {
    this.GetDonationList();
  }
  
  GetDonationList() {
    // Show pending and picked donations (volunteer's active tasks)
    this.serviceapi.getList('donations').then((data) => {
      // Filter to show only pending and picked donations
      this.DonationList = data.filter((donation: any) => 
        donation.status === 'pending' || donation.status === 'picked'
      );
      console.log('Active donations:', this.DonationList);
    }).catch((error) => {
      console.error('Error loading donations:', error);
    });
  }

  pickDonation(donationId: number) {
    this.serviceapi.postAction(`donations/${donationId}/pick_donation/`).subscribe({
      next: (res: any) => {
        console.log('Success:', res);
        alert(res.message || 'Donation successfully picked!');

        // Refresh the list to show the updated status
        this.GetDonationList();
      },
      error: (err) => {
        console.error('Error picking donation:', err);
        const errorMessage = err.error?.error || 'Error picking up donation.';
        alert(errorMessage);
      }
    });
  }

  updateStatus(donationId: number, newStatus: string) {
    this.serviceapi.postAction(`donations/${donationId}/update_status/`, { status: newStatus }).subscribe({
      next: (res: any) => {
        console.log('Status updated:', res);
        alert(res.message || `Status updated to ${newStatus}`);

        // Refresh the list to remove the completed donation
        this.GetDonationList();
      },
      error: (err) => {
        console.error('Error updating status:', err);
        const errorMessage = err.error?.error || 'Error updating donation status.';
        alert(errorMessage);
      }
    });
  }

  markAsDelivered(donationId: number) {
    // Confirm before marking as delivered
    if (confirm('Mark this donation as delivered?')) {
      this.updateStatus(donationId, 'delivered');
    }
  }

  cancelDonation(donationId: number) {
    // Confirm before cancelling
    if (confirm('Are you sure you want to cancel this donation?')) {
      this.updateStatus(donationId, 'cancelled');
    }
  }

  // Get count of donations by status
  getStatusCount(status: string): number {
    if (!this.DonationList) return 0;
    return this.DonationList.filter((donation: any) => 
      donation.status?.toLowerCase() === status.toLowerCase()
    ).length;
  }
}      
