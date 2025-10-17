import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DonatehistoryPage } from './donatehistory.page';

const routes: Routes = [
  {
    path: '',
    component: DonatehistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonatehistoryPageRoutingModule {}
