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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LibraryStackParamList } from '../types/types';
import Card from '../components/Card';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase/index';

type NavigationProp = StackNavigationProp<LibraryStackParamList, 'AllBooks'>;

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  year: number;
  description: string;
  favorite: boolean;
}

const AllBooks = () => {
  const navigation = useNavigation<NavigationProp>();
  const [books, setBooks] = useState<Book[]>([]);

  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - 40) / 2;

  // Ophalen van boeken uit Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'books'), (snapshot) => {
      const booksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data()as Omit<Book, 'id'>),
      }));
      setBooks(booksData);
    });
    return () => unsubscribe();
  }, []);

  // Verwijder een boek
  const handleRemoveBook = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'books', id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete the book.');
      console.error(error);
    }
  };

  // Favoriet status wijzigen
  const toggleFavorite = async (id: string, currentFavorite: boolean) => {
    try {
      const bookRef = doc(db, 'books', id);
      await updateDoc(bookRef, { favorite: !currentFavorite });
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorite status.');
      console.error(error);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/AllBooksBackground.jpg')}
      style={styles.background}
    >
      <FlatList
        data={books}
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
                  <AntDesign name="eye" size={24} color="black" />
                </TouchableOpacity>

                {/* Favoriet maken */}
                <TouchableOpacity
                  onPress={() => toggleFavorite(item.id, item.favorite)}
                >
                  <Ionicons
                    name="heart"
                    size={24}
                    color={item.favorite ? 'purple' : 'gray'}
                  />
                </TouchableOpacity>

                {/* Verwijderen */}
                <TouchableOpacity onPress={() => handleRemoveBook(item.id)}>
                  <MaterialIcons name="delete" size={24} color="red" />
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
        onPress={() => navigation.navigate('NewBook')}
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
