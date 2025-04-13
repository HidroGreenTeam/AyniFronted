import { Routes } from '@angular/router';
import { authenticationGuard } from './iam/services/authentication.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout.component'),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/pages/dashboard/dashboard.component'),
        canActivate: [authenticationGuard],
      },
      {
        path: 'add-crop',
        loadComponent: () =>
          import('./crops/pages/add-crop/add-crop.component'),
        canActivate: [authenticationGuard],
      },
      {
        path: 'devices',
        loadComponent: () =>
          import('./devices/pages/devices/devices.component'),
        canActivate: [authenticationGuard],
      },
      
      {
        path: 'irrigation',
        loadComponent: () =>
          import('./irrigation/pages/irrigation/irrigation.component'),
        canActivate: [authenticationGuard],
      },
      {
        path: 'soil',
        loadComponent: () =>
          import('./soil-analysis/pages/soil/soil.component'),
        canActivate: [authenticationGuard],
      },
      {
        path: 'report',
        loadComponent: () => import('./report/pages/report/report.component'),
        canActivate: [authenticationGuard],
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./settings/pages/settings/settings.component'),
        canActivate: [authenticationGuard],
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./notification/pages/notification/notification.component'),
        canActivate: [authenticationGuard],
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/pages/profile/profile.component'),
        canActivate: [authenticationGuard],
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'sign-in',
    loadComponent: () => import('./iam/pages/sign-in/sign-in.component'),
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./iam/pages/sign-up/sign-up.component'),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
