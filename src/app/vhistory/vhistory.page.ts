import { Component, OnInit } from '@angular/core';
import { Auth } from '../services/auth.service';

@Component({
  selector: 'app-vhistory',
  templateUrl: './vhistory.page.html',
  styleUrls: ['./vhistory.page.scss'],
  standalone:false,
})
export class VhistoryPage implements OnInit {
  CompletedTasks: any;

  constructor(private serviceapi: Auth) { }

  ngOnInit() {
    this.GetCompletedTasks();
  }

  GetCompletedTasks() {
    // Get all donations and filter for completed ones (delivered/cancelled)
    this.serviceapi.getList('donations').then((data) => {
      // Filter to show only delivered and cancelled donations
      this.CompletedTasks = data.filter((donation: any) => 
        donation.status === 'delivered' || donation.status === 'cancelled'
      );
      console.log('Completed tasks:', this.CompletedTasks);
    }).catch((error) => {
      console.error('Error loading completed tasks:', error);
    });
  }

  // Get count of tasks by status
  getStatusCount(status: string): number {
    if (!this.CompletedTasks) return 0;
    return this.CompletedTasks.filter((task: any) => 
      task.status?.toLowerCase() === status.toLowerCase()
    ).length;
  }

}
