import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DonorPageRoutingModule } from './donor-routing.module';

import { DonorPage } from './donor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DonorPageRoutingModule
  ],
  declarations: [DonorPage]
})
export class DonorPageModule {}
