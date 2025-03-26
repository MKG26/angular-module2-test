import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, map } from 'rxjs';
import { Book } from '../models/book.model';
import {
  Database,
  ref,
  set,
  push,
  remove,
  update,
  onValue,
  get,
  child,
} from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private booksSubject = new BehaviorSubject<Book[]>([]);
  public books$ = this.booksSubject.asObservable();

  constructor(private db: Database) {
    this.initializeBooks();
    this.listenToBooks();
  }

  private async initializeBooks() {
    // Check if books exist in Firebase, if not add sample books
    const booksRef = ref(this.db, 'books');
    const snapshot = await get(booksRef);

    if (!snapshot.exists()) {
      const sampleBooks: Book[] = [
        {
          id: '1',
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          isbn: '978-0743273565',
          availability: true,
        },
        {
          id: '2',
          title: '1984',
          author: 'George Orwell',
          isbn: '978-0451524935',
          availability: true,
        },
      ];

      sampleBooks.forEach((book) => {
        const newBookRef = push(ref(this.db, 'books'));
        set(newBookRef, { ...book, id: newBookRef.key });
      });
    }
  }

  private listenToBooks() {
    const booksRef = ref(this.db, 'books');
    onValue(booksRef, (snapshot) => {
      const books: Book[] = [];
      snapshot.forEach((childSnapshot) => {
        books.push({ ...childSnapshot.val(), id: childSnapshot.key });
      });
      this.booksSubject.next(books);
    });
  }

  getAllBooks(): Observable<Book[]> {
    return this.books$;
  }

  getBookById(id: string): Observable<Book | undefined> {
    return this.books$.pipe(
      map((books) => books.find((book) => book.id === id))
    );
  }

  addBook(book: Book): Observable<Book> {
    const newBookRef = push(ref(this.db, 'books'));
    const newBook = { ...book, id: newBookRef.key };
    return from(set(newBookRef, newBook).then(() => newBook));
  }

  updateBook(book: Book): Observable<Book> {
    if (!book.id) throw new Error('Book ID is required');
    const bookRef = ref(this.db, `books/${book.id}`);
    return from(update(bookRef, book).then(() => book));
  }

  deleteBook(id: string): Observable<boolean> {
    const bookRef = ref(this.db, `books/${id}`);
    return from(remove(bookRef).then(() => true));
  }

  checkoutBook(bookId: string, userId: string): Observable<Book> {
    const book = this.booksSubject.value.find((b) => b.id === bookId);
    if (!book) {
      throw new Error('Book not found');
    }
    if (!book.availability) {
      throw new Error('Book is not available');
    }

    const updatedBook: Book = {
      ...book,
      availability: false,
      checkedOutBy: userId,
      checkedOutDate: new Date().toISOString(),
      returnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const bookRef = ref(this.db, `books/${bookId}`);
    return from(update(bookRef, updatedBook).then(() => updatedBook));
  }

  returnBook(bookId: string): Observable<Book> {
    const book = this.booksSubject.value.find((b) => b.id === bookId);
    if (!book) {
      throw new Error('Book not found');
    }

    const updatedBook: Book = {
      ...book,
      availability: true,
      checkedOutBy: null,
      checkedOutDate: null,
      returnDate: null,
    };

    const bookRef = ref(this.db, `books/${bookId}`);
    return from(update(bookRef, updatedBook).then(() => updatedBook));
  }
}
