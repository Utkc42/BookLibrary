import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Book } from '../../../types/types';
interface BooksState {
  books: Book[];
  savedBooks: Book[];
}

const initialState: BooksState = {
  books: [
    {
      id: '1',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      genre: 'Fiction',
      year: 1960,
      description: 'A timeless masterpiece...',
      favorite: false,
    },
    {
      id: '2',
      title: 'The Diary of a Young Girl',
      author: 'Anne Frank',
      genre: 'Memoir / Biography',
      year: 1947,
      description: 'A gripping diary...',
      favorite: false,
    },
  ],
  savedBooks: [],
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    addBook: (state, action: PayloadAction<Book>) => {
      state.books.push(action.payload);
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const book = state.books.find((b) => b.id === action.payload);
      if (book) {
        book.favorite = !book.favorite; // Wissel de 'favorite'-status
      }
    },
    toggleSaved: (state, action: PayloadAction<string>) => {
      const book = state.books.find((b) => b.id === action.payload);
      if (book) {
        const isSaved = state.savedBooks.some((b) => b.id === book.id);
        if (isSaved) {
          state.savedBooks = state.savedBooks.filter((b) => b.id !== book.id);
        } else {
          state.savedBooks.push(book);
        }
      }
    },
    removeBook: (state, action: PayloadAction<string>) => {
      state.books = state.books.filter((book) => book.id !== action.payload);
      state.savedBooks = state.savedBooks.filter((book) => book.id !== action.payload);
    },
  },
});

export const { addBook, toggleSaved, toggleFavorite, removeBook } = booksSlice.actions;
export default booksSlice.reducer;
