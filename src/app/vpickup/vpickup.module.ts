import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VpickupPageRoutingModule } from './vpickup-routing.module';

import { VpickupPage } from './vpickup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VpickupPageRoutingModule
  ],
  declarations: [VpickupPage]
})
export class VpickupPageModule {}
