import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabVolunteerPage } from './tab-volunteer.page';

const routes: Routes = [
  {path:'',redirectTo:'vdashboard',pathMatch:'full'},
  {
    path: '',
    component: TabVolunteerPage,
    children:[
        {
    path: 'vdashboard',
    loadChildren: () => import('../vdashboard/vdashboard.module').then( m => m.VdashboardPageModule)
    },
     {
    path: 'vpickup',
    loadChildren: () => import('../vpickup/vpickup.module').then( m => m.VpickupPageModule)
    },
      {
    path: 'vhistory',
    loadChildren: () => import('../vhistory/vhistory.module').then( m => m.VhistoryPageModule)
  },
    {
    path: 'vprofile',
    loadChildren: () => import('../vprofile/vprofile.module').then( m => m.VprofilePageModule)
  },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabVolunteerPageRoutingModule {}
