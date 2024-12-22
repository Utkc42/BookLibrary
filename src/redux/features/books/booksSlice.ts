import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { Book } from '../../../types/types';
import { RootState } from '../../store/store';

interface BooksState {
    userType: 'anonymous' | 'authenticated'; // Nieuw toegevoegd
    books: Book[];
    sessionBooks: Book[]; // Voor anonieme gebruikers
}

const initialState: BooksState = {
    userType: 'authenticated', // Standaard voor normale gebruikers
    books: [], // Lege array voor boeken in Firebase
    sessionBooks: [], // Lege array voor anonieme gebruikers
};

const booksSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {
        setUserType: (
            state,
            action: PayloadAction<'anonymous' | 'authenticated'>,
        ) => {
            state.userType = action.payload;
        },
        addBook: (state, action: PayloadAction<Book>) => {
            console.log('Current sessionBooks:', state.sessionBooks);
            console.log('Adding book:', action.payload);

            if (state.userType === 'anonymous') {
                // Controleer of sessionBooks bestaat en een array is
                state.sessionBooks = state.sessionBooks || [];
                const exists = state.sessionBooks.some(
                    (book) => book.id === action.payload.id,
                );
                if (!exists) {
                    state.sessionBooks.push(action.payload);
                    console.log('Book added to sessionBooks:', action.payload);
                } else {
                    console.log('Book already exists in sessionBooks');
                }
            } else {
                state.books.push(action.payload);
                console.log('Book added to books:', action.payload);
            }
        },
        removeBook: (state, action: PayloadAction<string>) => {
            if (state.userType === 'anonymous') {
                state.sessionBooks = state.sessionBooks.filter(
                    (book) => book.id !== action.payload,
                );
            } else {
                state.books = state.books.filter(
                    (book) => book.id !== action.payload,
                );
            }
        },
        toggleFavorite: (state, action: PayloadAction<string>) => {
            if (state.userType === 'anonymous') {
                const book = state.sessionBooks.find(
                    (b) => b.id === action.payload,
                );
                if (book) {
                    book.favorite = !book.favorite; // Wissel de favorietenstatus
                }
            } else {
                const book = state.books.find((b) => b.id === action.payload);
                if (book) {
                    book.favorite = !book.favorite;
                }
            }
        },
        addToSavedBooks: (state, action: PayloadAction<Book>) => {
            if (state.userType === 'anonymous') {
                const exists = state.sessionBooks.some(
                    (book) => book.id === action.payload.id,
                );
                if (!exists) {
                    state.sessionBooks.push({
                        ...action.payload,
                        favorite: true,
                    });
                }
            }
        },
    },
});

// Selector voor favorieten tellen
export const selectFavoritesCount = createSelector(
  (state: RootState) => state.books.userType,
  (state: RootState) =>
      state.books.userType === 'anonymous'
          ? state.books.sessionBooks
          : state.books.books,
  (userType, books) =>
      books.filter((book) => book.favorite).length
);

// Selector voor opgeslagen boeken
export const selectSavedBooks = createSelector(
  (state: RootState) => state.books.userType,
  (state: RootState) =>
      state.books.userType === 'anonymous'
          ? state.books.sessionBooks
          : state.books.books,
  (userType, books) =>
      books.filter((book) => book.favorite) // Alleen favorieten
);

export const { setUserType, addBook, removeBook, toggleFavorite, addToSavedBooks  } =
    booksSlice.actions;
export default booksSlice.reducer;
