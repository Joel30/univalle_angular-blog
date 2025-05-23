import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PostListComponent } from './components/post-list/post-list.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PostListComponent, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'My Blog';
}
