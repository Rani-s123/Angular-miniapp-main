import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'data-binding',
    loadComponent: () => import('./components/data-binding/data-binding.component').then(m => m.DataBindingComponent)
  },
  {
    path: 'rxjs-demo',
    loadComponent: () => import('./components/rxjs-demo/rxjs-demo.component').then(m => m.RxjsDemoComponent)
  },
  {
    path: 'protected',
    loadComponent: () => import('./components/protected/protected.component').then(m => m.ProtectedComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'lazy',
    loadChildren: () => import('./modules/lazy/lazy.routes').then(m => m.LAZY_ROUTES)
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
