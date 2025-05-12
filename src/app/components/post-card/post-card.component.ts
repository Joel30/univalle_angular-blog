import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-post-card',
  imports: [],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css'
})
export class PostCardComponent {
  defaultImage = 'assets/default-blog-img.png';
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
