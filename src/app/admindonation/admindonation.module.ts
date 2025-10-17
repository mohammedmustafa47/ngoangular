import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdmindonationPageRoutingModule } from './admindonation-routing.module';

import { AdmindonationPage } from './admindonation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdmindonationPageRoutingModule
  ],
  declarations: [AdmindonationPage]
})
export class AdmindonationPageModule {}
