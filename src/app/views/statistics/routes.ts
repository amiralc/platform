import { Routes } from '@angular/router';
import { StatisticsComponent } from './statistics.component';
import { ByuserComponent } from './byuser/byuser.component';
import { ByprojectComponent } from './byproject/byproject.component';

export const routes: Routes = [    
  { 
        path: 'overview', 
        component: StatisticsComponent,
        data: { view: 'overview' }
      },
      { 
        path: 'by-user', 
        component: ByuserComponent,
        data: { view: 'by-user' }
      },
      { 
        path: 'by-project', 
        component: ByprojectComponent,
        data: { view: 'by-project' }
      }

  
];