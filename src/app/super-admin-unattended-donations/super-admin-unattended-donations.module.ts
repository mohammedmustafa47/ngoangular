import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuperAdminUnattendedDonationsPageRoutingModule } from './super-admin-unattended-donations-routing.module';

import { SuperAdminUnattendedDonationsPage } from './super-admin-unattended-donations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuperAdminUnattendedDonationsPageRoutingModule
  ],
  declarations: [SuperAdminUnattendedDonationsPage]
})
export class SuperAdminUnattendedDonationsPageModule {}
