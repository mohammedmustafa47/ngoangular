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
  constructor(private route: Router, private service: Auth, private menuCtrl: MenuController) {}

  async goToProfile() {
    await this.menuCtrl.close();
    const role = this.service.getUserRole();
    if (role === 'donor') this.route.navigate(['/tab-donor/donorprofile']);
    else if (role === 'volunteer') this.route.navigate(['/tab-volunteer/vprofile']);
    else if (role === 'admin' || role === 'super_admin') this.route.navigate(['/adminprofile']);
  }

  async logout() {
    await this.menuCtrl.close();
    this.service.logout();
  }

}
