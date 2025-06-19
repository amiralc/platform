import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  user_id: number;
  firstname: string | null;
  lastname: string | null;
  email: string;
  phone: string | null;
  role: string | null;
  enabled: boolean;
   password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8083/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  updateUser(user: User): Observable<User> {
  return this.http.put<User>(`${this.apiUrl}/${user.user_id}`, user);
}
deleteUser(userId: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${userId}`);
}
createUser(user: User): Observable<User> {
  return this.http.post<User>(this.apiUrl, user);
}


}
