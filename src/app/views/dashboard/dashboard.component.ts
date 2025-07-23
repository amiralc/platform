import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  kpis = {
    totalEmployees: 0,
    totalProjects: 0
  };
  projects: any[] = [];
  isLoading = false;

  constructor(
    private statsService: StatisticsService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.loadKPIs();
    this.loadProjects();
  }

  loadKPIs(): void {
    this.isLoading = true;
    this.statsService.getBasicKPIs().subscribe({
      next: (data) => {
        this.kpis = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading KPIs', err);
        this.isLoading = false;
      }
    });
  }

  loadProjects(): void {
    this.isLoading = true;
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading projects', err);
        this.isLoading = false;
      }
    });
  }

  getTicketCount(project: any): number {
    return project.tickets?.length || 0;
  }
 
}