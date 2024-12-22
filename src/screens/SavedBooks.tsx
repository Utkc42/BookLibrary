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

interface Book {
    id: string;
    title: string;
    author: string;
    description: string;
    genre: string;
    year: number;
    favorite: boolean;
    uid: string; // Gebruiker die het boek heeft toegevoegd
}

const SavedBooks = () => {
    const [savedBooks, setSavedBooks] = useState<Book[]>([]);

    // Ophalen van favoriete boeken van de ingelogde gebruiker
    useEffect(() => {
        if (!auth.currentUser) {
            Alert.alert('Error', 'User not authenticated.');
            return;
        }

        const userUid = auth.currentUser.uid;
        const booksQuery = query(
            collection(db, 'books'),
            where('favorite', '==', true),
            where('uid', '==', userUid) // Filter op basis van de huidige gebruiker
        );

        const unsubscribe = onSnapshot(booksQuery, (snapshot) => {
            const booksData = snapshot.docs.map((doc) => {
                const data = doc.data() as Omit<Book, 'id'>;
                return { id: doc.id, ...data };
            });
            setSavedBooks(booksData);
        });
        return () => unsubscribe();
    }, []);

    // Favoriet status toggelen (unsave)
    const toggleFavorite = async (id: string) => {
        try {
            const bookRef = doc(db, 'books', id);
            await updateDoc(bookRef, { favorite: false });
            Alert.alert('Success', 'Book removed from favorites.');
        } catch (error) {
            Alert.alert('Error', 'Failed to update favorite status.');
            console.error(error);
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
                            onPress={() => toggleFavorite(item.id)}
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
