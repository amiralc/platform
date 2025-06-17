import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UserlistComponent implements OnInit {
  users: User[] = [];

  // Initialise selectedUser avec un objet User "vide" par défaut,
  // pour éviter les erreurs de binding null
  selectedUser: User = this.createEmptyUser();

  isModalOpen = false;
  isCreating = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => this.users = users,
      error: (err) => console.error('Failed to load users', err)
    });
  }

  // Méthode utilitaire pour créer un utilisateur vide
  private createEmptyUser(): User {
    return {
      user_id: 0,
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      role: '',
      enabled: true,
      password: ''
    };
  }

  openCreateModal(): void {
    this.isCreating = true;
    this.selectedUser = this.createEmptyUser();
    this.isModalOpen = true;
  }

  openEditModal(user: User): void {
    this.isCreating = false;
    this.selectedUser = { ...user }; // copie pour éviter mutation directe
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedUser = this.createEmptyUser(); // Réinitialiser l'objet pour éviter null
  }

  createUser(): void {
    if (!this.selectedUser) return;

    this.userService.createUser(this.selectedUser).subscribe({
      next: () => {
        this.loadUsers();
        this.closeModal();
      },
      error: (err) => console.error('Failed to create user', err)
    });
  }

  updateUser(): void {
    if (!this.selectedUser) return;

    this.userService.updateUser(this.selectedUser).subscribe({
      next: () => {
        this.loadUsers();
        this.closeModal();
      },
      error: (err) => console.error('Failed to update user', err)
    });
  }

  deleteUser(userId: number): void {
    this.userService.deleteUser(userId).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Failed to delete user', err)
    });
  }

  confirmDelete(user: User): void {
    const confirmed = window.confirm(`Are you sure you want to delete ${user.firstname} ${user.lastname}?`);
    if (confirmed) {
      this.deleteUser(user.user_id);
    }
  }
}
