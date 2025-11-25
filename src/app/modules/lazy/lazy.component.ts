import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lazy',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './lazy.component.html',
  styleUrls: ['./lazy.component.css']
})
export class LazyComponent implements OnInit {
  loadTime: string = '';

  ngOnInit(): void {
    this.loadTime = new Date().toLocaleTimeString();
    console.log('Lazy module loaded at:', this.loadTime);
  }
}
