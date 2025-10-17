import { Component, OnInit } from '@angular/core';
import { Auth } from '../services/auth.service';

@Component({
  selector: 'app-donatehistory',
  templateUrl: './donatehistory.page.html',
  styleUrls: ['./donatehistory.page.scss'],
  standalone:false,
})
export class DonatehistoryPage implements OnInit {
  DonatedFood:any;
  constructor(private serviceapi:Auth) { }

  ngOnInit() {
    this.GetDonatedFood();
  }
  
  GetDonatedFood(){
    this.serviceapi.getList('donations').then((data)=>{
      this.DonatedFood=data;
      console.log(this.DonatedFood);
    })
  }

  // Get status badge color
  getStatusColor(status: string): string {
    switch(status?.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'picked_up':
      case 'picked':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'medium';
    }
  }

  // Get status icon
  getStatusIcon(status: string): string {
    switch(status?.toLowerCase()) {
      case 'pending':
        return 'time-outline';
      case 'picked_up':
      case 'picked':
        return 'bicycle-outline';
      case 'delivered':
        return 'checkmark-circle-outline';
      case 'cancelled':
        return 'close-circle-outline';
      default:
        return 'help-outline';
    }
  }

  // Get count of donations by status
  getStatusCount(status: string): number {
    if (!this.DonatedFood) return 0;
    return this.DonatedFood.filter((food: any) => 
      food.status?.toLowerCase() === status.toLowerCase()
    ).length;
  }
}
