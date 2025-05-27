import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TicketJiraService, TicketJira, Project } from '../../services/ticket-jira.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class TaskComponent implements OnInit {
  tickets: TicketJira[] = [];
  projects: Project[] = [];

  createForm: FormGroup;
  editForm: FormGroup;
  isCreateModalOpen = false;
  isEditModalOpen = false;
  editingTicketId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketJiraService,
    private toastr: ToastrService
  ) {
    this.createForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      projectId: [null, Validators.required],
      status: ['', Validators.required],
    });

    this.editForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      projectId: [null, Validators.required],
      status: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadTickets();
    this.loadProjects();
  }

  loadTickets(): void {
    this.ticketService.getAllTickets().subscribe({
      next: (data) => (this.tickets = data),
      error: (err) => console.error('Erreur lors du chargement des tickets', err),
    });
  }

  loadProjects(): void {
    this.ticketService.getProjects().subscribe({
      next: (data) =>
        (this.projects = data.map((project) => ({
          project_id: project.project_id,
          name: project.name ?? 'Nom non défini',
        }))),
      error: (err) => console.error('Erreur chargement projets', err),
    });
  }

  getProjectName(projectId: number | undefined): string {
  const project = this.projects.find((p) => p.project_id === projectId);
  // Si project existe et project.name est défini, retourne project.name, sinon 'Inconnu'
  return project && project.name ? project.name : 'Inconnu';
}


  openCreateModal(): void {
    this.isCreateModalOpen = true;
    this.createForm.reset();
  }

  closeCreateModal(): void {
    this.isCreateModalOpen = false;
  }

  openEditModal(ticket: TicketJira): void {
    this.isEditModalOpen = true;
    this.editingTicketId = ticket.ticket_jira_id!;
    this.editForm.patchValue({
      title: ticket.title,
      description: ticket.description,
      projectId: ticket.project?.project_id,
      status: ticket.status,
    });
  }

  closeModal(): void {
    this.isEditModalOpen = false;
  }

  addTicket(): void {
    if (this.createForm.invalid) return;

    const ticketData = this.createForm.value;
    this.ticketService.createTicket(ticketData).subscribe({
      next: () => {
        this.loadTickets();
        this.closeCreateModal();
        this.toastr.success('Ticket créé avec succès');
      },
      error: () => this.toastr.error('Erreur lors de la création du ticket'),
    });
  }

  updateTicket(): void {
    if (this.editForm.invalid || this.editingTicketId === null) return;

    const ticketData = this.editForm.value;
    this.ticketService.updateTicket(this.editingTicketId, ticketData).subscribe({
      next: () => {
        this.loadTickets();
        this.closeModal();
        this.toastr.success('Ticket mis à jour');
      },
      error: () => this.toastr.error('Erreur lors de la mise à jour du ticket'),
    });
  }

  deleteTicket(ticketId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce ticket ?')) {
      this.ticketService.deleteTicket(ticketId).subscribe({
        next: () => {
          this.loadTickets();
          this.toastr.success('Ticket supprimé');
        },
        error: () => this.toastr.error('Erreur lors de la suppression du ticket'),
      });
    }
  }

  trackByTicketId(index: number, ticket: TicketJira): number {
    return ticket.ticket_jira_id!;
  }
}
