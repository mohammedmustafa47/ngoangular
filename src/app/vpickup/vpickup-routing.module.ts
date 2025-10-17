import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VpickupPage } from './vpickup.page';

const routes: Routes = [
  {
    path: '',
    component: VpickupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VpickupPageRoutingModule {}
