import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';

@Component({
  selector: 'app-post-detail',
  imports: [CommonModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent {
  defaultImage = 'assets/default-blog-img.png';

  route = inject(ActivatedRoute);
  postService = inject(PostService);

  post = this.postService
    .postsBS
    .pipe(
      map(posts => {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        return posts.find(p => p.id === id);
      })
    );
}