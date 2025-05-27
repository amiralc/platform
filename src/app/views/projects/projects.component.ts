import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService, Project } from '../../services/project.service';
import {  ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-projects',
  standalone: true,
   imports: [
    CommonModule, 
    FormsModule, 
     
    
  ],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  searchTerm: string = '';
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  showForm = false;
  isModalOpen = false;
  isCreateModalOpen = false;
  selectedProject: Project = {
    project_id: 0,
    name: '',
    description: '',
    tickets: []
  };
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
      }
    });
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
      tickets: []
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

  trackByProjectId(index: number, project: Project): number {
    return project.project_id;
  }
}