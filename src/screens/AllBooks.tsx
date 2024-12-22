import React, { useEffect, useState } from 'react';
import {
    View,
    FlatList,
    TouchableOpacity,
    Text,
    StyleSheet,
    Dimensions,
    ImageBackground,
    Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LibraryStackParamList } from '../types/types';
import Card from '../components/Card';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
    collection,
    onSnapshot,
    deleteDoc,
    doc,
    getDoc,
    updateDoc,
    query,
    where,
} from 'firebase/firestore';
import { db, auth } from '../firebase/index';

interface Book {
    id: string;
    title: string;
    author: string;
    genre: string;
    year: number;
    description: string;
    favorite: boolean;
    uid: string; // Gebruiker die het boek heeft toegevoegd
}

type NavigationProp = StackNavigationProp<LibraryStackParamList, 'AllBooks'>;

type RouteParams = {
    newBook?: Book;
};

const AllBooks = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute();
    const routeParams = route.params as RouteParams;

    const [books, setBooks] = useState<Book[]>([]);
    const [localBooks, setLocalBooks] = useState<Book[]>([]); // Boeken voor anonieme gebruikers
    const screenWidth = Dimensions.get('window').width;
    const cardWidth = (screenWidth - 40) / 2;

    // Ophalen van boeken specifiek voor de ingelogde gebruiker
    useEffect(() => {
        if (!auth.currentUser || auth.currentUser.isAnonymous) {
            return;
        }

        const userUid = auth.currentUser.uid;
        const booksQuery = query(
            collection(db, 'books'),
            where('uid', '==', userUid)
        );

        const unsubscribe = onSnapshot(booksQuery, (snapshot) => {
            const booksData = snapshot.docs.map((doc) => ({
                id: doc.id, // Gebruik het Firebase-document-ID
                ...(doc.data() as Omit<Book, 'id'>),
            }));
            setBooks(booksData);
        });

        return () => unsubscribe();
    }, []);

    // Toevoegen van nieuw boek lokaal voor anonieme gebruikers
    useEffect(() => {
        if (auth.currentUser?.isAnonymous && routeParams?.newBook) {
            setLocalBooks((prevBooks) => [...prevBooks, routeParams.newBook!]);
        }
    }, [routeParams]);

    // Verwijder een boek
    const handleRemoveBook = async (id: string) => {
        try {
            if (auth.currentUser?.isAnonymous) {
                setLocalBooks((prevBooks) =>
                    prevBooks.filter((book) => book.id !== id)
                );
                return;
            }

            await deleteDoc(doc(db, 'books', id));
            Alert.alert('Success', 'Book deleted successfully.');
        } catch (error) {
            Alert.alert('Error', 'Failed to delete the book.');
            console.error(error);
        }
    };

    // Favoriet status wijzigen
    const toggleFavorite = async (id: string, currentFavorite: boolean) => {
        if (auth.currentUser?.isAnonymous) {
            // Werk favorietstatus bij in de lokale state
            setLocalBooks((prevBooks) =>
                prevBooks.map((book) =>
                    book.id === id ? { ...book, favorite: !currentFavorite } : book
                )
            );
            return;
        }

        try {
            // Firebase-logica voor ingelogde gebruikers
            const bookRef = doc(db, 'books', id);
            const bookSnap = await getDoc(bookRef);

            if (!bookSnap.exists()) {
                Alert.alert('Error', 'Book does not exist in Firebase.');
                return;
            }

            await updateDoc(bookRef, { favorite: !currentFavorite });
            Alert.alert('Success', 'Favorite status updated successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to update favorite status.');
            console.error(error);
        }
    };

    // Tellen van favorieten voor de Header
    const favoriteCount = auth.currentUser?.isAnonymous
        ? localBooks.filter((book) => book.favorite).length
        : books.filter((book) => book.favorite).length;

    return (
        <ImageBackground
            source={require('../assets/images/AllBooksBackground.jpg')}
            style={styles.background}
        >
            <FlatList
                data={auth.currentUser?.isAnonymous ? localBooks : books}
                renderItem={({ item }) => (
                    <View style={[styles.cardContainer, { width: cardWidth }]}>
                        <Card>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.author}>{item.author}</Text>
                            <View style={styles.iconContainer}>
                                {/* Bekijk details */}
                                <TouchableOpacity
                                    onPress={() =>
                                        navigation.navigate('BookDetails', {
                                            book: item,
                                        })
                                    }
                                >
                                    <AntDesign
                                        name="eye"
                                        size={24}
                                        color="black"
                                    />
                                </TouchableOpacity>

                                {/* Favoriet maken */}
                                <TouchableOpacity
                                    onPress={() =>
                                        toggleFavorite(item.id, item.favorite)
                                    }
                                >
                                    <Ionicons
                                        name="heart"
                                        size={24}
                                        color={
                                            item.favorite ? 'purple' : 'gray'
                                        }
                                    />
                                </TouchableOpacity>

                                {/* Verwijderen */}
                                <TouchableOpacity
                                    onPress={() => handleRemoveBook(item.id)}
                                >
                                    <MaterialIcons
                                        name="delete"
                                        size={24}
                                        color="red"
                                    />
                                </TouchableOpacity>
                            </View>
                        </Card>
                    </View>
                )}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.listContent}
            />
            {/* Voeg nieuw boek toe */}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() =>
                    navigation.navigate('NewBook', {
                        isAnonymous: !!auth.currentUser?.isAnonymous,
                    })
                }
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    listContent: {
        paddingHorizontal: 10,
        paddingBottom: 70,
    },
    cardContainer: {
        flex: 1,
        margin: 5,
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    author: {
        fontSize: 14,
        textAlign: 'center',
        color: 'gray',
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    addButton: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#007bff',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    addButtonText: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
    },
});

export default AllBooks;
