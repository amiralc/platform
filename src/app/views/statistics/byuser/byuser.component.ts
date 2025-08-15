
import { Component, OnInit } from '@angular/core';
import { TicketJiraService } from '../../../services/ticket-jira.service';
import { ProjectService } from '../../../services/project.service';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatisticsService,UserPerformanceResponse } from '../../../services/statistics.service';
import { ChangeDetectorRef } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ChartType } from 'chart.js';
import { UserService } from '../../../services/user.service';


interface StatusStat {
  status: string;
  count: number;
}

interface AssignmentStat {
  userId: string;
  count: number;
  user?: {
    email: string;
    firstname?: string;
    lastname?: string;
  };
}

interface ProjectTicketStat {
  projectName: string;
  ticketCount: number;
}

interface ApiAssignmentStat {
  userId: number;
  userName: string;
  ticketCount: number;
}
interface AvailableUser {
  id: number;
  fullName: string;
  email: string;
  position?: string;
  phone?: string;
}

@Component({
 selector: 'app-byuser',
  templateUrl: './byuser.component.html',
  styleUrl: './byuser.component.scss',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ByuserComponent implements OnInit {
 statusStats: StatusStat[] = [];
  recentResolvedTickets: any[] = [];
  projects: any[] = [];
  assignmentStats: AssignmentStat[] = [];
  isLoadingStats = false;
  isLoadingAssignments = false;
  isLoadingProjects = false;

  statusChart?: Chart;
  assignmentChart?: Chart;
  projectsChart?: Chart;
  projectsTicketStats: ProjectTicketStat[] = [];

  assignedTicketCounts: any[] = [];
  projectTicketCounts: any[] = [];
  usersPerTeam: any = {};
  ticketsByStatus: any = {};
  timeTracked: { [key: string]: number } = {};
  avgResolutionTime: any = {};
  complexityVsEstimate: any[] = [];
  showRawTimeData = false;
  timeTrackedChart?: Chart;
  availableUsers: any[] = [];
  
  // Partie Performance Utilisateur
  selectedUserId?: number;
  userPerformance?: UserPerformanceResponse;
  performanceError?: string;
  isLoadingPerformance = false;
  userPerformanceChart?: Chart;
  showPerformanceChart = true;
 

currentChartType: ChartType = 'bar';


 constructor(
    private ticketService: TicketJiraService,
     private userService: UserService,
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef,
    private statsService: StatisticsService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    console.log("Initializing ByUser component");
    
    this.loadAllData();
     this.loadAvailableUsers();
    
    this.loadProjectsTicketStats();
    
    this.statsService.getAssignedTicketCounts().subscribe(data => this.assignedTicketCounts = data);
    this.statsService.getProjectsTicketCount().subscribe(data => this.projectTicketCounts = data);
    this.statsService.getUsersPerTeam().subscribe(data => this.usersPerTeam = data);
    this.statsService.getTicketsByStatus().subscribe(data => this.ticketsByStatus = data);
    
    this.loadTimeTrackedData();
    
    this.statsService.getAvgResolutionTime().subscribe(data => {
      this.avgResolutionTime = data;
      this.createAvgResolutionChart();
    });
    this.statsService.getComplexityVsEstimated().subscribe(data => {
      this.complexityVsEstimate = data;
      this.createComplexityChart();
    });
    this.statsService.getUsersPerTeam().subscribe(data => {
      this.usersPerTeam = data;
      this.createUsersPerTeamChart();
    });
  }
  loadUserPerformance(userId: number): void {
  this.isLoadingPerformance = true;
  this.performanceError = '';
  this.userPerformance = undefined;

  this.statsService.getUserPerformance(userId)
    .pipe(finalize(() => this.isLoadingPerformance = false))
    .subscribe({
      next: (data) => {
        if (this.isDataEmpty(data)) {
          this.performanceError = 'Aucune donnée de performance disponible pour cet utilisateur.';
          this.userPerformance = undefined;
        } else {
          this.userPerformance = data;
          this.createUserPerformanceChart();
        }
      },
      error: (error) => {
        this.performanceError = this.handleError(error);
        this.userPerformance = undefined;
      }
    });
}
loadAvailableUsers(): void {
    this.userService.getAvailableUsers().subscribe({
      next: (users) => {
        this.availableUsers = users.map(user => ({
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          position: user.position,
          phone: user.phone
        }));
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs', err);
        // Vous pouvez ajouter un message d'erreur à l'utilisateur ici
      }
    });
  }


  // Méthodes utilitaires
  private isDataEmpty(data: UserPerformanceResponse): boolean {
    return (
      data.completedTasks === 0 &&
      data.inProgressTasks === 0 &&
      data.openTasks === 0 &&
      data.avgTimePerTask === 0 &&
      data.onTimeCompletionRate === 0 &&
      Object.keys(data.timeSpentPerProject).length === 0
    );
  }

  private handleError(error: any): string {
    console.error('Erreur:', error);
    if (error.status === 404) return 'Utilisateur non trouvé';
    if (error.status === 500) return 'Erreur serveur';
    return 'Erreur lors du chargement';
  }


// Méthodes utilitaires


 private isAllZero(data: UserPerformanceResponse): boolean {
    return data.completedTasks === 0 && 
           data.inProgressTasks === 0 && 
           data.openTasks === 0 &&
           data.avgTimePerTask === 0 &&
           data.onTimeCompletionRate === 0 &&
           Object.keys(data.timeSpentPerProject).length === 0;
  }

hasPerformanceData(): boolean {
  if (!this.userPerformance) return false;
  
  // Retourne true si au moins une propriété a une valeur significative
  return this.userPerformance.completedTasks !== undefined || 
         this.userPerformance.inProgressTasks !== undefined ||
         this.userPerformance.openTasks !== undefined ||
         this.userPerformance.avgTimePerTask !== undefined ||
         this.userPerformance.onTimeCompletionRate !== undefined ||
         (this.userPerformance.timeSpentPerProject && 
          Object.keys(this.userPerformance.timeSpentPerProject).length > 0);
}
  
// Méthode pour formater les projets
 getProjectsFromPerformance(): {name: string, time: number}[] {
  if (!this.userPerformance?.timeSpentPerProject) return [];
  return Object.entries(this.userPerformance.timeSpentPerProject)
    .map(([name, time]) => ({ name, time }))
    .sort((a, b) => b.time - a.time);
}
getMaxProjectTime(currentTime: number): number {
  if (!this.userPerformance?.timeSpentPerProject) return currentTime || 1;
  const times = Object.values(this.userPerformance.timeSpentPerProject);
  return Math.max(...times, currentTime, 1);
}
private createUserPerformanceChart(): void {
  if (this.userPerformanceChart) {
    this.userPerformanceChart.destroy();
  }

  const ctx = document.getElementById('userPerformanceChart') as HTMLCanvasElement;
  if (!ctx || !this.userPerformance) return;

  // Données dynamiques
  const data = [
    this.userPerformance.completedTasks || 0,
    this.userPerformance.inProgressTasks || 0,
    this.userPerformance.openTasks || 0
  ];

  // Création du graphique (choisissez 'bar' ou 'line')
  this.userPerformanceChart = new Chart(ctx, {
    type: this.currentChartType, // 'bar' ou 'line' (vous pouvez ajouter un toggle)
    data: {
      labels: ['Terminées', 'En Cours', 'Ouvertes'],
      datasets: [{
        label: 'Tâches',
        data: data,
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)', // Vert
          'rgba(255, 206, 86, 0.7)',  // Jaune
          'rgba(255, 99, 132, 0.7)'   // Rouge
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 2,
        tension: 0.4 // Pour une courbe plus lisse (si type='line')
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Performance des Tâches',
          font: { size: 16 }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}`
          }
        }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}
private createProjectTimeChart(): void {
  const ctx = document.getElementById('projectTimeChart') as HTMLCanvasElement;
  if (!ctx || !this.userPerformance?.timeSpentPerProject) return;

  const projects = this.getProjectsFromPerformance();
  const labels = projects.map(p => p.name);
  const data = projects.map(p => p.time);

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e',
          '#e74a3b', '#6610f2', '#fd7e14', '#20c9a6'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right'
        }
      }
    }
  });
}
onLoadClick(): void {
  if (this.selectedUserId) {
    this.loadUserPerformance(this.selectedUserId);
  }
}

  loadTimeTrackedData(): void {
    this.statsService.getTimeTrackedPerUser().subscribe({
      next: (data) => {
        console.log('Données temps suivi:', data);
        this.timeTracked = data;
        this.createTimeTrackedChart();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des données de temps suivi', err);
      }
    });
  }

  createTimeTrackedChart(): void {
    const ctx = document.getElementById('timeTrackedChart') as HTMLCanvasElement;
    
    if (this.timeTrackedChart) {
      this.timeTrackedChart.destroy();
    }

    if (!ctx || !this.timeTracked || Object.keys(this.timeTracked).length === 0) {
      console.warn('Impossible de créer le graphique: données ou canvas manquants');
      return;
    }

    const sortedEntries = Object.entries(this.timeTracked)
      .sort((a, b) => b[1] - a[1]);
    
    const labels = sortedEntries.map(entry => entry[0]);
    const data = sortedEntries.map(entry => entry[1]);

    this.timeTrackedChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Heures suivies',
          data: data,
          backgroundColor: '#4e73df',
          borderColor: '#1c4b8f',
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Heures'
            },
            ticks: {
              precision: 0
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${context.parsed.y} heures`;
              }
            }
          }
        }
      }
    });
  }

  toggleRawTimeData(): void {
    this.showRawTimeData = !this.showRawTimeData;
  }
   getObjectKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }


  // ... autres méthodes inchangées ...

  hasProjectsData(): boolean {
    return !!this.projectsTicketStats && this.projectsTicketStats.length > 0;
  }

  loadProjectsTicketStats(): void {
    this.isLoadingProjects = true;
    this.ticketService.getProjectsWithTicketCount().subscribe({
      next: (stats: ProjectTicketStat[]) => {
        this.projectsTicketStats = stats || [];
        this.createProjectsChart();
        this.isLoadingProjects = false;
      },
      error: (err) => {
        console.error('Error loading projects stats', err);
        this.projectsTicketStats = [];
        this.isLoadingProjects = false;
      }
    });
  }

  getTotalProjectTickets(): number {
    return this.projectsTicketStats.reduce((total, stat) => total + stat.ticketCount, 0);
  }

  getChartColor(projectName: string): string {
    const colors = [
      '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', 
      '#e74a3b', '#6610f2', '#fd7e14', '#20c9a6'
    ];
    const index = Math.abs(this.hashCode(projectName)) % colors.length;
    return colors[index];
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  createProjectsChart(): void {
    const ctx = document.getElementById('projectsChart') as HTMLCanvasElement;
    if (!ctx || !this.hasProjectsData()) return;

    if (this.projectsChart) {
      this.projectsChart.destroy();
    }

    const data = this.projectsTicketStats.map(p => p.ticketCount ?? 0);
    const total = data.reduce((sum, val) => sum + val, 0);

    this.projectsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.projectsTicketStats.map(p => p.projectName || 'Projet sans nom'),
        datasets: [{
          label: 'Nombre de tickets',
          data: data,
          backgroundColor: this.projectsTicketStats.map(p => this.getChartColor(p.projectName)),
          borderColor: 'rgba(255, 255, 255, 0.8)',
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                return `${context.label}: ${value} (${percentage}%)`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { 
              precision: 0,
              stepSize: 1
            }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }

 createAvgResolutionChart(): void {
  const ctx = document.getElementById('avgResolutionChart') as HTMLCanvasElement;

  // Vérifier si les données sont dans le format attendu
  if (!this.avgResolutionTime || !ctx) return;

  // Extraire les données selon le format de l'API
  let data: { projectName: string, avgHours: number }[] = [];
  
  if (Array.isArray(this.avgResolutionTime.data)) {
    // Format depuis l'API (comme dans ololo.PNG)
    data = this.avgResolutionTime.data;
  } else if (Array.isArray(this.avgResolutionTime)) {
    // Format alternatif
    data = this.avgResolutionTime;
  } else {
    console.error('Format de données non reconnu pour avgResolutionTime', this.avgResolutionTime);
    return;
  }

  // Créer le graphique
  new Chart(ctx, {
    type: 'bar', // Changé de 'line' à 'bar' pour meilleure lisibilité
    data: {
      labels: data.map(item => item.projectName),
      datasets: [{
        label: 'Temps Moyen de Résolution (heures)',
        data: data.map(item => item.avgHours),
        backgroundColor: data.map(item => this.getChartColor(item.projectName)),
        borderColor: '#4e73df',
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Heures'
          },
          ticks: {
            precision: 1
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: { 
          display: false 
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              return `${context.parsed.y} heures`;
            }
          }
        }
      }
    }
  });
}
  createComplexityChart(): void {
  const ctx = document.getElementById('complexityChart') as HTMLCanvasElement;

  if (!this.complexityVsEstimate || !ctx || this.complexityVsEstimate.length === 0) {
    console.warn('Données de complexité manquantes ou format incorrect');
    return;
  }

  // Vérifier si les données contiennent 'ratio' ou 'estimated'
  const hasRatio = this.complexityVsEstimate.some(item => 'ratio' in item);
  const yAxisKey = hasRatio ? 'ratio' : 'estimated';

  // Préparer les données
  const dataPoints = this.complexityVsEstimate.map(item => ({
    x: item.complexity,
    y: item[yAxisKey],
    title: item.title || `Ticket ${item.complexity}`
  }));

  // Créer le graphique
  new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Ratio Complexité/Temps',
        data: dataPoints,
        backgroundColor: 'rgba(78, 115, 223, 0.8)',
        borderColor: '#4e73df',
        borderWidth: 1,
        pointRadius: 8,
        pointHoverRadius: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: { 
            display: true, 
            text: 'Complexité',
            font: {
              weight: 'bold'
            }
          },
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            precision: 0
          }
        },
        y: {
          title: { 
            display: true, 
            text: 'Ratio Temps Réel/Estimé',
            font: {
              weight: 'bold'
            }
          },
          beginAtZero: true
        }
      },
      plugins: {
        legend: { 
          display: false 
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const point = dataPoints[context.dataIndex];
              return [
                `Ticket: ${point.title}`,
                `Complexité: ${point.x}`,
                `Ratio: ${point.y.toFixed(2)}`
              ];
            }
          }
        }
      }
    }
  });
}
  createUsersPerTeamChart(): void {
    const ctx = document.getElementById('usersPerTeamChart') as HTMLCanvasElement;

    if (this.usersPerTeam && ctx) {
      const teamNames = Object.keys(this.usersPerTeam);
      const usersCount = teamNames.map(team => this.usersPerTeam[team]);

      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: teamNames,
          datasets: [{
            label: 'Users Per Team',
            data: usersCount,
            backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#6610f2'],
            borderWidth: 1,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            tooltip: {
              callbacks: {
                label: (context) => `${context.label}: ${context.raw} users`,
              },
            },
          },
        },
      });
    }
  }

  loadAllData(): void {
    this.isLoadingStats = true;
    this.isLoadingAssignments = true;

    this.ticketService.getStatusStatistics().subscribe({
      next: (stats) => {
        this.statusStats = Object.entries(stats).map(([status, count]) => ({ status, count: count as number }));
        this.createStatusChart();
        this.isLoadingStats = false;
      },
      error: (err) => {
        console.error('Error loading status stats', err);
        this.isLoadingStats = false;
      }
    });

    this.ticketService.getResolvedClosedTickets().subscribe({
      next: (tickets) => {
        this.recentResolvedTickets = tickets?.slice(0, 5) || [];
      }
    });

    this.loadProjects();
    this.loadAssignmentStats();
  }

  loadProjects(): void {
    this.ticketService.getProjects().subscribe({
      next: (data) => this.projects = data,
      error: (err) => console.error('Error loading projects', err)
    });
  }

  loadAssignmentStats(): void {
    this.isLoadingAssignments = true;
    this.ticketService.getUserAssignmentStats().subscribe({
      next: (stats: any) => {
        const apiStats = Array.isArray(stats) ? 
          stats as ApiAssignmentStat[] : 
          this.convertObjectToArray(stats);

        this.processAssignmentStats(apiStats);
        this.isLoadingAssignments = false;
      },
      error: (err) => {
        console.error('Error loading assignment stats', err);
        this.isLoadingAssignments = false;
      }
    });
  }

  private convertObjectToArray(stats: { [key: string]: number }): ApiAssignmentStat[] {
    console.log('testing in convertObjectToArray ');
    
    return Object.entries(stats).map(([userId, ticketCount]) => ({
      userId: parseInt(userId),
      userName: `User ${userId}`,
      ticketCount
    }));
  }

  private processAssignmentStats(rawStats: ApiAssignmentStat[]): void {
    this.assignmentStats = rawStats.map(item => ({
      userId: item.userId.toString(),
      count: item.ticketCount,
      user: {
        email: item.userName,
        firstname: item.userName.split('@')[0] 
      }
    }));
    this.createAssignmentChart();
  }

  createStatusChart(): void {
    const ctx = document.getElementById('statusChart') as HTMLCanvasElement;

    if (this.statusChart) {
      this.statusChart.destroy();
    }

    this.statusChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.statusStats.map(item => item.status),
        datasets: [{
          label: 'Nombre de Tickets',
          data: this.statusStats.map(item => item.count),
          backgroundColor: 'rgba(78, 115, 223, 0.05)',
          borderColor: '#4e73df',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#4e73df',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'white',
            titleColor: '#2d3748',
            bodyColor: '#4a5568',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.parsed.y}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { 
              precision: 0,
              color: '#718096'
            },
            grid: {
              color: 'rgba(226, 232, 240, 0.5)'
            }
          },
          x: {
            ticks: {
              color: '#718096'
            },
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  getStatusCount(status: string): number {
    const stat = this.statusStats.find(s => s.status === status);
    return stat ? stat.count : 0;
  }

  getUserInitials(stat: AssignmentStat): string {
    if (stat.user?.firstname && stat.user?.lastname) {
      return `${stat.user.firstname.charAt(0)}${stat.user.lastname.charAt(0)}`.toUpperCase();
    }
    if (stat.user?.email) {
      return stat.user.email.charAt(0).toUpperCase();
    }
    return 'U';
  }

  createAssignmentChart(): void {
    const ctx = document.getElementById('assignmentChart') as HTMLCanvasElement;

    if (this.assignmentChart) {
      this.assignmentChart.destroy();
    }

    this.assignmentChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.assignmentStats.map(s => this.getUserName(s)),
        datasets: [{
          label: 'Tickets Assignés',
          data: this.assignmentStats.map(s => s.count),
          backgroundColor: 'rgba(246, 194, 62, 0.8)',
          borderColor: 'rgba(246, 194, 62, 1)',
          borderWidth: 0,
          borderRadius: 4,
          borderSkipped: false
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
          legend: { display: false },
          tooltip: {
            backgroundColor: 'white',
            titleColor: '#2d3748',
            bodyColor: '#4a5568',
            borderColor: '#e2e8f0',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { 
              precision: 0,
              color: '#718096'
            },
            grid: {
              color: 'rgba(226, 232, 240, 0.5)'
            }
          },
          y: {
            ticks: {
              color: '#718096'
            },
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  getProjectName(projectId: number | undefined): string {
    const project = this.projects.find((p) => p.project_id === projectId);
    return project?.name || 'Inconnu';
  }

  getTotalTickets(): number {
    return this.statusStats.reduce((total, stat) => total + stat.count, 0);
  }

  getUserName(stat: AssignmentStat): string {
    if (stat.user) {
      return [stat.user.firstname, stat.user.lastname].filter(Boolean).join(' ') || stat.user.email || `User ${stat.userId}`;
    }
    return `User ${stat.userId}`;
  }

  getMaxAssignment(): number {
    return Math.max(...this.assignmentStats.map(s => s.count), 1);
  }

  getMaxProjectTickets(): number {
    return Math.max(...this.projectsTicketStats.map(p => p.ticketCount), 1);
  }
  toggleChartType(): void {
  this.currentChartType = this.currentChartType === 'bar' ? 'line' : 'bar';
  this.createUserPerformanceChart(); // Re-crée le graphique
}
togglePerformanceChart(): void {
  this.showPerformanceChart = !this.showPerformanceChart;
}

}
