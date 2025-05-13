import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ProjectService,Project } from '../../services/project.service';



@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  searchTerm: string = '';
  projects: Project[] = [];
  filteredProjects: Project[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getProjects().subscribe(data => {
      this.projects = data;
      this.filteredProjects = [...this.projects];
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

  getStatusClass(status: string): string {
    return {
      'Completed': 'badge-success',
      'In Progress': 'badge-warning',
      'Pending': 'badge-danger'
    }[status] || 'badge-secondary';
  }
}