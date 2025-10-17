import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminsuserPageRoutingModule } from './adminsuser-routing.module';

import { AdminsuserPage } from './adminsuser.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminsuserPageRoutingModule
  ],
  declarations: [AdminsuserPage]
})
export class AdminsuserPageModule {}
