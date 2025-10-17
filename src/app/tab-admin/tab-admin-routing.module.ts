import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabAdminPage } from './tab-admin.page';

const routes: Routes = [
  {
    path: '',
    component: TabAdminPage,
    children:[
       { path: '', redirectTo: 'admindashboard', pathMatch: 'full' },
    {
    path: 'admindashboard',
    loadChildren: () => import('../admindashboard/admindashboard.module').then( m => m.AdmindashboardPageModule)
    },
    {
    path: 'admindonation',
    loadChildren: () => import('../admindonation/admindonation.module').then( m => m.AdmindonationPageModule)
    },
    {
    path: 'adminsuser',
    loadChildren: () => import('../adminsuser/adminsuser.module').then( m => m.AdminsuserPageModule)
    },
      {
    path: 'adminreport',
    loadChildren: () => import('../adminreport/adminreport.module').then( m => m.AdminreportPageModule)
    },


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabAdminPageRoutingModule {}
