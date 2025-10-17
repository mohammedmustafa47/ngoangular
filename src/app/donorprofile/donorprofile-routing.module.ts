import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DonorprofilePage } from './donorprofile.page';

const routes: Routes = [
  {
    path: '',
    component: DonorprofilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonorprofilePageRoutingModule {}
