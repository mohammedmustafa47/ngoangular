import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabAdminPageRoutingModule } from './tab-admin-routing.module';
import { SharedModule } from '../shared/shared.module';

import { TabAdminPage } from './tab-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    TabAdminPageRoutingModule
  ],
  declarations: [TabAdminPage]
})
export class TabAdminPageModule {}
