import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabVolunteerPageRoutingModule } from './tab-volunteer-routing.module';
import { SharedModule } from '../shared/shared.module';

import { TabVolunteerPage } from './tab-volunteer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    TabVolunteerPageRoutingModule
  ],
  declarations: [TabVolunteerPage]
})
export class TabVolunteerPageModule {}
