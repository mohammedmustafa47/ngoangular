import { Component, OnInit } from '@angular/core';
import { Auth } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donateform',
  templateUrl: './donateform.page.html',
  styleUrls: ['./donateform.page.scss'],
  standalone:false,
})
export class DonateformPage implements OnInit {
  
  // Form data object
  donationData = {
    id: undefined,  // undefined for new record, or set to existing ID for update
    item_name: '',
    quantity: '',
    pickup_address: '',
    contact_number: '',
    description: ''
  };

  constructor(private serviceapi: Auth, private router: Router) { }

  ngOnInit() {
    // If editing an existing donation, load it here
    // this.loadDonation(donationId);
  }

  /**
   * Save or update donation using saveRecord
   * - If donationData.id is undefined → creates new record (POST)
   * - If donationData.id exists → updates existing record (PATCH)
   */
  SaveFood() {
    // Validate form
    if (!this.donationData.item_name || !this.donationData.quantity) {
      alert('Please fill in all required fields');
      return;
    }

    // Call saveRecord - it automatically handles create vs update
    this.serviceapi.saveRecord('donations', this.donationData)
      .then((result) => {
        console.log('Donation saved successfully:', result);
        alert('Donation saved successfully!');
        
        // Reset form after successful save
        this.resetForm();
        
        // Optional: Navigate to another page
        // this.router.navigate(['/donation-list']);
      })
      .catch((error) => {
        console.error('Error saving donation:', error);
        alert('Failed to save donation. Please try again.');
      });
  }

  /**
   * Load existing donation for editing
   */
  loadDonation(donationId: number) {
    this.serviceapi.getData('donations/' + donationId + '/', '')
      .then((data) => {
        this.donationData = data;
      })
      .catch((error) => {
        console.error('Error loading donation:', error);
      });
  }

  /**
   * Reset form to initial state
   */
  resetForm() {
    this.donationData = {
      id: undefined,
      item_name: '',
      quantity: '',
      pickup_address: '',
      
      contact_number: '',
      description: ''
    };
  }
}
