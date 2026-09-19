import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuperAdminAreasPageRoutingModule } from './super-admin-areas-routing.module';

import { SuperAdminAreasPage } from './super-admin-areas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuperAdminAreasPageRoutingModule
  ],
  declarations: [SuperAdminAreasPage]
})
export class SuperAdminAreasPageModule {}
