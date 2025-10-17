import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DonorprofilePageRoutingModule } from './donorprofile-routing.module';

import { DonorprofilePage } from './donorprofile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DonorprofilePageRoutingModule
  ],
  declarations: [DonorprofilePage]
})
export class DonorprofilePageModule {}
