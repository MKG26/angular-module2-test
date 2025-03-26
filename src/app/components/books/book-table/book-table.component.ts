import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Book } from '../../../models/book.model';

@Component({
  selector: 'app-book-table',
  templateUrl: './book-table.component.html',
  styleUrls: ['./book-table.component.css'],
})
export class BookTableComponent {
  @Input() books: Book[] = [];
  @Input() isLibrarian = false;
  @Input() currentUserId: string | undefined;
  @Output() checkOut = new EventEmitter<Book>();
  @Output() returnBook = new EventEmitter<Book>();
  @Output() editBook = new EventEmitter<Book>();
  @Output() deleteBook = new EventEmitter<Book>();

  trackByFn(index: number, book: Book): string {
    return book.id || index.toString();
  }
}
