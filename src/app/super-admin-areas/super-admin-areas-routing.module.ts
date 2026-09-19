import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuperAdminAreasPage } from './super-admin-areas.page';

const routes: Routes = [
  {
    path: '',
    component: SuperAdminAreasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuperAdminAreasPageRoutingModule {}
