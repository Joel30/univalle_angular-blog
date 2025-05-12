import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Post {
  id: number;
  title: string;
  content: string;
  image_url: string;
}

const LOCAL_KEY = 'posts';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'https://my-json-server.typicode.com/Joel30/db_personal_blog/posts';
  private postsSubject = new BehaviorSubject<Post[]>([]);
  postsBS = this.postsSubject.asObservable();
  private posts: Post[] = [];

  constructor(private http: HttpClient) {
    this.loadPosts();
  }

  // Cargar posts desde el localStorage o desde la API
  private loadPosts() {
    const local = localStorage.getItem(LOCAL_KEY);
    if (local) {
      this.posts = JSON.parse(local);
      this.postsSubject.next(this.posts);
    } else {
      this.http.get<Post[]>(this.apiUrl).subscribe({
        next: (data) => {
          this.posts = data;
          this.saveToLocalStorage();
          this.postsSubject.next(this.posts);
        },
        error: (err) => {
          alert('No se pudo cargar la lista de posts');
        }
      });
    }
  }
  // Guardar posts en el localStorage
  private saveToLocalStorage() {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(this.posts));
    this.postsSubject.next(this.posts);
  }

  getPosts(): Post[] {
    return [...this.posts];
  }

  // Agregar un nuevo post
  addPost(post: Omit<Post, 'id'>): void {
    const newPost: Post = {
      id: this.getNextId(),
      ...post
    };
    this.posts.push(newPost);
    this.saveToLocalStorage();
  }
  // Actualizar un post existente
  updatePost(id: number, updated: Omit<Post, 'id'>): void {
    const index = this.posts.findIndex(p => p.id === id);
    if (index !== -1) {
      this.posts[index] = { id, ...updated };
      this.saveToLocalStorage();
    }
  }
  // Eliminar un post
  deletePost(id: number): void {
    this.posts = this.posts.filter(p => p.id !== id);
    this.saveToLocalStorage();
  }
  // Obtener el siguiente ID para un nuevo post
  private getNextId(): number {
    return this.posts.length ? Math.max(...this.posts.map(p => p.id)) + 1 : 1;
  }
}
