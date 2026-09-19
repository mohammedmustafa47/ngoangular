import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuperAdminDashboardPageRoutingModule } from './super-admin-dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';

import { SuperAdminDashboardPage } from './super-admin-dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    SuperAdminDashboardPageRoutingModule
  ],
  declarations: [SuperAdminDashboardPage]
})
export class SuperAdminDashboardPageModule {}
