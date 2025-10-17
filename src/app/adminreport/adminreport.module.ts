import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminreportPageRoutingModule } from './adminreport-routing.module';

import { AdminreportPage } from './adminreport.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminreportPageRoutingModule
  ],
  declarations: [AdminreportPage]
})
export class AdminreportPageModule {}
