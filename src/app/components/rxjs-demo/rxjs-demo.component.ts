import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, BehaviorSubject, Observable, interval, of } from 'rxjs';
import {
  map,
  filter,
  switchMap,
  mergeMap,
  debounceTime,
  take,
  takeUntil,
  tap,
  catchError
} from 'rxjs/operators';
import { DataService, User } from '../../services/data.service';

@Component({
  selector: 'app-rxjs-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './rxjs-demo.component.html',
  styleUrls: ['./rxjs-demo.component.css']
})
export class RxjsDemoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  searchTerm = '';
  searchResults$!: Observable<User[]>;
  debouncedResults: User[] = [];

  mapResults: number[] = [];
  filterResults: number[] = [];

  switchMapResults: User[] = [];
  mergeMapResults: User[] = [];

  subjectValue = '';
  subjectMessages: string[] = [];
  private messageSubject = new Subject<string>();

  behaviorSubjectValue = 0;
  behaviorSubjectHistory: number[] = [];
  private counterBehaviorSubject = new BehaviorSubject<number>(0);

  activeUsers$!: Observable<User[]>;
  allUsers: User[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.setupDebouncedSearch();
    this.setupSubjectDemo();
    this.setupBehaviorSubjectDemo();
    this.loadUsers();
    this.setupActiveUsersObservable();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupDebouncedSearch(): void {
    this.searchResults$ = this.dataService.setupDebouncedSearch();

    this.searchResults$
      .pipe(takeUntil(this.destroy$))
      .subscribe(results => {
        this.debouncedResults = results;
      });
  }

  onSearchChange(term: string): void {
    this.dataService.triggerSearch(term);
  }

  demonstrateMap(): void {
    const source$ = of(1, 2, 3, 4, 5);

    source$
      .pipe(
        map(x => x * 10),
        takeUntil(this.destroy$)
      )
      .subscribe(result => {
        this.mapResults.push(result);
      });
  }

  demonstrateFilter(): void {
    const source$ = of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

    source$
      .pipe(
        filter(x => x % 2 === 0),
        takeUntil(this.destroy$)
      )
      .subscribe(result => {
        this.filterResults.push(result);
      });
  }

  demonstrateSwitchMap(): void {
    this.switchMapResults = [];
    const clicks$ = interval(500).pipe(take(3));

    clicks$
      .pipe(
        tap(i => console.log(`SwitchMap click ${i}`)),
        switchMap(i => this.dataService.getUsers().pipe(
          map(users => users.filter(u => u.id <= i + 1))
        )),
        takeUntil(this.destroy$)
      )
      .subscribe(result => {
        this.switchMapResults = result;
      });
  }

  demonstrateMergeMap(): void {
    this.mergeMapResults = [];

    this.dataService.getUsersWithMergeMap()
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.mergeMapResults.push(user);
      });
  }

  setupSubjectDemo(): void {
    this.messageSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe(message => {
        this.subjectMessages.push(message);
      });
  }

  emitSubjectValue(): void {
    if (this.subjectValue.trim()) {
      this.messageSubject.next(this.subjectValue);
      this.subjectValue = '';
    }
  }

  setupBehaviorSubjectDemo(): void {
    this.counterBehaviorSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.behaviorSubjectHistory.push(value);
      });
  }

  incrementBehaviorSubject(): void {
    this.behaviorSubjectValue++;
    this.counterBehaviorSubject.next(this.behaviorSubjectValue);
  }

  loadUsers(): void {
    this.dataService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => {
        this.allUsers = users;
      });
  }

  setupActiveUsersObservable(): void {
    this.activeUsers$ = this.dataService.getActiveUsers();
  }

  clearMapResults(): void {
    this.mapResults = [];
  }

  clearFilterResults(): void {
    this.filterResults = [];
  }

  clearSubjectMessages(): void {
    this.subjectMessages = [];
  }

  clearBehaviorSubjectHistory(): void {
    this.behaviorSubjectHistory = [];
    this.behaviorSubjectValue = 0;
    this.counterBehaviorSubject.next(0);
  }
}
