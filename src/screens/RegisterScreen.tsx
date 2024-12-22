import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    ImageBackground,
    StyleSheet,
    Alert,
    TouchableOpacity,
} from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/index';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../types/types';

type NavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const navigation = useNavigation<NavigationProp>();

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match!');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            );

            if (userCredential.user) {
                await updateProfile(userCredential.user, { displayName });
                Alert.alert('Success', 'Account created successfully!');
                navigation.navigate('Login');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to register. Please try again.');
            console.error('Register Error:', error);
        }
    };

    return (
        <ImageBackground
            source={require('../assets/images/RegisterBackground.jpg')}
            style={styles.background}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Register</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Display Name"
                    value={displayName}
                    onChangeText={setDisplayName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleRegister}
                >
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.registerButton]}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.buttonText}>
                        Already have an account? Login here
                    </Text>
                </TouchableOpacity>
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        marginTop: 45, // Titel en inhoud dichterbij brengen
    },
    title: {
        fontSize: 55, // Nog iets groter voor extra nadruk
        fontWeight: 'bold', // Vetgedrukt
        color: '#fff',
        textShadowColor: 'black',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
        marginBottom: 40, // Meer ruimte onder de titel
    },
    input: {
        width: '90%',
        height: 50, // Grotere invoervelden
        borderWidth: 2, // Dikkere rand
        borderColor: '#000', // Zwarte rand
        borderRadius: 10, // Meer afgeronde hoeken
        marginBottom: 20,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        fontSize: 18, // Groter lettertype
        elevation: 3, // Licht schaduweffect
    },
    button: {
        width: '90%',
        backgroundColor: '#0056b3', // Donkerder blauw voor meer contrast
        paddingVertical: 15, // Grotere hoogte van de knoppen
        borderWidth: 2, // Dikkere rand
        borderColor: '#000', // Zwarte rand
        borderRadius: 10,
        marginBottom: 15,
        alignItems: 'center',
        elevation: 5, // Schaduw voor diepte
    },
    registerButton: {
        backgroundColor: '#0082C9', // Kleur voor de Register knop
        marginTop: 20, // Extra ruimte boven de knop
    },
    guestButton: {
        backgroundColor: '#198754', // Donkerdere tint groen voor gastenlogin
        borderColor: '#000', // Zwarte rand
        borderWidth: 2, // Dikkere rand
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18, // Grotere tekst
    },
    spacedButton: {
        marginTop: 20, // Extra ruimte boven deze knop
    },
    registerText: {
        color: '#fff',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});

export default RegisterScreen;
