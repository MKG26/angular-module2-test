import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Book } from '../../../models/book.model';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css'],
})
export class BookFormComponent {
  @Input() book: Book = this.getEmptyBook();
  @Input() isEditing = false;
  @Output() submitBook = new EventEmitter<Book>();
  @Output() cancel = new EventEmitter<void>();

  private getEmptyBook(): Book {
    return {
      title: '',
      author: '',
      isbn: '',
      availability: true,
    };
  }

  onSubmit() {
    this.submitBook.emit(this.book);
  }

  onCancel() {
    this.cancel.emit();
  }
}
