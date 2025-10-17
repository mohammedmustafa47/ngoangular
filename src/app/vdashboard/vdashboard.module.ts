import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VdashboardPageRoutingModule } from './vdashboard-routing.module';

import { VdashboardPage } from './vdashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VdashboardPageRoutingModule
  ],
  declarations: [VdashboardPage]
})
export class VdashboardPageModule {}
