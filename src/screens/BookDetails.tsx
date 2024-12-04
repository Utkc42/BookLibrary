import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import Card from '../components/Card';
import { LibraryStackParamList } from '../types/types';
import { RouteProp } from '@react-navigation/native';

type BookDetailsRouteProp = RouteProp<LibraryStackParamList, 'BookDetails'>;

interface BookDetailsProps {
  route: BookDetailsRouteProp;
}

const BookDetails: React.FC<BookDetailsProps> = ({ route }) => {
  const { book } = route.params;

  return (
    <ImageBackground
      source={require('../assets/images/BookDetailsBackground.jpg')}
      style={styles.background}
    >
    <View style={styles.container}>
      <View style={styles.content}>
        <Card>
          <Text style={styles.label}>Title</Text>
          <Text style={styles.text}>{book.title}</Text>

          <Text style={styles.label}>Author</Text>
          <Text style={styles.text}>{book.author}</Text>

          <Text style={styles.label}>Genre</Text>
          <Text style={styles.text}>{book.genre}</Text>

          <Text style={styles.label}>Publication Year</Text>
          <Text style={styles.text}>{book.year}</Text>

          <Text style={styles.label}>Description</Text>
          <Text style={styles.text}>{book.description}</Text>
        </Card>
      </View>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    marginTop: 25,
  },
  content: {
    padding: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
    marginTop: 15,
    marginBottom: 5,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
});

export default BookDetails;
