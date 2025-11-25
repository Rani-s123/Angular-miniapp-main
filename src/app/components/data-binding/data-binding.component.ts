import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HighlightDirective } from '../../directives/highlight.directive';
import { UnlessDirective } from '../../directives/unless.directive';
import { ReversePipe } from '../../pipes/reverse.pipe';
import { FilterPipe } from '../../pipes/filter.pipe';
import { CounterService } from '../../services/counter.service';

@Component({
  selector: 'app-data-binding',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    HighlightDirective,
    UnlessDirective,
    ReversePipe,
    FilterPipe
  ],
  templateUrl: './data-binding.component.html',
  styleUrls: ['./data-binding.component.css']
})
export class DataBindingComponent {
  title = 'Data Binding Demo';
  message = 'Hello Angular!';
  twoWayText = '';
  imageUrl = 'https://angular.io/assets/images/logos/angular/angular.png';
  isDisabled = false;
  showContent = true;
  highlightColor = 'lightblue';

  searchTerm = '';
  items = [
    { id: 1, name: 'Angular', category: 'Framework' },
    { id: 2, name: 'TypeScript', category: 'Language' },
    { id: 3, name: 'RxJS', category: 'Library' },
    { id: 4, name: 'NgRx', category: 'State Management' }
  ];

  counter$ = this.counterService.counter$;

  constructor(private counterService: CounterService) {}

  handleClick(): void {
    alert('Button clicked! Event binding works!');
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    console.log('Input changed:', target.value);
  }

  toggleDisabled(): void {
    this.isDisabled = !this.isDisabled;
  }

  toggleContent(): void {
    this.showContent = !this.showContent;
  }

  increment(): void {
    this.counterService.increment();
  }

  decrement(): void {
    this.counterService.decrement();
  }

  reset(): void {
    this.counterService.reset();
  }
}
