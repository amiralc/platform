import { Component, OnInit } from '@angular/core';
import { TicketJiraService } from '../../services/ticket-jira.service';
import { ProjectService, User } from '../../services/project.service';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  // Données des statistiques
  statusStats: StatusStat[] = [];
  recentResolvedTickets: any[] = [];
  projects: any[] = [];
  assignmentStats: AssignmentStat[] = [];
  
  // États de chargement
  isLoadingStats = false;
  isLoadingAssignments = false;
  
  // Graphiques
  statusChart: any;
  assignmentChart: any;

  constructor(
    private ticketService: TicketJiraService,
    private projectService: ProjectService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.isLoadingStats = true;
    this.isLoadingAssignments = true;

    // Chargement parallèle des données
    this.ticketService.getStatusStatistics().subscribe({
      next: (stats) => {
        this.statusStats = Object.entries(stats).map(([status, count]) => ({ status, count }));
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
        this.recentResolvedTickets = tickets.slice(0, 5);
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
        // Conversion des données si nécessaire
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
        firstname: item.userName.split('@')[0] // Extraction du prénom depuis l'email
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
      type: 'bar',
      data: {
        labels: this.statusStats.map(item => item.status),
        datasets: [{
          label: 'Number of Tickets',
          data: this.statusStats.map(item => item.count),
          backgroundColor: [
            'rgba(108, 117, 125, 0.7)',
            'rgba(13, 110, 253, 0.7)',
            'rgba(25, 135, 84, 0.7)',
            'rgba(220, 53, 69, 0.7)'
          ],
          borderColor: [
            '#6c757d',
            '#0d6efd',
            '#198754',
            '#dc3545'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `${context.parsed.y} tickets`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0 }
          }
        }
      }
    });
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
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { precision: 0 }
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
}