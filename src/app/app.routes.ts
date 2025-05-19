import { Routes } from '@angular/router';
import { PostListComponent } from './components/post-list/post-list.component';
// import { PostDetailComponent } from './components/post-detail/post-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'posts', pathMatch: 'full' },
  { path: 'posts', component: PostListComponent },
  // { path: 'posts/:id', component: PostDetailComponent },
  {
    path: 'posts/:id',
    loadComponent: () =>
      import('./components/post-detail/post-detail.component')
        .then(d => d.PostDetailComponent)
  },
  { path: '**', redirectTo: 'posts' }
];
