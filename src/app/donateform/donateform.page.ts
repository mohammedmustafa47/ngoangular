import { Component, OnInit } from '@angular/core';
import { Auth } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

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
    pickup_pincode: '',
    contact_number: '',
    description: ''
  };

  pincodeError = '';

  constructor(private serviceapi: Auth, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.loadDonation(Number(id));
    } else {
      this.prefillPincode();
    }
  }

  /** Default the pickup pincode to the donor's registered one; they can change it. */
  prefillPincode() {
    this.serviceapi.getProfile().subscribe({
      next: (profile: any) => {
        if (!this.donationData.pickup_pincode) {
          this.donationData.pickup_pincode = profile?.pincode || '';
        }
      },
      error: () => {}
    });
  }

  /**
   * Save or update donation using saveRecord
   * - If donationData.id is undefined → creates new record (POST)
   * - If donationData.id exists → updates existing record (PATCH)
   */
  SaveFood() {
    // Validate form
    this.pincodeError = '';
    if (!this.donationData.item_name || !this.donationData.quantity || !this.donationData.pickup_pincode) {
      alert('Please fill in all required fields');
      return;
    }

    const isUpdate = this.donationData.id != undefined;

    // Call saveRecord - it automatically handles create vs update
    this.serviceapi.saveRecord('donations', this.donationData)
      .then((result) => {
        console.log('Donation saved successfully:', result);
        alert(isUpdate ? 'Donation updated successfully!' : 'Donation saved successfully!');

        if (isUpdate) {
          this.router.navigate(['/tab-donor/donatehistory']);
        } else {
          this.resetForm();
        }
      })
      .catch((error) => {
        console.error('Error saving donation:', error);
        const pin = error?.error?.pickup_pincode;
        if (pin) {
          this.pincodeError = Array.isArray(pin) ? pin[0] : pin;
        } else {
          alert('Failed to save donation. Please try again.');
        }
      });
  }

  /**
   * Load existing donation for editing
   */
  loadDonation(donationId: number) {
    this.serviceapi.getData('donations/' + donationId + '/', '')
      .then((data) => {
        if (data.status !== 'pending') {
          alert('This donation can no longer be edited — it has already been picked up.');
          this.router.navigate(['/tab-donor/donatehistory']);
          return;
        }
        this.donationData = data;
      })
      .catch((error) => {
        console.error('Error loading donation:', error);
        alert('Could not load this donation.');
        this.router.navigate(['/tab-donor/donatehistory']);
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
      pickup_pincode: '',
      contact_number: '',
      description: ''
    };
    this.pincodeError = '';
    this.prefillPincode();
  }
}
