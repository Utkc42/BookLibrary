import React, { useEffect } from 'react';
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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store/store';
import {
    removeBook,
    toggleFavorite,
    addBook,
} from '../redux/features/books/booksSlice';
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
    query,
    where,
    updateDoc,
} from 'firebase/firestore';
import { db, auth } from '../firebase/index';
import { StackNavigationProp } from '@react-navigation/stack';

type NavigationProp = StackNavigationProp<LibraryStackParamList, 'AllBooks'>;

const AllBooks: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProp<LibraryStackParamList, 'AllBooks'>>(); // Voeg route toe
    const dispatch = useDispatch();

    const userType = useSelector((state: RootState) => state.books.userType);
    const sessionBooks = useSelector((state: RootState) => state.books.sessionBooks);

    const [books, setBooks] = React.useState<any[]>([]);

    const screenWidth = Dimensions.get('window').width;
    const cardWidth = (screenWidth - 40) / 2;

    useEffect(() => {
        if (userType === 'authenticated') {
            const userUid = auth.currentUser?.uid;
            if (!userUid) return;

            const booksQuery = query(
                collection(db, 'books'),
                where('uid', '==', userUid)
            );

            const unsubscribe = onSnapshot(booksQuery, (snapshot) => {
                const booksData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...(doc.data() as Omit<any, 'id'>),
                }));
                setBooks(booksData);
            });

            return () => unsubscribe();
        }
    }, [userType]);

    useEffect(() => {
        if (userType === 'anonymous' && route.params?.newBook) {
            dispatch(addBook(route.params.newBook)); // Voeg toe aan Redux
            navigation.setParams({ newBook: undefined }); // Reset de parameter
        }
    }, [route.params?.newBook]);

    const handleRemoveBook = async (id: string) => {
        if (!id) {
            Alert.alert('Error', 'Invalid book ID.');
            return;
        }

        if (userType === 'anonymous') {
            dispatch(removeBook(id));
        } else {
            try {
                await deleteDoc(doc(db, 'books', id));
                Alert.alert('Success', 'Book deleted successfully.');
            } catch (error) {
                Alert.alert('Error', 'Failed to delete the book.');
                console.error(error);
            }
        }
    };

    const handleToggleFavorite = async (id: string, currentFavorite: boolean) => {
        if (!id) {
            Alert.alert('Error', 'Invalid book ID.');
            return;
        }

        if (userType === 'anonymous') {
            dispatch(toggleFavorite(id));
        } else {
            try {
                const bookRef = doc(db, 'books', id);
                await updateDoc(bookRef, { favorite: !currentFavorite });
            } catch (error) {
                Alert.alert('Error', 'Failed to update favorite status.');
                console.error(error);
            }
        }
    };

    const displayedBooks = userType === 'anonymous' ? sessionBooks : books;

    return (
        <ImageBackground
            source={require('../assets/images/AllBooksBackground.jpg')}
            style={styles.background}
        >
            <FlatList
                data={displayedBooks}
                renderItem={({ item }) => (
                    <View style={[styles.cardContainer, { width: cardWidth }]}>
                        <Card>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.author}>{item.author}</Text>
                            <View style={styles.iconContainer}>
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
                                <TouchableOpacity
                                    onPress={() => handleToggleFavorite(item.id!, item.favorite)}
                                >
                                    <Ionicons
                                        name="heart"
                                        size={24}
                                        color={item.favorite ? 'purple' : 'gray'}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleRemoveBook(item.id!)}
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
                keyExtractor={(item) =>
                    item.id ?? `local-${Math.random().toString(36).substring(2, 9)}`
                }
                numColumns={2}
                contentContainerStyle={styles.listContent}
            />
            <TouchableOpacity
                style={styles.addButton}
                onPress={() =>
                    navigation.navigate('NewBook', {
                        isAnonymous: userType === 'anonymous',
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
