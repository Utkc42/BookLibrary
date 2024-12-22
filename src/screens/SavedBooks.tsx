import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    Alert,
} from 'react-native';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase/index';
import Card from '../components/Card';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store/store';
import { toggleFavorite, selectSavedBooks } from '../redux/features/books/booksSlice';
import { Book } from '../types/types';

const SavedBooks = () => {
    const userType = useSelector((state: RootState) => state.books.userType);
    const sessionBooks = useSelector((state: RootState) => selectSavedBooks(state));
    const [savedBooks, setSavedBooks] = useState(sessionBooks); // Standaard is sessionBooks
    const dispatch = useDispatch();

    useEffect(() => {
        if (userType === 'authenticated' && auth.currentUser) {
            const userUid = auth.currentUser.uid;
            const booksQuery = query(
                collection(db, 'books'),
                where('favorite', '==', true),
                where('uid', '==', userUid)
            );

            const unsubscribe = onSnapshot(booksQuery, (snapshot) => {
                const booksData = snapshot.docs.map((doc) => {
                    const { id, ...data } = doc.data() as Book; // Voorkom dubbele 'id'
                    return {
                        id: doc.id, // Gebruik de Firebase-document ID
                        ...data, // Voeg overige velden toe
                    };
                });
                setSavedBooks(booksData); // Update de staat met de correcte `Book[]`
            });            
            
            
            return () => unsubscribe();
        } else {
            setSavedBooks(sessionBooks); // Bijwerken voor anonieme gebruikers
        }
    }, [userType, sessionBooks]);

    const handleToggleFavorite = async (id: string) => {
        if (userType === 'anonymous') {
            dispatch(toggleFavorite(id));
        } else {
            try {
                const bookRef = doc(db, 'books', id);
                await updateDoc(bookRef, { favorite: false });
                Alert.alert('Success', 'Book removed from favorites.');
            } catch (error) {
                Alert.alert('Error', 'Failed to update favorite status.');
                console.error(error);
            }
        }
    };

    return (
        <ImageBackground
            source={require('../assets/images/SavedBooksBackground.jpg')}
            style={styles.background}
        >
            <FlatList
                data={savedBooks}
                renderItem={({ item }) => (
                    <Card>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.author}>{item.author}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                        <TouchableOpacity
                            style={styles.unsaveButton}
                            onPress={() => handleToggleFavorite(item.id)}
                        >
                            <Ionicons name="bookmark" size={24} color="blue" />
                        </TouchableOpacity>
                    </Card>
                )}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No saved books yet</Text>
                }
            />
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    author: {
        fontSize: 14,
        textAlign: 'center',
        color: 'gray',
    },
    description: {
        fontSize: 12,
        textAlign: 'center',
        color: 'gray',
        marginTop: 5,
    },
    unsaveButton: {
        alignSelf: 'center',
        marginTop: 10,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 160,
        fontSize: 25,
        color: 'white',
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
});

export default SavedBooks;
