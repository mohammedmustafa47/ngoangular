import { Component, OnInit } from '@angular/core';
import { Auth } from '../services/auth.service';

@Component({
  selector: 'app-admindonation',
  templateUrl: './admindonation.page.html',
  styleUrls: ['./admindonation.page.scss'],
  standalone:false,
})
export class AdmindonationPage implements OnInit {
  AllFood:any;
  constructor(private serviceapi:Auth) { }

  ngOnInit() {
    this.GetAllFood();
  }

  GetAllFood(){
    this.serviceapi.getList('donations').then((data)=>{
      this.AllFood=data;
      console.log(this.AllFood);
    })
  }

  deleteDonation(id: number) {
    if (!confirm('Delete this donation? This cannot be undone.')) return;
    this.serviceapi.deleteRecord('donations', id).then(() => {
      this.AllFood = this.AllFood.filter((food: any) => food.id !== id);
    }).catch((error) => {
      console.error('Error deleting donation:', error);
      alert(error?.error?.detail || 'Failed to delete donation.');
    });
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

  // Get count of donations by status
  getStatusCount(status: string): number {
    if (!this.AllFood) return 0;
    return this.AllFood.filter((food: any) => 
      food.status?.toLowerCase() === status.toLowerCase()
    ).length;
  }
}
