import { Component, OnInit } from '@angular/core';
import { Auth } from '../services/auth.service';

@Component({
  selector: 'app-vdashboard',
  templateUrl: './vdashboard.page.html',
  styleUrls: ['./vdashboard.page.scss'],
  standalone:false,
})
export class VdashboardPage implements OnInit {

  constructor(private service:Auth) { }

  ngOnInit() {
  }

}
