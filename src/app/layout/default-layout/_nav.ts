import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
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
    
    iconComponent: { name: 'cil-chart-pie' },
    children: [
      {
        name: 'Overview',
        url: '/statistics/overview'
      },
      {
        name: 'By User',
        url: '/statistics/by-user'
      },
      {
        name: 'By Project',
        url: '/statistics/by-project'
      }
    ]
  }
];