import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/index';
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
}

const SavedBooks = () => {
    const [savedBooks, setSavedBooks] = useState<Book[]>([]);

    // Ophalen van favoriete boeken uit Firestore
    useEffect(() => {
        const q = query(collection(db, 'books'), where('favorite', '==', true));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const booksData = snapshot.docs.map((doc) => {
                const data = doc.data() as Omit<Book, 'id'>;
                return { id: doc.id, ...data };
            });
            setSavedBooks(booksData);
        });
        return () => unsubscribe();
    }, []);

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
                        <Text style={styles.description}>
                            {item.description}
                        </Text>
                        <TouchableOpacity
                            style={styles.unsaveButton}
                            onPress={() =>
                                // Unsave (toggle favorite status)
                                console.log('Unsaved book:', item.id)
                            }
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
