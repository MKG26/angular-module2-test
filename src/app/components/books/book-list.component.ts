import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';
import { Book } from '../../models/book.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
})
export class BookListComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  loading = true;
  showAddBookForm = false;
  editingBook: Book | null = null;
  newBook: Book = this.getEmptyBook();
  isLibrarian = false;
  currentUserId: string | undefined;
  private userSubscription: Subscription | undefined;

  constructor(
    private bookService: BookService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadBooks();
    this.userSubscription = this.authService.user$.subscribe((user) => {
      this.isLibrarian = user?.role === 'Librarian';
      this.currentUserId = user?.id;
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private getEmptyBook(): Book {
    return {
      title: '',
      author: '',
      isbn: '',
      availability: true,
    };
  }

  loadBooks() {
    this.loading = true;
    this.bookService.getAllBooks().subscribe(
      (books) => {
        this.books = books;
        this.loading = false;
      },
      (error) => {
        console.error('Error loading books:', error);
        this.loading = false;
      }
    );
  }

  onBookSubmit(book: Book) {
    if (this.editingBook) {
      // Update existing book
      const updatedBook: Book = {
        ...book,
        id: this.editingBook.id,
        availability: this.editingBook.availability,
        checkedOutBy: this.editingBook.checkedOutBy,
        checkedOutDate: this.editingBook.checkedOutDate,
        returnDate: this.editingBook.returnDate,
      };
      this.bookService.updateBook(updatedBook).subscribe(() => {
        this.loadBooks();
        this.cancelEdit();
      });
    } else {
      // Add new book
      this.bookService.addBook(book).subscribe(() => {
        this.loadBooks();
        this.cancelEdit();
      });
    }
  }

  startEdit(book: Book) {
    this.editingBook = book;
    this.newBook = { ...book };
    this.showAddBookForm = false;
  }

  cancelEdit() {
    this.editingBook = null;
    this.newBook = this.getEmptyBook();
    this.showAddBookForm = false;
  }

  deleteBook(book: Book) {
    if (this.isLibrarian && book.id) {
      if (confirm('Are you sure you want to delete this book?')) {
        this.bookService.deleteBook(book.id).subscribe(() => this.loadBooks());
      }
    }
  }

  checkoutBook(book: Book) {
    if (!this.currentUserId) {
      alert('Please log in to check out books');
      return;
    }
    if (book.id) {
      this.bookService.checkoutBook(book.id, this.currentUserId).subscribe(
        () => this.loadBooks(),
        (error) => alert(error.message)
      );
    }
  }

  returnBook(book: Book) {
    if (book.id) {
      this.bookService.returnBook(book.id).subscribe(
        () => this.loadBooks(),
        (error) => alert(error.message)
      );
    }
  }
}
