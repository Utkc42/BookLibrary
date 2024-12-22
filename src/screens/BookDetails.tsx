import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
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
        <View style={styles.card}>
          <Text style={styles.title}>{book.title}</Text>

          <View style={styles.detailContainer}>
            <Text style={styles.label}>Author:</Text>
            <Text style={styles.text}>{book.author}</Text>
          </View>

          <View style={styles.detailContainer}>
            <Text style={styles.label}>Genre:</Text>
            <Text style={styles.text}>{book.genre}</Text>
          </View>

          <View style={styles.detailContainer}>
            <Text style={styles.label}>Publication Year:</Text>
            <Text style={styles.text}>{book.year}</Text>
          </View>

          <View style={styles.detailContainer}>
            <Text style={styles.label}>Description:</Text>
            <Text style={styles.text}>{book.description}</Text>
          </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  detailContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#406E8E',
  },
  text: {
    fontSize: 18,
    color: '#555',
    marginTop: 5,
    lineHeight: 24,
  },
});

export default BookDetails;
