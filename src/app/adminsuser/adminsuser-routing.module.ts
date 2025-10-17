import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminsuserPage } from './adminsuser.page';

const routes: Routes = [
  {
    path: '',
    component: AdminsuserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminsuserPageRoutingModule {}
