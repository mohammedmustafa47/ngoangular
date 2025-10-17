import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminreportPage } from './adminreport.page';

const routes: Routes = [
  {
    path: '',
    component: AdminreportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminreportPageRoutingModule {}
