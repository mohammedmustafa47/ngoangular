import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VprofilePageRoutingModule } from './vprofile-routing.module';

import { VprofilePage } from './vprofile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VprofilePageRoutingModule
  ],
  declarations: [VprofilePage]
})
export class VprofilePageModule {}
