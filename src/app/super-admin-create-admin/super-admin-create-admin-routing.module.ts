import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuperAdminCreateAdminPage } from './super-admin-create-admin.page';

const routes: Routes = [
  {
    path: '',
    component: SuperAdminCreateAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuperAdminCreateAdminPageRoutingModule {}
