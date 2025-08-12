import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { StatisticsService } from '../../services/statistics.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class StatisticsComponent implements OnInit {

  complexityVsEstimate: any[] = [];
  projectsPerTeam: any[] = [];

  constructor(private statsService: StatisticsService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    // Complexité
    this.statsService.getComplexityVsEstimated().subscribe(data => {
        console.log('Projects per team data:', data);
      this.complexityVsEstimate = data;
      this.createComplexityChart();
    });

    // Projets par équipe
    this.statsService.getProjectsPerTeam().subscribe(data => {
      this.projectsPerTeam = data;
      this.createProjectsPerTeamChart();
    });
  }

  createComplexityChart(): void {
    const ctx = document.getElementById('complexityChart') as HTMLCanvasElement;
    if (!this.complexityVsEstimate?.length || !ctx) return;

    const hasRatio = this.complexityVsEstimate.some(item => 'ratio' in item);
    const yAxisKey = hasRatio ? 'ratio' : 'estimated';

    const dataPoints = this.complexityVsEstimate.map(item => ({
      x: item.complexity,
      y: item[yAxisKey],
      title: item.title || `Ticket ${item.complexity}`
    }));

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
        maintainAspectRatio: false
      }
    });
  }

  createProjectsPerTeamChart(): void {
    const ctx = document.getElementById('projectsPerTeamChart') as HTMLCanvasElement;
    if (!this.projectsPerTeam?.length || !ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.projectsPerTeam.map(item => item.teamName),
        datasets: [{
          label: 'Number of Projects',
          data: this.projectsPerTeam.map(item => item.projectCount),
          backgroundColor: 'rgba(40, 167, 69, 0.7)',
          borderColor: '#28a745',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Projects Count' }
          },
          x: {
            title: { display: true, text: 'Teams' }
          }
        }
      }
    });
  }

}
