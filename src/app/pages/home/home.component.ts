import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentComponent } from '../../core/content/content.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ContentComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {}
