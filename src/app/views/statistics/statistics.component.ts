import { Component, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  standalone: true,
})
export class StatisticsComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    this.renderBarChart();
    this.renderPieChart();
    this.renderLineChart();
    this.renderDoughnutChart();
    this.renderRadarChart();
    this.renderHorizontalBarChart();
  }

  renderBarChart() {
    new Chart('barChart', {
      type: 'bar',
      data: {
        labels: ['Alice', 'Bob', 'Charlie', 'Diana'],
        datasets: [{
          label: 'Tâches terminées',
          data: [12, 19, 7, 14],
          backgroundColor: 'rgba(75, 192, 192, 0.6)'
        }]
      },
      options: {
        responsive: true,
      }
    });
  }

  renderPieChart() {
    new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: ['Facile', 'Moyenne', 'Difficile'],
        datasets: [{
          data: [10, 15, 5],
          backgroundColor: ['#FFCE56', '#36A2EB', '#FF6384']
        }]
      },
      options: { responsive: true }
    });
  }

  renderLineChart() {
    new Chart('lineChart', {
      type: 'line',
      data: {
        labels: ['Alice', 'Bob', 'Charlie', 'Diana'],
        datasets: [{
          label: 'Temps moyen (h)',
          data: [3.5, 4.2, 2.8, 5.0],
          fill: false,
          borderColor: 'rgba(153, 102, 255, 0.6)',
          tension: 0.4
        }]
      },
      options: { responsive: true }
    });
  }

  renderDoughnutChart() {
    new Chart('doughnutChart', {
      type: 'doughnut',
      data: {
        labels: ['Complétées', 'En cours', 'En attente'],
        datasets: [{
          data: [40, 30, 30],
          backgroundColor: ['#4BC0C0', '#FFCE56', '#FF6384']
        }]
      },
      options: { responsive: true }
    });
  }

  renderRadarChart() {
    new Chart('radarChart', {
      type: 'radar',
      data: {
        labels: ['En retard', 'Dans les temps'],
        datasets: [{
          label: 'État des tâches',
          data: [15, 85],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: { responsive: true }
    });
  }

  renderHorizontalBarChart() {
    new Chart('horizontalBarChart', {
      type: 'bar',
      data: {
        labels: ['En cours', 'Terminées', 'En attente'],
        datasets: [{
          data: [50, 100, 25],
          label: 'Tâches',
          backgroundColor: ['#FFCE56', '#4BC0C0', '#FF6384']
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
      }
    });
  }
}
