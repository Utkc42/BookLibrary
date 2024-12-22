export type Book = {
  id: string; // Optioneel, Firebase genereert een ID
  title: string;
  author: string;
  description: string;
  genre: string;
  year: number;
  favorite: boolean;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type LibraryStackParamList = {
  AllBooks: { newBook?: Book }; // Optioneel, zodat het voor beide situaties werkt
  BookDetails: { book: Book };
  NewBook: { isAnonymous: boolean };
  SavedBooks: undefined;
  About: undefined;
};

export type DrawerParamList = {
  LibraryStack: undefined;
  SavedBooks: undefined;
  About: undefined;
};
