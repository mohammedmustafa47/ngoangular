import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VdashboardPage } from './vdashboard.page';

const routes: Routes = [
  {
    path: '',
    component: VdashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VdashboardPageRoutingModule {}
