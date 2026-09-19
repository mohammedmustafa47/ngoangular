import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabDonorPageRoutingModule } from './tab-donor-routing.module';
import { SharedModule } from '../shared/shared.module';

import { TabDonorPage } from './tab-donor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    TabDonorPageRoutingModule
  ],
  declarations: [TabDonorPage]
})
export class TabDonorPageModule {}
