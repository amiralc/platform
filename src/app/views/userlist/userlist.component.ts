import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  AvatarModule,
  TableModule
} from '@coreui/angular';

@Component({
  selector: 'app-userlist',
  standalone: true,
  imports: [
    CommonModule,
    AvatarModule,
    TableModule
  ],
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})
export class UserlistComponent implements OnInit {
users: any[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    position: 'Developer'
  },
  {
    id: 2,
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice@example.com',
    phone: '987-654-3210',
    position: 'Project Manager'
  }
];


  constructor() { }

  ngOnInit(): void {
    // Chargez les données utilisateur ici si nécessaire
  }
}