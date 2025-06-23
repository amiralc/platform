import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService, Project, Team,User } from '../../services/project.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  availableTeams: Team[] = [];
  searchTerm: string = '';

  // Modal states
  isTeamModalOpen = false;
  isAssignTeamModalOpen = false;
  isModalOpen = false;
  isCreateModalOpen = false;

  // Selected data
  selectedProject: Project = this.createEmptyProject();
  selectedTeamId: number | null = null;
  newProject: Project = this.createEmptyProject();
  isAddMemberModalOpen = false;
availableUsers: User[] = [];
selectedUserId: number | null = null;


  constructor(
    private projectService: ProjectService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  // ------------------ CRUD PROJECTS ------------------

  loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.filteredProjects = [...projects];
      },
      error: (err) => this.showError('Failed to load projects', err)
    });
  }

  openCreateModal(): void {
    this.newProject = this.createEmptyProject();
    this.isCreateModalOpen = true;
  }

  closeCreateModal(): void {
    this.isCreateModalOpen = false;
  }

  createProject(): void {
    this.projectService.createProject(this.newProject).subscribe({
      next: () => {
        this.toastr.success('Project created successfully!', 'Success');
        this.closeCreateModal();
        this.loadProjects();
      },
      error: (err) => this.showError('Failed to create project', err)
    });
  }

  openEditModal(project: Project): void {
    this.selectedProject = { ...project };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  updateProject(): void {
    this.projectService.updateProject(this.selectedProject.project_id, this.selectedProject).subscribe({
      next: () => {
        this.toastr.success('Project updated successfully!', 'Success');
        this.closeModal();
        this.loadProjects();
      },
      error: (err) => this.showError('Failed to update project', err)
    });
  }

  confirmDelete(projectId: number): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(projectId).subscribe({
        next: () => {
          this.toastr.warning('Project deleted', 'Deleted');
          this.loadProjects();
        },
        error: (err) => this.showError('Failed to delete project', err)
      });
    }
  }

  // ------------------ TEAM MANAGEMENT ------------------

  viewTeam(project: Project): void {
    this.selectedProject = project;
    this.isTeamModalOpen = true;
    
    if (!project.workedOn) {
      this.loadAvailableTeams();
    }
  }

  loadAvailableTeams(): void {
    this.projectService.getAvailableTeams().subscribe({
      next: (teams) => {
        this.availableTeams = teams;
        this.isAssignTeamModalOpen = true;
      },
      error: (err) => {
        this.toastr.error('Failed to load teams', 'Error');
        console.error(err);
      }
    });
  }

  assignTeamToProject(): void {
    if (!this.selectedTeamId) {
      this.toastr.warning('Please select a team first', 'Warning');
      return;
    }

    this.projectService.assignProjectToTeam(
      this.selectedProject.project_id,
      this.selectedTeamId
    ).subscribe({
      next: (updatedProject) => {
        this.selectedProject = updatedProject;
        this.isAssignTeamModalOpen = false;
        this.toastr.success('Team assigned successfully!', 'Success');
        this.loadProjects();
      },
      error: (err) => this.showError('Failed to assign team', err)
    });
  }

  closeTeamModal(): void {
    this.isTeamModalOpen = false;
    this.isAssignTeamModalOpen = false;
    this.selectedTeamId = null;
  }

  // ------------------ UTILS ------------------

  private createEmptyProject(): Project {
    return {
      project_id: 0,
      name: '',
      description: '',
      tickets: [],
      workedOn: null
    };
  }

  private showError(message: string, error: any): void {
    this.toastr.error(message, 'Error');
    console.error(`${message}:`, error);
  }

  getManagerPhoto(): string {
    return this.selectedProject.workedOn?.managedBY?.photoUrl ||
      'assets/images/default-avatar.png';
  }

  getMemberPhoto(member: any): string {
    return member.photoUrl || 'assets/images/default-avatar.png';
  }

  filterProjects(): void {
    if (!this.searchTerm) {
      this.filteredProjects = [...this.projects];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredProjects = this.projects.filter(project =>
      project.name.toLowerCase().includes(term) ||
      project.description.toLowerCase().includes(term)
    );
  }
  openAddMemberModal(): void {
  this.projectService.getAvailableUsers().subscribe({
    next: (users) => {
      this.availableUsers = users;
      console.log(users)
      this.isAddMemberModalOpen = true;
    },
    error: (err) => this.showError('Failed to load users', err)
  });
}
closeAddMemberModal(): void {
  this.isAddMemberModalOpen = false;
  this.selectedUserId = null;
}
getCurrentTeamId(): number | null {
  return this.selectedProject.workedOn?.team_id || null;
}
addMemberToTeam(): void {
  const token = localStorage.getItem('token');
  console.log("Token utilisé :", token); // Ou votre méthode de récupération du token
  if (!token) {
    this.toastr.error('Authentication required', 'Error');
    return;
  }

  if (!this.selectedUserId || !this.selectedProject.workedOn) {
    this.toastr.warning('Please select a user first', 'Warning');
    return;
  }
console.log("selected user id",this.selectedUserId)
console.log("selected project worked on team", this.selectedProject.workedOn.team_id)
  this.projectService.assignUserToTeam(
    this.selectedUserId,
    this.selectedProject.workedOn.team_id,
    token
  ).subscribe({
    next: () => {
      this.toastr.success('Member added successfully!', 'Success');
      // Recharger les données de l'équipe
      this.loadTeamData();
      this.closeAddMemberModal();
    },
    error: (err) => this.showError('Failed to add member', err)
  });
}

// Méthode pour recharger les données de l'équipe
private loadTeamData(): void {
  if (this.selectedProject?.project_id) {
    this.projectService.getProjectById(this.selectedProject.project_id).subscribe({
      next: (project) => {
        this.selectedProject = project;
      },
      error: (err) => this.showError('Failed to refresh team data', err)
    });
  }
}

  trackByProjectId(index: number, project: Project): number {
    return project.project_id;
  }
}