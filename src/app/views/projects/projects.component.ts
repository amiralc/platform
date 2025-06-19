import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
<<<<<<< HEAD
import { ProjectService, Project, OrganizationNode, Team } from '../../services/project.service';
import { ToastrService } from 'ngx-toastr';
import { OrganizationHierarchyComponent } from 'src/app/hierarchy-display/hierarchy-display.component';
=======
import { ProjectService, Project,TeamMember } from '../../services/project.service';
import {  ToastrService } from 'ngx-toastr';

>>>>>>> 9908b23afbe3f23f03b50f8a29b8e271c01a35ce

@Component({
  selector: 'app-projects',
  standalone: true,
<<<<<<< HEAD
  imports: [
    CommonModule,
    FormsModule,
    OrganizationHierarchyComponent
  ],
=======
   imports: [
    CommonModule, 
    FormsModule, 
     
    
  ],
  
>>>>>>> 9908b23afbe3f23f03b50f8a29b8e271c01a35ce
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
<<<<<<< HEAD
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  availableTeams: Team[] = [];
  organizationHierarchy: OrganizationNode[] = [];
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
    // Appel réel à l'API si besoin ici
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

  // ------------------ TEAM & HIERARCHY ------------------

viewTeam(project: Project): void {
  this.selectedProject = project;
  this.isTeamModalOpen = true;
  
  if (!project.workedOn) {
    this.loadAvailableTeams();
  } else {
    this.loadTeamHierarchy(project.project_id);
  }
}
  loadTeamHierarchy(projectId: number): void {
    this.projectService.getProjectTeamHierarchy(projectId).subscribe({
      next: (hierarchy) => {
        this.organizationHierarchy = hierarchy;
      },
      error: (err) => {
        console.warn('Could not load hierarchy, using fallback structure');
        this.createFallbackHierarchy();
=======
  searchTerm: string = '';
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  showForm = false;
  isModalOpen = false;
  isCreateModalOpen = false;
   isTeamModalOpen = false;
  selectedProject: Project = {
    project_id: 0,
    name: '',
    description: '',
    tickets: [],
      team: []
  };
   selectedTeam: TeamMember[] = [];
  manager: TeamMember | null = null;
  newProject: Partial<Project> = {
    name: '',
    description: ''
  };

  constructor(private projectService: ProjectService,private toastr: ToastrService)
   
   {}

  ngOnInit(): void {
    this.loadProjects();
    this.toastr.success('Toast service works!', 'Test');
  }
    openCreateModal(): void {
    this.isCreateModalOpen = true;
    document.body.style.overflow = 'hidden';
    this.newProject = { name: '', description: '' }; 
  }
   closeCreateModal(): void {
    this.isCreateModalOpen = false;
    document.body.style.overflow = '';
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.filteredProjects = [...this.projects];
      },
      error: (err) => {
        console.error('Error loading projects:', err);
>>>>>>> 9908b23afbe3f23f03b50f8a29b8e271c01a35ce
      }
    });
  }

<<<<<<< HEAD
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
        this.handleTeamAssignmentSuccess(updatedProject);
      },
      error: (err) => this.showError('Failed to assign team', err)
    });
  }

  private handleTeamAssignmentSuccess(project: Project): void {
    this.selectedProject = project;
    this.isAssignTeamModalOpen = false;
    this.toastr.success('Team assigned successfully!', 'Success');
    this.loadTeamHierarchy(project.project_id);
    this.loadProjects();
  }

  private createFallbackHierarchy(): void {
    if (this.selectedProject.workedOn) {
      this.organizationHierarchy = [{
        id: this.selectedProject.workedOn.managedBY.user_id,
        name: this.selectedProject.workedOn.managedBY.fullName || 'Manager',
        title: 'Team Manager',
        photoUrl: this.selectedProject.workedOn.managedBY.photoUrl,
        children: this.selectedProject.workedOn.members.map(member => ({
          id: member.user_id,
          name: member.fullName || 'Member',
          title: member.roles[0]?.name || 'Team Member',
          photoUrl: member.photoUrl
        }))
      }];
    }
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

=======
>>>>>>> 9908b23afbe3f23f03b50f8a29b8e271c01a35ce
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

<<<<<<< HEAD
  trackByProjectId(index: number, project: Project): number {
    return project.project_id;
  }
}
=======
  openEditModal(project: Project): void {
    
    this.selectedProject = { ...project };
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }


 closeModal(): void {
    this.isModalOpen = false;
    
    this.selectedProject = {
      project_id: 0,
      name: '',
      description: '',
      tickets: [],
       team: []
    };
    document.body.style.overflow = '';
  }

  createProject(): void {
    if (!this.newProject.name || !this.newProject.description) {
      this.toastr.error('Please fill all fields!', 'Error');
      return;
    }

    this.projectService.createProject(this.newProject as Project).subscribe({
      next: (createdProject) => {
        this.projects.push(createdProject);
        this.filterProjects();
        this.newProject = { name: '', description: '' };
        this.closeCreateModal();  
        this.toastr.success('Project created successfully!', 'Success');
      },
      error: (err) => {
        this.closeCreateModal();  
        this.toastr.error('Failed to create project', 'Error');
        console.error('Error creating project:', err);
      }
    });
  }

  updateProject(): void {
    if (!this.selectedProject) return;

    this.projectService.updateProject(this.selectedProject.project_id, this.selectedProject).subscribe({
      next: (updatedProject) => {
        const index = this.projects.findIndex(p => p.project_id === updatedProject.project_id);
        if (index !== -1) {
          this.projects[index] = updatedProject;
          this.filterProjects();
        }
        this.closeModal();
      },
      error: (err) => {
        console.error('Error updating project:', err);
      }
    });
  }

  confirmDelete(projectId: number): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(projectId).subscribe({
        next: () => {
          this.projects = this.projects.filter(p => p.project_id !== projectId);
          this.filterProjects();
        },
        error: (err) => {
          console.error('Error deleting project:', err);
        }
      });
    }
  }
    viewTeam(project: Project): void {
    this.selectedProject = { ...project };
    this.selectedTeam = project.team;

    this.manager = this.selectedTeam.find(member => member.role === 'MANAGER') || null;
    this.isTeamModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeTeamModal(): void {
    this.isTeamModalOpen = false;
    document.body.style.overflow = '';
    this.selectedTeam = [];
    this.manager = null;
  }

  trackByProjectId(index: number, project: Project): number {
    return project.project_id;
  }
}
>>>>>>> 9908b23afbe3f23f03b50f8a29b8e271c01a35ce
