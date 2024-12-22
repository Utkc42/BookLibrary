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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { addDoc, collection, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase/index';
import { LibraryStackParamList, Book } from '../types/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import { addBook } from '../redux/features/books/booksSlice';

type NavigationProp = StackNavigationProp<LibraryStackParamList, 'NewBook'>;
type NewBookRouteProp = RouteProp<LibraryStackParamList, 'NewBook'>;

const NewBook: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const dispatch = useDispatch();
    const route = useRoute<NewBookRouteProp>();
    const { isAnonymous } = route.params;

    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .min(4, 'Title must be at least 4 characters')
            .required('Title is required'),
        author: Yup.string()
            .min(3, 'Author name must be at least 3 characters')
            .required('Author is required'),
        genre: Yup.string().required('Genre is required'),
        year: Yup.number()
            .min(1000, 'Enter a valid year')
            .max(new Date().getFullYear(), 'Year cannot be in the future')
            .required('Year is required'),
        description: Yup.string().required('Description is required'),
    });

    const handleAddBook = async (values: any) => {
        try {
            const newBook = {
                title: values.title,
                author: values.author,
                genre: values.genre,
                year: parseInt(values.year, 10),
                description: values.description,
                favorite: false,
            };

            if (isAnonymous) {
                const localBook: Book = {
                    ...newBook,
                    id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                };
                dispatch(addBook(localBook)); // Voeg het boek toe aan Redux
                navigation.navigate('AllBooks', { newBook: localBook }); // Geef de parameter mee
                return;
            }

            if (!auth.currentUser) {
                Alert.alert('Error', 'User not authenticated.');
                return;
            }

            // Voeg een nieuw document toe aan Firestore en haal het gegenereerde ID op
            const docRef = await addDoc(collection(db, 'books'), {
                ...newBook,
                uid: auth.currentUser.uid,
            });

            // Gebruik het Firestore-document-ID
            await updateDoc(doc(db, 'books', docRef.id), {
                id: docRef.id,
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
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color="#fff"
                            />
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
                                    {Object.entries(values).map(
                                        ([field, value]) => (
                                            <View key={field}>
                                                <Text style={styles.label}>
                                                    {field
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        field.slice(1)}
                                                </Text>
                                                <TextInput
                                                    placeholder={`Enter the ${field}`}
                                                    onChangeText={handleChange(
                                                        field,
                                                    )}
                                                    onBlur={() =>
                                                        setFieldTouched(field)
                                                    }
                                                    value={value as string}
                                                    style={styles.input}
                                                    keyboardType={
                                                        field === 'year'
                                                            ? 'numeric'
                                                            : 'default'
                                                    }
                                                    multiline={
                                                        field === 'description'
                                                    }
                                                />
                                                {errors[
                                                    field as keyof typeof errors
                                                ] &&
                                                    touched[
                                                        field as keyof typeof touched
                                                    ] && (
                                                        <Text
                                                            style={styles.error}
                                                        >
                                                            {
                                                                errors[
                                                                    field as keyof typeof errors
                                                                ]
                                                            }
                                                        </Text>
                                                    )}
                                            </View>
                                        ),
                                    )}
                                    <TouchableOpacity
                                        style={styles.submitButton}
                                        onPress={() => handleSubmit()}
                                    >
                                        <Text style={styles.submitButtonText}>
                                            Add New Book
                                        </Text>
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
    background: { flex: 1, resizeMode: 'cover' },
    container: { flex: 1, marginTop: 25 },
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
    formContainer: { flex: 1, padding: 20, justifyContent: 'flex-start' },
    label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    input: {
        borderWidth: 1,
        borderColor: '#007bff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    error: { color: 'red', marginTop: -10, marginBottom: 10, fontSize: 14 },
    submitButton: {
        backgroundColor: 'green',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default NewBook;
