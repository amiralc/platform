import { Component, OnInit } from '@angular/core';
import { TicketJiraService } from '../../services/ticket-jira.service';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class StatisticsComponent implements OnInit {
  statusStats: { status: string, count: number }[] = [];
  recentResolvedTickets: any[] = [];
  projects: any[] = [];
  chart: any;

  constructor(private ticketService: TicketJiraService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadStatistics();
    this.loadRecentResolved();
     this.loadProjects();
  }
  loadProjects(): void {
    this.ticketService.getProjects().subscribe({
      next: (data) => this.projects = data,
      error: (err) => console.error('Error loading projects', err)
    });
  }
    getProjectName(projectId: number | undefined): string {
    const project = this.projects.find((p) => p.project_id === projectId);
    return project?.name || 'Inconnu';
  }
    getTotalTickets(): number {
    return this.statusStats.reduce((total, stat) => total + stat.count, 0);
  }
  loadStatistics(): void {
    this.ticketService.getStatusStatistics().subscribe({
      next: (stats) => {
        this.statusStats = Object.entries(stats).map(([status, count]) => ({ status, count }));
        this.createChart();
      },
      error: (err) => console.error('Error loading stats', err)
    });
  }

  loadRecentResolved(): void {
    this.ticketService.getResolvedClosedTickets().subscribe({
      next: (tickets) => this.recentResolvedTickets = tickets.slice(0, 5),
      error: (err) => console.error('Error loading resolved tickets', err)
    });
  }

  createChart(): void {
    const ctx = document.getElementById('statusChart') as HTMLCanvasElement;
    
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.statusStats.map(item => item.status),
        datasets: [{
          label: 'Number of Tickets',
          data: this.statusStats.map(item => item.count),
          backgroundColor: [
            'rgba(108, 117, 125, 0.7)', // OPEN - gris
            'rgba(13, 110, 253, 0.7)',   // IN_PROGRESS - bleu
            'rgba(25, 135, 84, 0.7)',    // RESOLVED - vert
            'rgba(220, 53, 69, 0.7)'     // CLOSED - rouge
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
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.parsed.y} tickets`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });
  }
}