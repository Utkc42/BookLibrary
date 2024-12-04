import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LibraryStackParamList } from '../types/types';
import { RootState, AppDispatch } from '../redux/store/store';
import {
  removeBook,
  toggleSaved,
  toggleFavorite,
} from '../redux/features/books/booksSlice';
import Card from '../components/Card';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type NavigationProp = StackNavigationProp<LibraryStackParamList, 'AllBooks'>;

const AllBooks = () => {
  const navigation = useNavigation<NavigationProp>();
  const books = useSelector((state: RootState) => state.books.books);
  const savedBooks = useSelector(
    (state: RootState) => state.books.savedBooks
  );
  const dispatch = useDispatch<AppDispatch>();

  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - 40) / 2;

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
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('BookDetails', {
                      book: item,
                    })
                  }
                >
                  <AntDesign name="eye" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => dispatch(toggleSaved(item.id))}
                >
                  <Ionicons
                    name="bookmark"
                    size={24}
                    color={
                      savedBooks.some((book) => book.id === item.id)
                        ? 'blue'
                        : 'black'
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => dispatch(toggleFavorite(item.id))}
                >
                  <Ionicons
                    name="heart"
                    size={24}
                    color={item.favorite ? 'purple' : 'gray'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => dispatch(removeBook(item.id))}
                >
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
    resizeMode: 'cover', // Zorg dat de afbeelding wordt geschaald
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
