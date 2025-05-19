import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, delay, of, retry } from 'rxjs';

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

  private allPosts: Post[] = [];
  private posts: Post[] = [];
  private currentPage = 0;
  private readonly pageSize = 5;

  constructor(private http: HttpClient) {
    this.loadPosts();
  }

  private loadPosts() {
    const local = localStorage.getItem(LOCAL_KEY);
    if (local) {
      this.allPosts = JSON.parse(local);
      this.resetPagination();
    } else {
      this.http.get<Post[]>(this.apiUrl).pipe(
        retry(3),
        catchError(err => {
          alert('No se pudo cargar la lista de posts del servidor');
          return of([]);
        })
      ).subscribe(posts => {
        this.allPosts = posts;
        this.saveToLocalStorage();
        this.resetPagination();
      });
    }
  }

  private saveToLocalStorage() {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(this.allPosts));
  }

  loadMorePosts(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    const nextPosts = this.allPosts.slice(start, end);

    if (nextPosts.length > 0) {
      of(nextPosts).pipe(delay(500)).subscribe(chunk => {
        // Asegurarse de no duplicar al cargar más
        const newChunk = chunk.filter(p => !this.posts.some(existing => existing.id === p.id));
        this.posts = [...this.posts, ...newChunk];
        this.postsSubject.next(this.posts);
        this.currentPage++;
      });
    }
  }

  hasMorePosts(): boolean {
    return this.currentPage * this.pageSize < this.allPosts.length && this.posts.length < this.allPosts.length;
  }

  addPost(post: Omit<Post, 'id'>): void {
    const newPost: Post = {
      id: this.getNextId(),
      ...post
    };
    this.allPosts.unshift(newPost);
    this.posts.unshift(newPost);
    this.saveToLocalStorage();
    this.postsSubject.next(this.posts);
  }

  updatePost(id: number, updated: Omit<Post, 'id'>): void {
    const updatedPost: Post = { id, ...updated };

    const indexAll = this.allPosts.findIndex(p => p.id === id);
    if (indexAll !== -1) this.allPosts[indexAll] = updatedPost;

    const indexVisible = this.posts.findIndex(p => p.id === id);
    if (indexVisible !== -1) this.posts[indexVisible] = updatedPost;

    this.saveToLocalStorage();
    this.postsSubject.next(this.posts);
  }

  deletePost(id: number): void {
    this.allPosts = this.allPosts.filter(p => p.id !== id);

    // Recalcular los visibles basados en la paginación actual
    const max = this.currentPage * this.pageSize;
    this.posts = this.allPosts.slice(0, max);

    this.saveToLocalStorage();
    this.postsSubject.next(this.posts);
  }

  private getNextId(): number {
    return this.allPosts.length ? Math.max(...this.allPosts.map(p => p.id)) + 1 : 1;
  }

  // Reinicia la paginación completamente desde cero
  resetPagination(): void {
    this.currentPage = 1;
    this.posts = this.allPosts.slice(0, this.pageSize);
    this.postsSubject.next(this.posts);
  }
}