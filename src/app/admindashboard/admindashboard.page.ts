import { Component, OnInit } from '@angular/core';
import { Auth } from '../services/auth.service';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.page.html',
  styleUrls: ['./admindashboard.page.scss'],
  standalone:false,
})
export class AdmindashboardPage implements OnInit {

  constructor(private service: Auth) { }

  ngOnInit() {
    
  }

}

