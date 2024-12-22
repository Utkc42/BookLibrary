import { db, auth } from "./index";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Book } from "../types/types";

// Haal boeken op voor de ingelogde gebruiker
export const getAllBooksForUser = async (): Promise<Book[]> => {
  if (!auth.currentUser) {
    throw new Error("User is not authenticated");
  }

  const userUid = auth.currentUser.uid;
  const booksQuery = query(
    collection(db, "books"),
    where("uid", "==", userUid) // Filter op basis van de huidige gebruiker
  );

  const querySnapshot = await getDocs(booksQuery);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Book, "id">),
  }));
};

// Voeg een nieuw boek toe voor de ingelogde gebruiker
export const addBook = async (book: Omit<Book, "id" | "uid">): Promise<void> => {
  if (!auth.currentUser) {
    throw new Error("User is not authenticated");
  }

  const userUid = auth.currentUser.uid;

  await addDoc(collection(db, "books"), {
    ...book,
    uid: userUid, // Koppel het boek aan de gebruiker
    createdAt: new Date().toISOString(),
  });
};

// Werk een boek bij
export const updateBook = async (
  id: string,
  updates: Partial<Omit<Book, "id">>
): Promise<void> => {
  const bookRef = doc(db, "books", id);
  await updateDoc(bookRef, updates);
};

// Verwijder een boek
export const deleteBook = async (id: string): Promise<void> => {
  const bookRef = doc(db, "books", id);
  await deleteDoc(bookRef);
};
