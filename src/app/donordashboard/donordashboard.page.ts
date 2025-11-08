import { Component, OnInit } from '@angular/core';
import { Auth } from '../services/auth.service';

@Component({
  selector: 'app-donordashboard',
  templateUrl: './donordashboard.page.html',
  styleUrls: ['./donordashboard.page.scss'],
  standalone:false,
})
export class DonordashboardPage implements OnInit {

  constructor(private service:Auth) { }

  ngOnInit() {
  }


}
