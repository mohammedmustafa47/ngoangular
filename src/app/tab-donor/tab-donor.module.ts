import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabDonorPageRoutingModule } from './tab-donor-routing.module';

import { TabDonorPage } from './tab-donor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabDonorPageRoutingModule
  ],
  declarations: [TabDonorPage]
})
export class TabDonorPageModule {}
