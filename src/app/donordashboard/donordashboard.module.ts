import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DonordashboardPageRoutingModule } from './donordashboard-routing.module';

import { DonordashboardPage } from './donordashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DonordashboardPageRoutingModule
  ],
  declarations: [DonordashboardPage]
})
export class DonordashboardPageModule {}
