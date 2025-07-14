import { Component, OnInit } from '@angular/core';
import { TicketJiraService } from '../../services/ticket-jira.service';
import { ProjectService } from '../../services/project.service';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatisticsService } from '../../services/statistics.service';

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

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class StatisticsComponent implements OnInit {
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

  constructor(
    private ticketService: TicketJiraService,
    private projectService: ProjectService,
    private statsService: StatisticsService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadAllData();
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

    if (this.avgResolutionTime && ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: Object.keys(this.avgResolutionTime),
          datasets: [{
            label: 'Average Resolution Time',
            data: Object.values(this.avgResolutionTime),
            backgroundColor: 'rgba(78, 115, 223, 0.05)',
            borderColor: '#4e73df',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: { precision: 0 },
            },
          },
          plugins: {
            legend: { position: 'top' },
            tooltip: {
              callbacks: {
                label: (context) => `Avg Resolution Time: ${context.raw} days`,
              },
            },
          },
        },
      });
    }
  }

  createComplexityChart(): void {
    const ctx = document.getElementById('complexityChart') as HTMLCanvasElement;

    if (this.complexityVsEstimate && ctx) {
      const complexities = this.complexityVsEstimate.map(item => item.complexity);
      const estimated = this.complexityVsEstimate.map(item => item.estimated);
      
      new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [{
            label: 'Complexity vs Estimated',
            data: complexities.map((c, i) => ({ x: c, y: estimated[i] })),
            backgroundColor: 'rgba(78, 115, 223, 1)',
            borderColor: '#4e73df',
            borderWidth: 1,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: { display: true, text: 'Complexity' },
              beginAtZero: true,
            },
            y: {
              title: { display: true, text: 'Estimated Time' },
              beginAtZero: true,
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const point = context.raw as { x: number, y: number };
                  return `Complexity: ${point.x}, Estimated: ${point.y} hours`;
                },
              },
            },
          },
        },
      });
    }
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
}