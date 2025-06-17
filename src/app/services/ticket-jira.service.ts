import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Project {
  project_id: number;
  name?: string; 
}

export interface TicketJira {
  ticket_jira_id?: number;
  ticketNumber?: string | null;
  title: string;
  description: string;
  status?: string | null;
  complexity?: string | null;
  estimatedTime?: number | null;
  timePasses?: number | null;
  project?: { project_id: number } | null;
  user?: any | null;
  timeTrackeds?: any[] | null;
}
@Injectable({
  providedIn: 'root'
})
export class TicketJiraService {
  private baseUrl = 'http://localhost:8083/api/tickets'; 
  private projectUrl = 'http://localhost:8083/api/projects'; 

  constructor(private http: HttpClient) {}

  getAllTickets(): Observable<TicketJira[]> {
    return this.http.get<TicketJira[]>(this.baseUrl);
  }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.projectUrl);
  }

createTicket(ticket: TicketJira): Observable<TicketJira> {
  
  console.log('Envoi au backend:', ticket);
  return this.http.post<TicketJira>(this.baseUrl, ticket);
}

  updateTicket(id: number, ticket: TicketJira): Observable<TicketJira> {
    return this.http.put<TicketJira>(`${this.baseUrl}/${id}`, ticket);
  }

  deleteTicket(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}