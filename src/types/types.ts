export type Book = {
  id?: string; //moet optioneel zijn omdat firebase een id genereert
  title: string;
  author: string;
  description: string;
  genre: string;
  year: number;
  favorite: boolean;
};

export type LibraryStackParamList = {
  AllBooks: undefined;
  BookDetails: { book: Book };
  NewBook: undefined;
  SavedBooks: undefined;
  About: undefined;
};

export type DrawerParamList = {
  LibraryStack: undefined;
  SavedBooks: undefined;
  About: undefined;
};
