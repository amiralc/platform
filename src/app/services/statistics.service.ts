import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError,map } from 'rxjs/operators';
import {  tap } from 'rxjs/operators';

export interface UserPerformanceResponse {

  completedTasks: number;
  inProgressTasks: number;
  openTasks: number;
  avgTimePerTask: number;
  onTimeCompletionRate: number;
  timeSpentPerProject: { [projectName: string]: number };
}
interface TeamProjectCount {
  teamName: string;
  projectCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  
private baseUrl = 'http://localhost:8083/api/stats';
private basete="http://localhost:8083/api/teams"
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
 getUserPerformanceStats(userId: number): Observable<UserPerformanceResponse> {
    return this.http.get<any>(`${this.baseUrl}/user-performance`, {
      params: { userId: userId.toString() }
    }).pipe(
      map(response => this.normalizePerformanceResponse(response)),
      catchError(error => this.handlePerformanceError(error))
    );
  }
 private normalizePerformanceResponse(response: any): UserPerformanceResponse {
    // Si la réponse est un tableau, prendre le premier élément
    const data = Array.isArray(response) ? response[0] : response;

    return {
      completedTasks: data.completedTasks ?? data.CompletedTasks ?? 0,
      inProgressTasks: data.inProgressTasks ?? data.iInProgressTasks ?? 0,
      openTasks: data.openTasks ?? data.OpenTasks ?? 0,
      avgTimePerTask: data.avgTimePerTask ?? data.AvgTimePerTask ?? 0,
      onTimeCompletionRate: data.onTimeCompletionRate ?? data.OnTimeCompletionRate ?? 0,
      timeSpentPerProject: data.timeSpentPerProject ?? data.TimeSpentPerProject ?? {}
    };
  }

  private handlePerformanceError(error: any): Observable<never> {
    console.error('Performance API Error:', error);
    
    let errorMessage = 'Erreur lors du chargement des performances';
    if (error.status === 404) errorMessage = 'Utilisateur non trouvé';
    if (error.status === 500) errorMessage = 'Erreur serveur';
    
    return throwError(() => new Error(errorMessage));
  }
 

getProjectsPerTeam(): Observable<TeamProjectCount[]> {
  return this.http.get<TeamProjectCount[]>(`${this.basete}/stats/projects-per-team`);
}


}

  

