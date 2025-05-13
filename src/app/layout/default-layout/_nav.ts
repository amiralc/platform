import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Application'
  },
  {
    name: 'Projects',
    url: '/projects',
    iconComponent: { name: 'cil-folder' } 
  },
  {
    name: 'Task',
    url: '/task', 
    iconComponent: { name: 'cil-list' } 
  },
  {
    name: 'User List',
    url: '/userlist',
    iconComponent: { name: 'cil-people' } 
  },
  {
    name: 'User Profiles',
    url: '/userprofiles', 
    iconComponent: { name: 'cil-user' } 
  },
  {
    name: 'Statistics',
    url: '/statistics',
    iconComponent: { name: 'cil-chart-pie' } 
  },
  
  
  
];
