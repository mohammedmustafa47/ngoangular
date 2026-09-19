import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuperAdminAreaDetailPageRoutingModule } from './super-admin-area-detail-routing.module';

import { SuperAdminAreaDetailPage } from './super-admin-area-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuperAdminAreaDetailPageRoutingModule
  ],
  declarations: [SuperAdminAreaDetailPage]
})
export class SuperAdminAreaDetailPageModule {}
