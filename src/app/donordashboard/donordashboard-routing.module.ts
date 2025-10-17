import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DonordashboardPage } from './donordashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DonordashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonordashboardPageRoutingModule {}
