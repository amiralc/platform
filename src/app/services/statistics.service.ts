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



getUserPerformance(userId: number): Observable<UserPerformanceResponse> {
  return this.http.get<UserPerformanceResponse>(`${this.baseUrl}/user-performance?userId=${userId}`);
}
 

getProjectsPerTeam(): Observable<TeamProjectCount[]> {
  return this.http.get<TeamProjectCount[]>(`${this.basete}/stats/projects-per-team`);
}


}

  

