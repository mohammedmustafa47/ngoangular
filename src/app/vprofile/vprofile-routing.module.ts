import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VprofilePage } from './vprofile.page';

const routes: Routes = [
  {
    path: '',
    component: VprofilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VprofilePageRoutingModule {}
