export type UserRole = 'Librarian' | 'Member';

export interface User {
  id?: string;
  email: string;
  name: string;
  role: UserRole;
  checkedOutBooks?: string[]; 
}
