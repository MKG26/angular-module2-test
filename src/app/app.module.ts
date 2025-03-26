import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login.component';
import { BookListComponent } from './components/books/book-list.component';
import { NavComponent } from './components/shared/nav.component';
import { BookFormComponent } from './components/books/book-form/book-form.component';
import { BookTableComponent } from './components/books/book-table/book-table.component';

import { AuthService } from './services/auth.service';
import { BookService } from './services/book.service';
import { AuthGuard } from './guards/auth.guard';

// Firebase imports
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'books',
    component: BookListComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'Member',
      viewMode: 'read',
    },
  },
  {
    path: 'manage',
    component: BookListComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'Librarian',
      viewMode: 'manage',
    },
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BookListComponent,
    NavComponent,
    BookFormComponent,
    BookTableComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideDatabase(() => getDatabase()),
    provideAuth(() => getAuth()),
  ],
  providers: [AuthService, BookService, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
