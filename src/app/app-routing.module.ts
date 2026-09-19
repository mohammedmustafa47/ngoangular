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
    path: 'tab-admin',
    loadChildren: () => import('./tab-admin/tab-admin.module').then( m => m.TabAdminPageModule),
    canActivate: [RoleGuard], data: { expectedRole: ['admin', 'super_admin'] }
  },
  {
    path: 'tab-donor',
    loadChildren: () => import('./tab-donor/tab-donor.module').then( m => m.TabDonorPageModule),
    canActivate: [RoleGuard], data: { expectedRole: 'donor' }
  },
  {
    path: 'tab-volunteer',
    loadChildren: () => import('./tab-volunteer/tab-volunteer.module').then( m => m.TabVolunteerPageModule),
    canActivate: [RoleGuard], data: { expectedRole: 'volunteer' }
  },
  {
    path: 'verify-otp',
    loadChildren: () => import('./verify-otp/verify-otp.module').then( m => m.VerifyOtpPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'adminprofile',
    loadChildren: () => import('./adminprofile/adminprofile.module').then( m => m.AdminprofilePageModule),
    canActivate: [RoleGuard], data: { expectedRole: ['admin', 'super_admin'] }
  },
  {
    path: 'super-admin-dashboard',
    loadChildren: () => import('./super-admin-dashboard/super-admin-dashboard.module').then( m => m.SuperAdminDashboardPageModule),
    canActivate: [RoleGuard], data: { expectedRole: 'super_admin' }
  },
  {
    path: 'super-admin-areas',
    loadChildren: () => import('./super-admin-areas/super-admin-areas.module').then( m => m.SuperAdminAreasPageModule),
    canActivate: [RoleGuard], data: { expectedRole: 'super_admin' }
  },
  {
    path: 'super-admin-pending-signups',
    loadChildren: () => import('./super-admin-pending-signups/super-admin-pending-signups.module').then( m => m.SuperAdminPendingSignupsPageModule),
    canActivate: [RoleGuard], data: { expectedRole: 'super_admin' }
  },
  {
    path: 'super-admin-unattended-donations',
    loadChildren: () => import('./super-admin-unattended-donations/super-admin-unattended-donations.module').then( m => m.SuperAdminUnattendedDonationsPageModule),
    canActivate: [RoleGuard], data: { expectedRole: 'super_admin' }
  },
  {
    path: 'super-admin-create-admin',
    loadChildren: () => import('./super-admin-create-admin/super-admin-create-admin.module').then( m => m.SuperAdminCreateAdminPageModule),
    canActivate: [RoleGuard], data: { expectedRole: 'super_admin' }
  },
  {
    path: 'super-admin-area-detail/:areaId',
    loadChildren: () => import('./super-admin-area-detail/super-admin-area-detail.module').then( m => m.SuperAdminAreaDetailPageModule),
    canActivate: [RoleGuard], data: { expectedRole: 'super_admin' }
  },
  {
    path: 'super-admin-all-users',
    loadChildren: () => import('./super-admin-all-users/super-admin-all-users.module').then( m => m.SuperAdminAllUsersPageModule),
    canActivate: [RoleGuard], data: { expectedRole: 'super_admin' }
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
