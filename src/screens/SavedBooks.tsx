import React from 'react';
import {
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store/store';
import { toggleSaved } from '../redux/features/books/booksSlice';
import Card from '../components/Card';
import { Ionicons } from '@expo/vector-icons';

const SavedBooks = () => {
  const savedBooks = useSelector(
    (state: RootState) => state.books.savedBooks
  );
  const dispatch = useDispatch<AppDispatch>();

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
              onPress={() => dispatch(toggleSaved(item.id))}
              style={styles.unsaveButton}
            >
              <Ionicons name="bookmark" size={24} color="blue" />
            </TouchableOpacity>
          </Card>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No saved books yet.</Text>
        }
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Zorgt dat de afbeelding zich uitstrekt over het hele scherm
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
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});

export default SavedBooks;
