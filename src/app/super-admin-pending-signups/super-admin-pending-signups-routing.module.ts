import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuperAdminPendingSignupsPage } from './super-admin-pending-signups.page';

const routes: Routes = [
  {
    path: '',
    component: SuperAdminPendingSignupsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuperAdminPendingSignupsPageRoutingModule {}
