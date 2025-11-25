import { Routes } from '@angular/router';

export const LAZY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./lazy.component').then(m => m.LazyComponent)
  }
];
