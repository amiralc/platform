import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // <-- importer CommonModule

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule],  // <-- ajouter CommonModule ici
})
export class DashboardComponent {
  totalTasks = 150;
  totalProjects = 12;
  activeMembers = 7;

  completedTaskPercentage = 68;

  ongoingProjects = [
    { name: 'Intranet RH', progress: 45 },
    { name: 'Portail Client', progress: 72 },
    { name: 'Analyse des ventes', progress: 90 },
    { name: 'Application Mobile', progress: 30 },
    { name: 'Migration Cloud', progress: 55 },
  ];

  todayTasks = [
    'Réunion sprint à 10h',
    'Valider les tickets JIRA',
    'Analyser le backlog du projet X',
    'Envoyer rapport hebdomadaire',
    'Planifier la démo client',
  ];

  recentActivities = [
    'Alice a terminé la tâche "Déploiement"',
    'Nouveau projet "CRM Client" créé',
    'Bob a mis à jour la tâche "Design UI"',
    'Mise à jour de la roadmap projet',
    'Réunion équipe marketing réalisée',
  ];
}
