import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './project.service';

export interface Project {
  project_id: number;
  name?: string; 
}

export interface TicketJira {
  ticket_jira_id?: number;
  ticketNumber?: string;
  title: string;
  description: string;
  status?: string;
  complexity?: number;  // Changé de string à number
  estimatedTime?: number;
  timePasses?: number;
  projectId?: number;   // Ajouté pour correspondre au backend
  assignTo?: {  // <-- Ajoutez cette propriété
    user_id: number;
    firstname: string;
    lastname: string;
    email: string;
    // ... autres champs utilisateur
  };
   assignToId?: number;   // Ajouté pour l'assignation
  project?: { project_id: number };
  user?: any;
  timeTrackeds?: any[];
}
interface UserAssignment {
  id?: number;
  firstname?: string | null;
  lastname?: string | null;
  email?: string;
  // autres propriétés si nécessaire
}
interface AssignmentStat {
  userId: string;
  count: number;
  user?: UserAssignment;
}
@Injectable({
  providedIn: 'root'
})
export class TicketJiraService {
  private baseUrl = 'http://localhost:8083/api/tickets'; 
  private URL='http://localhost:8083/api'
  private projectUrl = 'http://localhost:8083/api/projects'; 

  constructor(private http: HttpClient) {}

  getAllTickets(): Observable<TicketJira[]> {
    return this.http.get<TicketJira[]>(this.baseUrl);
  }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.projectUrl);
  }

createTicket(ticketData: {
  title: string;
  description: string;
  projectId: number;
  status?: string;
  complexity?: number;
  estimatedTime?: number;
  assignToId?: number;
}): Observable<TicketJira> {
  const payload = {
    title: ticketData.title,
    description: ticketData.description,
    status: ticketData.status || 'OPEN',
    complexity: ticketData.complexity || 3,
    estimatedTime: ticketData.estimatedTime || 0,
    projectId: ticketData.projectId,
    assignToId: ticketData.assignToId,
    timePasses: 0
  };

  console.log('Envoi au backend:', payload);
  return this.http.post<TicketJira>(this.baseUrl, payload);
}

  updateTicket(id: number, ticket: TicketJira): Observable<TicketJira> {
    return this.http.put<TicketJira>(`${this.baseUrl}/${id}`, ticket);
  }

  deleteTicket(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  getStatusStatistics(): Observable<Map<string, number>> {
    return this.http.get<Map<string, number>>(`${this.baseUrl}/stats`);
  }
    getResolvedClosedTickets(): Observable<TicketJira[]> {
    return this.http.get<TicketJira[]>(`${this.baseUrl}/resolved-closed`);
  }

getUserDetails(userIds: number[]): Observable<User[]> {
  return this.http.post<User[]>(`${this.baseUrl}/users/batch`, {userIds});
}
getUserAssignmentStats(): Observable<{ [userId: string]: number }> {
  return this.http.get<{ [userId: string]: number }>(`${this.URL}/stats/users/assigned-ticket-counts`);
}
getUserName(stat: AssignmentStat): string {
  if (stat.user) {
    return [stat.user.firstname, stat.user.lastname]
      .filter(name => name) // Filtre les valeurs null/undefined
      .join(' ') 
      || stat.user.email 
      || `User ${stat.userId}`;
  }
  return `User ${stat.userId}`;
}
getProjectsWithTicketCount(): Observable<{projectName: string, ticketCount: number}[]> {
  return this.http.get<{projectName: string, ticketCount: number}[]>(
    `${this.URL}/stats/projects-ticket-count`
  );
}

}