import { Routes } from '@angular/router';
import { StatisticsComponent } from './statistics.component';

export const routes: Routes = [
  {
    path: '',
    component: StatisticsComponent,
    data: {
      title: 'Statistics'
    }
  }
];
