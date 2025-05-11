import { Component } from '@angular/core';
import { PostCardComponent } from '../post-card/post-card.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-list',
  imports: [PostCardComponent, FormsModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent {
  posts = [
    { image: 'https://smartblogger.com/wp-content/uploads/2222/12/blog-design-700.png', title: 'La importancia de aprender Angular', content: 'Angular es un framework robusto y escalable para construir aplicaciones web modernas. Su arquitectura basada en componentes y su integración con TypeScript lo convierten en una excelente opción para desarrolladores que buscan productividad y mantenibilidad. Aprender Angular no solo mejora tus habilidades, sino que también abre muchas oportunidades laborales.' },
  ];

  newTitle = '';
  newContent = '';

  // Agregar una nueva publicación
  addPost() {
    if (this.newTitle.trim() && this.newContent.trim()) {
      this.posts.push({
        image: 'https://smartblogger.com/wp-content/uploads/2222/12/blog-design-700.png',
        title: this.newTitle,
        content: this.newContent
      });

      this.newTitle = '';
      this.newContent = '';
    }
  }

  // Eliminar una publicación
  removePost(index: number) {
    this.posts.splice(index, 1);
  }
}
