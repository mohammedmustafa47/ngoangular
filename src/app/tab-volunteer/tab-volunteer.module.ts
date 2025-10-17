import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabVolunteerPageRoutingModule } from './tab-volunteer-routing.module';

import { TabVolunteerPage } from './tab-volunteer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabVolunteerPageRoutingModule
  ],
  declarations: [TabVolunteerPage]
})
export class TabVolunteerPageModule {}
