import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DonorPage } from './donor.page';

const routes: Routes = [
  {
    path: '',
    component: DonorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonorPageRoutingModule {}
