export interface Book {
  id?: string;
  title: string;
  author: string;
  isbn: string;
  availability: boolean;
  checkedOutBy?: string | null;
  checkedOutDate?: string | null;
  returnDate?: string | null;
}
