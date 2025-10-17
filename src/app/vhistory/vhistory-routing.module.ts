import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VhistoryPage } from './vhistory.page';

const routes: Routes = [
  {
    path: '',
    component: VhistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VhistoryPageRoutingModule {}
