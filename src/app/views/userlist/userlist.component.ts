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
   paginatedUsers: User[] = [];
  selectedUser: User = this.createEmptyUser();
  isModalOpen = false;
  isCreating = false;
   currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  isDeleteModalOpen = false;
  userToDelete: User | null = null;
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
  this.userService.getUsers().subscribe({
    next: (users) => {
      console.log('Users data received:', users); 
      this.users = users;
      this.totalItems = users.length;
      this.refreshPaginatedData();
    },
    error: (err) => console.error('Failed to load users', err)
  });
}
    refreshPaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedUsers = this.users.slice(startIndex, startIndex + this.itemsPerPage);
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
    this.selectedUser = { ...user }; 
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedUser = this.createEmptyUser(); 
  }

  createUser(): void {
  if (!this.selectedUser) return;
  
  console.log('Data being sent to API:', this.selectedUser);
  
  this.userService.createUser(this.selectedUser).subscribe({
    next: (createdUser) => {
      console.log('User created successfully:', createdUser); 
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
    this.userToDelete = user;
    this.isDeleteModalOpen = true;
  }
    deleteUserConfirmed(): void {
    if (this.userToDelete) {
      this.userService.deleteUser(this.userToDelete.user_id).subscribe({
        next: () => {
          this.loadUsers();
          this.closeDeleteModal();
        },
        error: (err) => {
          console.error('Failed to delete user', err);
          this.closeDeleteModal();
        }
      });
    }
  }
   closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.userToDelete = null;
  }
   
   
}
