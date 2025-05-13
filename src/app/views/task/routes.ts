import { Routes } from '@angular/router';
import { TaskComponent } from './task.component';

export const routes: Routes = [
  {
    path: '',
    component: TaskComponent,
    data: {
      title: 'Task'
    }
  }
];
