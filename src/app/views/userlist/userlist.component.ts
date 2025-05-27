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
  selectedUser: User | null = null;
  isModalOpen = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => {
        console.error('Failed to load users', err);
      }
    });
  }

  openEditModal(user: User): void {
    this.selectedUser = { ...user }; 
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedUser = null;
  }

  updateUser(): void {
    if (!this.selectedUser) return;

    this.userService.updateUser(this.selectedUser).subscribe({
      next: () => {
        this.loadUsers(); 
        this.closeModal();
      },
      error: (err) => {
        console.error('Failed to update user', err);
      }
    });
  }
  deleteUser(userId: number): void {
  this.userService.deleteUser(userId).subscribe({
    next: () => {
      this.loadUsers(); 
    },
    error: (err) => {
      console.error('Failed to delete user', err);
    }
  });
}

confirmDelete(user: User): void {
  const confirmed = window.confirm(`Are you sure you want to delete ${user.firstname} ${user.lastname}?`);
  if (confirmed) {
    this.deleteUser(user.user_id);
  }
}

}
