import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-card',
  imports: [RouterLink],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css'
})
export class PostCardComponent {
  defaultImage = 'assets/default-blog-img.png';
  @Input() postId!: number;
  @Input() image: string = '';
  @Input() title: string = '';
  @Input() content: string = '';

  @Output() delete = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();

  onDelete() {
    this.delete.emit();
  }
  
  onEdit() {
    this.edit.emit();
  }
}
