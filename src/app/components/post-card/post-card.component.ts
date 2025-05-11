import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-post-card',
  imports: [],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css'
})
export class PostCardComponent {
  @Input() image: string = '';
  @Input() title: string = '';
  @Input() content: string = '';

  @Output() delete = new EventEmitter<void>();

  onDelete() {
    this.delete.emit();
  }
}
