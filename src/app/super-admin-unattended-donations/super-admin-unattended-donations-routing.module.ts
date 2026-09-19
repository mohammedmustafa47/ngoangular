import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuperAdminUnattendedDonationsPage } from './super-admin-unattended-donations.page';

const routes: Routes = [
  {
    path: '',
    component: SuperAdminUnattendedDonationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuperAdminUnattendedDonationsPageRoutingModule {}
