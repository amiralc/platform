import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TicketJira } from './ticket-jira.service';

export interface User {
  id: number;
  firstname: string | null;
  lastname: string | null;
  email: string;
  phone: string | null;
  position: string | null;
  roles: { roleId: number; name: string }[];
  fullName: string;
  photoUrl?: string;
}
export interface Ticket {
  ticket_jira_id: number;
  title: string;
  description: string;
  status: string;
  assignTo?: {
    user_id: number;
    fullName: string;
    email: string;
    photoUrl?: string;
  };
}

export interface Department {
  department_id: number;
  name: string;
}

export interface Team {
  team_id: number;
  name: string;
  managedBY: User;
  members: User[];
  departement: Department;
}

export interface Project {
  project_id: number;
  name: string;
  description: string;
  tickets: any[];
  workedOn: Team | null;
}

export interface OrganizationNode {
  id: number;
  name: string;
  title: string;
  photoUrl?: string;
  children?: OrganizationNode[];
}
export interface AssignTeamRequest {
  userId: number;
  teamId: number;
}


@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:8083/api';
  

  constructor(private http: HttpClient) {}

  // Project endpoints
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/projects`);
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/projects/${id}`);
  }

  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/projects`, project);
  }

  updateProject(id: number, project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/projects/${id}`, project);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/projects/${id}`);
  }

  // Team assignment
  assignProjectToTeam(projectId: number, teamId: number): Observable<Project> {
    return this.http.post<Project>(
      `${this.apiUrl}/projects/${projectId}/team/${teamId}`,
      {}
    );
  }

  // Organization hierarchy
  getProjectTeamHierarchy(projectId: number): Observable<OrganizationNode[]> {
    return this.http.get<OrganizationNode[]>(
      `${this.apiUrl}/projects/${projectId}/team-hierarchy`
    );
  }

  // Teams
  getAvailableTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/teams`);
  }
 assignUserToTeam(userId: number, teamId: number, token: string): Observable<string> {
  return this.http.post(
    `${this.apiUrl}/users/assign-to-team`,
    { userId, teamId },
    {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      responseType: 'text'  // Important : attendre une réponse texte et non JSON
    }
  );
}

getAvailableUsers(): Observable<User[]> {
  return this.http.get<User[]>(`${this.apiUrl}/users/available`);
}
getUsersByIds(userIds: number[]): Observable<User[]> {
  return this.http.post<User[]>(`${this.apiUrl}/users/by-ids`, { userIds });
}


}