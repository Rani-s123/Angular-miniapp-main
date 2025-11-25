import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject, of } from 'rxjs';
import { map, filter, switchMap, mergeMap, debounceTime, catchError, delay } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private searchSubject = new Subject<string>();
  private usersSubject = new BehaviorSubject<User[]>([]);

  public users$: Observable<User[]> = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    const mockUsers: User[] = [
      { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
      { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
      { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' },
      { id: 4, name: 'Diana Prince', email: 'diana@example.com' }
    ];
    this.usersSubject.next(mockUsers);
  }

  getUsers(): Observable<User[]> {
    return of(this.usersSubject.value).pipe(delay(500));
  }

  getUserById(id: number): Observable<User | undefined> {
    return this.users$.pipe(
      map(users => users.find(user => user.id === id))
    );
  }

  searchUsers(term: string): Observable<User[]> {
    return this.users$.pipe(
      map(users => users.filter(user =>
        user.name.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase())
      ))
    );
  }

  setupDebouncedSearch(): Observable<User[]> {
    return this.searchSubject.pipe(
      debounceTime(300),
      switchMap(term => this.searchUsers(term))
    );
  }

  triggerSearch(term: string): void {
    this.searchSubject.next(term);
  }

  getUsersWithMergeMap(): Observable<User> {
    return this.getUsers().pipe(
      mergeMap(users => users)
    );
  }

  getActiveUsers(): Observable<User[]> {
    return this.users$.pipe(
      filter(users => users.length > 0),
      map(users => users.filter(user => user.id % 2 === 0))
    );
  }

  fetchFromAPI(url: string): Observable<any> {
    return this.http.get(url).pipe(
      catchError(error => {
        console.error('API Error:', error);
        return of({ error: 'Failed to fetch data' });
      })
    );
  }
}
