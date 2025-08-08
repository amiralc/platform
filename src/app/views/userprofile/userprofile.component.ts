import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';

interface UserProfile extends User {
  position?: string | null;
  department?: string | null;
  joinDate?: string | null;
  profileImage?: string | null;
}

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule] // Uniquement les imports de base
})
export class UserprofileComponent implements OnInit {
  user: UserProfile = {
    user_id: 0,
    firstname: null,
    lastname: null,
    email: '',
    phone: null,
    role: null,
    enabled: false,
    position: null,
    department: null,
    joinDate: null
  };

  isLoading = false;
  isSaving = false;
  errorMessage: string | null = null;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        if (users.length > 0) {
          
          this.user = { 
            ...this.user, 
            ...users[0]  
          };
        }
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Échec du chargement du profil';
        console.error('Erreur de chargement:', err);
      }
    });
  }

  saveUserProfile(): void {
    if (!this.user.user_id) {
      this.errorMessage = 'ID utilisateur invalide';
      return;
    }

    this.isSaving = true;
    this.errorMessage = null;

    
    const userToUpdate: User = {

      user_id: this.user.user_id,
      firstname: this.user.firstname,
      lastname: this.user.lastname,
      email: this.user.email,
      phone: this.user.phone,
      role: this.user.role,
      enabled: this.user.enabled
    };

    this.userService.updateUser(userToUpdate).subscribe({
      next: (updatedUser: User) => {
       
        this.user = { 
          ...this.user, 
          ...updatedUser 
        };
        this.isSaving = false;
      },
      error: (err: HttpErrorResponse) => {
        this.isSaving = false;
        this.errorMessage = err.error?.message || 'Échec de la mise à jour';
        console.error('Erreur de mise à jour:', err);
      }
    });
  }
}