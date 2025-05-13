import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: { title: 'Login Page' }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: { title: 'Register Page' }
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: { title: 'Page 404' }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: { title: 'Page 500' }
  },

  // Redirect root path to dashboard
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

 
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate:[authGuard],
    data: { title: 'Home' },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then(m => m.routes)
      },
      {
        path: 'projects',
        loadChildren: () => import('./views/projects/routes').then(m => m.routes)
      },
      {
        path: 'task',
        loadChildren: () => import('./views/task/routes').then(m => m.routes)
      },
      {
        path: 'userlist',
        loadChildren: () => import('./views/userlist/routes').then(m => m.routes)
      },
      {
        path: 'userprofiles',
        loadComponent: () => import('./views/userprofile/userprofile.component').then(m => m.UserProfileComponent),
        data: { title: 'User Profiles' }
      },
      {
        path: 'statistics',
        loadChildren: () => import('./views/statistics/routes').then(m => m.routes)
      }
    ]
  },

  
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
