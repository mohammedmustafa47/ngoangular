import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuperAdminDashboardPage } from './super-admin-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: SuperAdminDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuperAdminDashboardPageRoutingModule {}
