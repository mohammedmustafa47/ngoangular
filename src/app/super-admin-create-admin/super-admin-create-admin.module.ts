import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuperAdminCreateAdminPageRoutingModule } from './super-admin-create-admin-routing.module';

import { SuperAdminCreateAdminPage } from './super-admin-create-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuperAdminCreateAdminPageRoutingModule
  ],
  declarations: [SuperAdminCreateAdminPage]
})
export class SuperAdminCreateAdminPageModule {}
