import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from './services/auth.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private route:Router, private service:Auth,private menuCtrl: MenuController) {}

  async logout() {
    localStorage.removeItem('token');
    await this.menuCtrl.close();
    this.route.navigate(['/login']);
  }
  
}
