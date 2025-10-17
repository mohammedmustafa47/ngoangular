import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },

  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then( m => m.AdminPageModule),
     canActivate: [RoleGuard], data: { expectedRole: 'admin' }
  },
  {
    path: 'donor',
    loadChildren: () => import('./donor/donor.module').then( m => m.DonorPageModule)
  },
  {
    path: 'volunteer',
    loadChildren: () => import('./volunteer/volunteer.module').then( m => m.VolunteerPageModule)
  },
  {
    path: 'tab-admin',
    loadChildren: () => import('./tab-admin/tab-admin.module').then( m => m.TabAdminPageModule)
  },
  {
    path: 'tab-donor',
    loadChildren: () => import('./tab-donor/tab-donor.module').then( m => m.TabDonorPageModule)
  },
  {
    path: 'tab-volunteer',
    loadChildren: () => import('./tab-volunteer/tab-volunteer.module').then( m => m.TabVolunteerPageModule)
  },
  // {
  //   path: 'vprofile',
  //   loadChildren: () => import('./vprofile/vprofile.module').then( m => m.VprofilePageModule)
  // },
  // {
  //   path: 'vhistory',
  //   loadChildren: () => import('./vhistory/vhistory.module').then( m => m.VhistoryPageModule)
  // },
  // {
  //   path: 'vpickup',
  //   loadChildren: () => import('./vpickup/vpickup.module').then( m => m.VpickupPageModule)
  // },
  // {
  //   path: 'donorprofile',
  //   loadChildren: () => import('./donorprofile/donorprofile.module').then( m => m.DonorprofilePageModule)
  // },
  // {
  //   path: 'vdashboard',
  //   loadChildren: () => import('./vdashboard/vdashboard.module').then( m => m.VdashboardPageModule)
  // },
  // {
  //   path: 'donatehistory',
  //   loadChildren: () => import('./donatehistory/donatehistory.module').then( m => m.DonatehistoryPageModule)
  // },
  // {
  //   path: 'donateform',
  //   loadChildren: () => import('./donateform/donateform.module').then( m => m.DonateformPageModule)
  // },
  // {
  //   path: 'donordashboard',
  //   loadChildren: () => import('./donordashboard/donordashboard.module').then( m => m.DonordashboardPageModule)
  // },
  // {
  //   path: 'adminreport',
  //   loadChildren: () => import('./adminreport/adminreport.module').then( m => m.AdminreportPageModule)
  // },
  // {
  //   path: 'adminsuser',
  //   loadChildren: () => import('./adminsuser/adminsuser.module').then( m => m.AdminsuserPageModule)
  // },
  // {
  //   path: 'admindonation',
  //   loadChildren: () => import('./admindonation/admindonation.module').then( m => m.AdmindonationPageModule)
  // },
  // {
  //   path: 'admindashboard',
  //   loadChildren: () => import('./admindashboard/admindashboard.module').then( m => m.AdmindashboardPageModule)
  // },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
