import { db } from "./index";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { Book } from "../types/types"; // Zorg dat dit pad klopt

// Haal alle boeken op
export const getAllBooks = async (): Promise<Book[]> => {
  const querySnapshot = await getDocs(collection(db, "books"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Book, "id">), // Typecast de data naar het Book-type
  }));
};

// Voeg een nieuw boek toe
export const addBook = async (book: Omit<Book, "id">): Promise<void> => {
  await addDoc(collection(db, "books"), book);
};

// Werk een boek bij
export const updateBook = async (id: string, updates: Partial<Book>): Promise<void> => {
  const bookRef = doc(db, "books", id);
  await updateDoc(bookRef, updates);
};

// Verwijder een boek
export const deleteBook = async (id: string): Promise<void> => {
  const bookRef = doc(db, "books", id);
  await deleteDoc(bookRef);
};
