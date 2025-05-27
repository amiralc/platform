import { Component, AfterViewInit } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';


Chart.register(...registerables);

@Component({
  selector: 'app-statistics',
  standalone: true,
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements AfterViewInit {

  ngAfterViewInit() {
    
    const tasksPerMember = {
      labels: ['Alice', 'Bob', 'Charlie', 'Diana'],
      data: [12, 19, 7, 14]
    };
    const barConfig: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: tasksPerMember.labels,
        datasets: [{
          label: 'Tâches terminées',
          data: tasksPerMember.data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          title: {
            display: true,
            text: 'Nombre de tâches terminées par membre'
          }
        }
      }
    };
    new Chart('barChart', barConfig);

    
    const complexityData = {
      labels: ['Facile', 'Moyenne', 'Difficile'],
      data: [10, 15, 5]
    };
    const pieConfig: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: complexityData.labels,
        datasets: [{
          label: 'Complexité des tâches',
          data: complexityData.data,
          backgroundColor: [
            'rgba(255, 206, 86, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 99, 132, 0.6)'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: {
            display: true,
            text: 'Répartition des tâches par complexité'
          }
        }
      }
    };
    new Chart('pieChart', pieConfig);

    // 3. Temps moyen passé par tâche par membre 
    const avgTimePerTask = {
      labels: ['Alice', 'Bob', 'Charlie', 'Diana'],
      data: [3.5, 4.2, 2.8, 5.0]
    };
    const avgTimeBarConfig: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: avgTimePerTask.labels,
        datasets: [{
          label: 'Temps moyen passé (heures)',
          data: avgTimePerTask.data,
          backgroundColor: 'rgba(153, 102, 255, 0.6)'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          title: {
            display: true,
            text: 'Temps moyen passé par tâche (heures)'
          }
        }
      }
    };
    new Chart('avgTimeBarChart', avgTimeBarConfig);

    
    const taskProgressData = {
      labels: ['Complétées', 'En cours', 'En attente'],
      data: [40, 30, 30]
    };
    const progressDoughnutConfig: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: taskProgressData.labels,
        datasets: [{
          label: 'Progression des tâches',
          data: taskProgressData.data,
          backgroundColor: [
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(255, 99, 132, 0.7)'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: {
            display: true,
            text: 'Progression des tâches en pourcentage'
          }
        }
      }
    };
    new Chart('progressDoughnutChart', progressDoughnutConfig);

    const delayData = {
      labels: ['En retard', 'Dans les temps'],
      data: [15, 85]
    };
    const delayPieConfig: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: delayData.labels,
        datasets: [{
          label: 'Tâches en retard vs dans les temps',
          data: delayData.data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: {
            display: true,
            text: 'Tâches en retard vs dans les temps'
          }
        }
      }
    };
    new Chart('delayPieChart', delayPieConfig);

    
    const tasksByStatus = {
      labels: ['En cours', 'Terminées', 'En attente'],
      data: [50, 100, 25]
    };
    const statusBarConfig: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: tasksByStatus.labels,
        datasets: [{
          label: 'Nombre de tâches',
          data: tasksByStatus.data,
          backgroundColor: [
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 99, 132, 0.6)'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Répartition des tâches par état'
          }
        }
      }
    };
    new Chart('statusBarChart', statusBarConfig);
  }
}
