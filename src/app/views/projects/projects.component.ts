import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService, Project, Team, User } from '../../services/project.service';
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
  projectToAssignTeam: Project | null = null;

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
        console.log('Projects with tickets:', projects);
        this.projects = projects;
        this.filteredProjects = [...projects];
      },
      error: (err) => this.showError('Failed to load projects', err)
    });
  }
  getTicketDisplay(ticket: any): string {
  if (typeof ticket === 'string') return ticket;
  if (ticket.title) return ticket.title;
  if (ticket.name) return ticket.name;
  if (ticket.id) return `Ticket #${ticket.id}`;
  return 'Ticket';
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
      next: (createdProject) => {
        this.toastr.success('Project created successfully!', 'Success');
        this.newProject = this.createEmptyProject();
        this.closeCreateModal();
        this.openAssignTeamModal(createdProject);
      },
      error: (err) => this.showError('Failed to create project', err)
    });
  }

  openAssignTeamModal(project: Project): void {
    this.projectToAssignTeam = project;
    this.projectService.getAvailableTeams().subscribe({
      next: (teams) => {
        this.availableTeams = teams;
        this.isAssignTeamModalOpen = true;
      },
      error: (err) => this.showError('Failed to load teams', err)
    });
  }

  assignTeam(project: Project): void {
    if (!this.selectedTeamId) {
      this.toastr.warning('Please select a team first', 'Warning');
      return;
    }

    this.projectService.assignProjectToTeam(project.project_id, this.selectedTeamId).subscribe({
      next: (updatedProject) => {
        this.toastr.success('Team assigned successfully!', 'Success');

        // Met à jour le projet correct selon le contexte
        if (this.projectToAssignTeam && project.project_id === this.projectToAssignTeam.project_id) {
          this.projectToAssignTeam = null;
          this.isAssignTeamModalOpen = false;
        }
        if (this.selectedProject && project.project_id === this.selectedProject.project_id) {
          this.selectedProject = updatedProject;
          this.isAssignTeamModalOpen = false;
        }

        this.selectedTeamId = null;
        this.loadProjects();
      },
      error: (err) => this.showError('Failed to assign team', err)
    });
  }


  assignTeamToProject(): void {
    if (this.projectToAssignTeam) {
      this.assignTeam(this.projectToAssignTeam);
    } else {
      this.assignTeam(this.selectedProject);
    }
  }

  closeTeamModal(): void {
    this.isTeamModalOpen = false;
    this.isAssignTeamModalOpen = false;
    this.selectedTeamId = null;
    this.projectToAssignTeam = null;
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
    if (!token) {
      this.toastr.error('Authentication required', 'Error');
      return;
    }

    if (!this.selectedUserId || !this.selectedProject.workedOn) {
      this.toastr.warning('Please select a user first', 'Warning');
      return;
    }

    this.projectService.assignUserToTeam(
      this.selectedUserId,
      this.selectedProject.workedOn.team_id,
      token
    ).subscribe({
      next: (responseText: string) => {
        this.toastr.success(responseText, 'Success');
        this.loadTeamData();
        this.closeAddMemberModal();
      },
      error: (err) => this.showError('Failed to add member', err)
    });
  }

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
