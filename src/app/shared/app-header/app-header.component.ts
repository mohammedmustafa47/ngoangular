import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  standalone: false,
})
export class AppHeaderComponent {
  /** Title shown in the toolbar, e.g. "Donor", "Volunteer", "Admin". */
  @Input() title = '';

  /** Which ion-menu this header's menu button opens — matches menuId on the <ion-menu> in app.component.html. */
  @Input() menuId = 'main-menu';
}
