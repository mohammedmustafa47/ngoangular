import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabDonorPage } from './tab-donor.page';

const routes: Routes = [
  {
    path: '',
    component: TabDonorPage,
    children:[
    { path: '', redirectTo: 'donordashboard', pathMatch: 'full' },
    {
    path: 'donordashboard',
    loadChildren: () => import('../donordashboard/donordashboard.module').then( m => m.DonordashboardPageModule)
    },
      {
    path: 'donateform',
    loadChildren: () => import('../donateform/donateform.module').then( m => m.DonateformPageModule)
    },
      {
    path: 'donatehistory',
    loadChildren: () => import('../donatehistory/donatehistory.module').then( m => m.DonatehistoryPageModule)
    },
      {
    path: 'donorprofile',
    loadChildren: () => import('../donorprofile/donorprofile.module').then( m => m.DonorprofilePageModule)
    },
    
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabDonorPageRoutingModule {}
