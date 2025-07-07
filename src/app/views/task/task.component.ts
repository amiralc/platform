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
  paginatedTickets: TicketJira[] = []; // Changement: tableau au lieu de getter
  projects: Project[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

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
      next: (data) => {
        this.tickets = data;
        this.totalItems = data.length;
        this.refreshPaginatedData(); // Ajout: rafraîchir les données après chargement
      },
      error: (err) => console.error('Erreur lors du chargement des tickets', err),
    });
  }

  // Nouvelle méthode pour rafraîchir les données paginées
  refreshPaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedTickets = this.tickets.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get pages(): number[] {
    const pagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(pagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + pagesToShow - 1);

    if (endPage - startPage + 1 < pagesToShow) {
      startPage = Math.max(1, endPage - pagesToShow + 1);
    }

    return Array.from({length: endPage - startPage + 1}, (_, i) => startPage + i);
  }

  getVisibleEnd(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  goToPage(page: number): void {
    if (this.currentPage !== page) {
      this.currentPage = page;
      this.refreshPaginatedData(); // Ajout: rafraîchir les données après changement de page
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.refreshPaginatedData(); // Ajout: rafraîchir les données
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.refreshPaginatedData(); // Ajout: rafraîchir les données
    }
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
    if (!projectId) {
        console.warn('Project ID is undefined for ticket');
        return 'Non assigné'; // Ou tout autre texte par défaut
    }
    
    const project = this.projects.find(p => p.project_id === projectId);
    return project?.name || 'Projet inconnu';
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