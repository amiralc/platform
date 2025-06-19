import { Routes } from '@angular/router';
import { UserlistComponent } from './userlist.component';

export const routes: Routes = [
  {
    path: '',
    component: UserlistComponent,
    data: {
      title: 'User List'
    }
  }
];
