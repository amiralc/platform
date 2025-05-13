import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  profileImage?: string;
  joinDate: string;
  projects?: any[];
  followers?: number;
  following?: number;
}

@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: User = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 890',
    position: 'Senior Developer',
    department: 'IT Department',
    profileImage: 'assets/img/theme/team-4.jpg',
    joinDate: '2020-06-15',
    projects: [
      { id: 1, name: 'Website Redesign', status: 'Completed' },
      { id: 2, name: 'Mobile App', status: 'In Progress' }
    ],
    followers: 42,
    following: 28
  };

  ngOnInit(): void {
   
  }

  saveProfile(): void {
    console.log('Saving user profile:', this.user);
    
    alert('Profile updated successfully!');
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.profileImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}