import {Routes} from '@angular/router';
import {AdminComponent} from './pages/admin.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'accounts/account-info'},
      {
        path: 'accounts',
        loadChildren: () => import('./pages/accounts/account.module').then(m => m.AccountModule),
      },
      {
        path: 'secrets',
        loadChildren: () => import('./pages/secrets/secret.module').then(m => m.SecretModule),
      },
    ],
  },
];
