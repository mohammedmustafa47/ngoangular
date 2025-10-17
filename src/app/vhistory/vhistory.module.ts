import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VhistoryPageRoutingModule } from './vhistory-routing.module';

import { VhistoryPage } from './vhistory.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VhistoryPageRoutingModule
  ],
  declarations: [VhistoryPage]
})
export class VhistoryPageModule {}
