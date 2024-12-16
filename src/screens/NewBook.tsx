import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ImageBackground,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/index';

const NewBook: React.FC = () => {
  const navigation = useNavigation();

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .min(4, 'Title must be at least 4 characters')
      .required('Title is required'),
    author: Yup.string()
      .min(3, 'Author name must be at least 3 characters')
      .notRequired(),
    genre: Yup.string().required('Genre is required'),
    year: Yup.number()
      .min(1000, 'Enter a valid year')
      .max(new Date().getFullYear(), 'Year cannot be in the future')
      .required('Year is required'),
    description: Yup.string()
      .min(8, 'Description must be at least 8 characters')
      .required('Description is required'),
  });

  const checkDuplicateTitle = async (title: string) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'books'));
      return querySnapshot.docs.some((doc) => doc.data().title === title);
    } catch (error) {
      console.error('Error checking duplicates: ', error);
      return false;
    }
  };

  const handleAddBook = async (values: any) => {
    try {
      const isDuplicate = await checkDuplicateTitle(values.title);

      if (isDuplicate) {
        Alert.alert(
          'Duplicate Entry',
          'A book with this title already exists.',
          [{ text: 'OK' }]
        );
        return;
      }

      await addDoc(collection(db, 'books'), {
        title: values.title,
        author: values.author,
        genre: values.genre,
        year: parseInt(values.year, 10),
        description: values.description,
        favorite: false,
      });

      Alert.alert('Success', 'Book added successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to add the book.');
      console.error('Error adding book: ', error);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/AddBookBackground.jpg')}
      style={styles.background}
    >
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.screenTitle}>Add New Book</Text>

            <Formik
              initialValues={{
                title: '',
                author: '',
                genre: '',
                year: '',
                description: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleAddBook}
            >
              {({
                handleChange,
                handleSubmit,
                values,
                errors,
                touched,
                setFieldTouched,
              }) => (
                <View style={styles.formContainer}>
                  <Text style={styles.label}>Title</Text>
                  <TextInput
                    placeholder="Enter the book title"
                    onChangeText={handleChange('title')}
                    onBlur={() => setFieldTouched('title')}
                    value={values.title}
                    style={styles.input}
                  />
                  {errors.title && touched.title && (
                    <Text style={styles.error}>{errors.title}</Text>
                  )}

                  <Text style={styles.label}>Author</Text>
                  <TextInput
                    placeholder="Enter the author's name"
                    onChangeText={handleChange('author')}
                    onBlur={() => setFieldTouched('author')}
                    value={values.author}
                    style={styles.input}
                  />
                  {errors.author && touched.author && (
                    <Text style={styles.error}>{errors.author}</Text>
                  )}

                  <Text style={styles.label}>Genre</Text>
                  <TextInput
                    placeholder="Enter the genre"
                    onChangeText={handleChange('genre')}
                    onBlur={() => setFieldTouched('genre')}
                    value={values.genre}
                    style={styles.input}
                  />
                  {errors.genre && touched.genre && (
                    <Text style={styles.error}>{errors.genre}</Text>
                  )}

                  <Text style={styles.label}>Publication Year</Text>
                  <TextInput
                    placeholder="Enter the publication year"
                    onChangeText={handleChange('year')}
                    onBlur={() => setFieldTouched('year')}
                    value={values.year}
                    keyboardType="numeric"
                    style={styles.input}
                  />
                  {errors.year && touched.year && (
                    <Text style={styles.error}>{errors.year}</Text>
                  )}

                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    placeholder="Enter a short description"
                    onChangeText={handleChange('description')}
                    onBlur={() => setFieldTouched('description')}
                    value={values.description}
                    style={styles.input}
                    multiline
                  />
                  {errors.description && touched.description && (
                    <Text style={styles.error}>{errors.description}</Text>
                  )}

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => handleSubmit()}
                  >
                    <Text style={styles.submitButtonText}>Add New Book</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginLeft: 15,
  },
  screenTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginVertical: 20,
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    marginTop: -10,
    marginBottom: 10,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NewBook;
