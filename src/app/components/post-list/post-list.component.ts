import { Component, inject } from '@angular/core';
import { PostCardComponent } from '../post-card/post-card.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Post, PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-list',
  imports: [PostCardComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent {
  defaultImage = 'assets/default-blog-img.png';
  posts : Post[] = [];
  public postService = inject(PostService);

  newTitle = '';
  newContent = '';
  newImageUrl = '';
  editingPostId : number | null = null;

  ngOnInit() {
    this.postService.postsBS.subscribe((posts) => {
      this.posts = posts;
    });
  }

  savePost() {
    const newPostData: Omit<Post, 'id'> = {
      title: this.newTitle,
      content: this.newContent,
      image_url: this.newImageUrl,
    };

    if (this.editingPostId !== null) {
      this.postService.updatePost(this.editingPostId, newPostData);
      this.editingPostId = null;
    } else {
      this.postService.addPost(newPostData);
    }
    this.refreshPosts();
  }

  editPost(post: Post) {
    this.postForm.setValue({
      title: post.title,
      content: post.content,
      image_url: post.image_url === this.defaultImage ? '' : post.image_url,
    });
    this.editingPostId = post.id;
  }
  
  removePost(id: number) {
    this.postService.deletePost(id);
    this.refreshPosts();
  }

  refreshPosts() {
    this.posts = this.postService.getPosts();
  }

  // Formularios reactivos
  private fb = inject(FormBuilder);

  postForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    content: ['', [Validators.required, Validators.minLength(10)]],
    image_url: ['']
  })

  isValidField(fieldName: string): boolean | null {
    return (
      this.postForm.controls[fieldName].errors &&
      this.postForm.controls[fieldName].touched
    );
  }

  getErrorMessage(fieldName: string): string | null {
    if (!this.postForm.controls[fieldName]) return null;

    const errors = this.postForm.controls[fieldName].errors ?? {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `El campo debe tener al menos ${errors[key].requiredLength} caracteres`;
        case 'maxlength':
          return `El campo no puede tener más de ${errors[key].requiredLength} caracteres`;
        case 'min':
          return `Valor mínimo de ${errors[key].min}`;
      }
    }
    return null;
  }

  onSubmit() {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    console.log(this.postForm.value);
    this.newTitle = this.postForm.value.title;
    this.newContent = this.postForm.value.content;
    this.newImageUrl = this.postForm.value.image_url.trim() || this.defaultImage;

    this.postForm.reset();
    this.savePost();
  }
}
