import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/header/header.component';
import { ContentComponent } from './core/content/content.component';
import { FooterComponent } from './core/footer/footer.component';
import { AdminComponent } from "./admin/admin.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    ContentComponent,
    FooterComponent,
    AdminComponent
]
})
export class AppComponent {
  title = 'proyectosoluciones';
}
