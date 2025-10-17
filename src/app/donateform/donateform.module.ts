import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DonateformPageRoutingModule } from './donateform-routing.module';

import { DonateformPage } from './donateform.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DonateformPageRoutingModule
  ],
  declarations: [DonateformPage]
})
export class DonateformPageModule {}
