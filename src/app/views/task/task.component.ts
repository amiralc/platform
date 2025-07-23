import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TicketJiraService, TicketJira, Project } from '../../services/ticket-jira.service';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class TaskComponent implements OnInit {
  tickets: TicketJira[] = [];
  paginatedTickets: TicketJira[] = [];
  projects: Project[] = [];
  users: User[] = [];
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
    private userService: UserService,
    private toastr: ToastrService
  ) {
    // Formulaire de création
    this.createForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      projectId: [null, Validators.required],
      status: ['OPEN', Validators.required],
      complexity: [3, [Validators.required, Validators.min(1), Validators.max(10)]],
      estimatedTime: [0, [Validators.required, Validators.min(0)]],
      assignToId: [null]
    });

    // Formulaire d'édition
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      projectId: [null, Validators.required],
      status: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadProjects();
    this.loadTickets();
  }

  // Nouvelle méthode pour obtenir le nom de l'assigné
  getAssigneeName(ticket: TicketJira): string {
    if (ticket.assignTo) {
      return `${ticket.assignTo.firstname} ${ticket.assignTo.lastname}`.trim();
    }
    
    if (ticket.assignToId) {
      const user = this.users.find(u => u.user_id === ticket.assignToId);
      if (user) {
        return `${user.firstname} ${user.lastname}`.trim();
      }
    }
    
    return 'Non assigné';
  }

  loadTickets(): void {
    this.ticketService.getAllTickets().subscribe({
      next: (data) => {
        this.tickets = data;
        this.totalItems = data.length;
        this.refreshPaginatedData();
      },
      error: (err) => console.error('Erreur lors du chargement des tickets', err),
    });
  }

  loadProjects(): void {
    this.ticketService.getProjects().subscribe({
      next: (data) => {
        this.projects = data.map((project) => ({
          project_id: project.project_id,
          name: project.name ?? 'Nom non défini',
        }));
      },
      error: (err) => console.error('Erreur chargement projets', err),
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => console.error('Erreur chargement utilisateurs', err)
    });
  }

  getProjectName(projectId: number | undefined): string {
    if (!projectId) {
      return 'Non assigné';
    }
    
    const project = this.projects.find(p => p.project_id === projectId);
    return project?.name || 'Projet inconnu';
  }

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
      this.refreshPaginatedData();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.refreshPaginatedData();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.refreshPaginatedData();
    }
  }

  openCreateModal(): void {
    this.isCreateModalOpen = true;
    this.createForm.reset({
      status: 'OPEN',
      complexity: 3,
      estimatedTime: 0,
      assignToId: null
    });
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
    if (this.createForm.invalid) {
      this.toastr.warning('Veuillez remplir tous les champs requis');
      return;
    }

    const ticketData = {
      ...this.createForm.value,
      timePasses: 0
    };

    this.ticketService.createTicket(ticketData).subscribe({
      next: () => {
        this.loadTickets();
        this.closeCreateModal();
        this.toastr.success('Ticket créé avec succès');
      },
      error: (err) => {
        console.error('Erreur création ticket:', err);
        this.toastr.error('Erreur lors de la création du ticket');
      }
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