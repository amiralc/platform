import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Project {
  id: number;
  name: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  projectId: number;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt?: Date;
}

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  projects: Project[] = [
    { id: 1, name: 'Website Redesign' },
    { id: 2, name: 'Mobile App Development' },
    { id: 3, name: 'Marketing Campaign' }
  ];

  tasks: Task[] = [
    {
      id: 1,
      title: 'Design Homepage',
      description: 'Create new design for the homepage',
      projectId: 1,
      status: 'completed',
      createdAt: new Date('2023-05-10')
    },
    {
      id: 2,
      title: 'Implement API',
      description: 'Develop backend API for user management',
      projectId: 2,
      status: 'in-progress',
      createdAt: new Date('2023-06-15')
    },
    {
      id: 3,
      title: 'Social Media Posts',
      description: 'Create content for social media campaign',
      projectId: 3,
      status: 'pending',
      createdAt: new Date('2023-06-20')
    }
  ];

  newTask: Omit<Task, 'id'> = {
    title: '',
    description: '',
    projectId: 0,
    status: 'pending'
  };

  editingTaskId: number | null = null;

  ngOnInit(): void {
    // Load data from API or service could go here
  }

  isTaskFormValid(): boolean {
    return (
      this.newTask.title.trim() !== '' &&
      this.newTask.description.trim() !== '' &&
      this.newTask.projectId !== 0
    );
  }

  onAddTask(): void {
    if (this.editingTaskId) {
  
      const index = this.tasks.findIndex(t => t.id === this.editingTaskId);
      if (index !== -1) {
        this.tasks[index] = { 
          ...this.tasks[index], 
          ...this.newTask 
        };
      }
      this.editingTaskId = null;
    } else {
      // Add new task
      const newId = this.tasks.length > 0 
        ? Math.max(...this.tasks.map(t => t.id)) + 1 
        : 1;
      this.tasks.push({
        id: newId,
        ...this.newTask,
        createdAt: new Date()
      });
    }

    // Reset form
    this.resetTaskForm();
  }

  onEditTask(task: Task): void {
    this.editingTaskId = task.id;
    this.newTask = {
      title: task.title,
      description: task.description,
      projectId: task.projectId,
      status: task.status
    };
  }

  onDeleteTask(taskId: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.tasks = this.tasks.filter(task => task.id !== taskId);
    }
  }

  cancelEdit(): void {
    this.editingTaskId = null;
    this.resetTaskForm();
  }

  resetTaskForm(): void {
    this.newTask = {
      title: '',
      description: '',
      projectId: 0,
      status: 'pending'
    };
  }

  getProjectName(projectId: number): string {
    const project = this.projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'completed': return 'badge-success';
      case 'in-progress': return 'badge-info';
      case 'pending': return 'badge-warning';
      default: return 'badge-secondary';
    }
  }
}