import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuperAdminAllUsersPageRoutingModule } from './super-admin-all-users-routing.module';

import { SuperAdminAllUsersPage } from './super-admin-all-users.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuperAdminAllUsersPageRoutingModule
  ],
  declarations: [SuperAdminAllUsersPage]
})
export class SuperAdminAllUsersPageModule {}
