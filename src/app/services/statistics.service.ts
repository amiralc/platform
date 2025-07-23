import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
private baseUrl = 'http://localhost:8083/api/stats';
 constructor(private http: HttpClient) {}

  getAssignedTicketCounts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users/assigned-ticket-counts`);
  }

  getProjectsTicketCount(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/projects-ticket-count`);
  }

  getUsersPerTeam(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.baseUrl}/users-per-team`);
  }

  getTicketsByStatus(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.baseUrl}/tickets-by-status`);
  }

   getTimeTrackedPerUser(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.baseUrl}/time-tracked`);
  }
  getAvgResolutionTime(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.baseUrl}/avg-resolution-time`);
  }

  getComplexityVsEstimated(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/complexity-estimate`);
  }
 getBasicKPIs(): Observable<{ totalEmployees: number, totalProjects: number }> {
    return this.http.get<{ totalEmployees: number, totalProjects: number }>(`${this.baseUrl}/kpis`);
  }
   getDetailedUserAssignments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/detailed-assignments`);
  }

}