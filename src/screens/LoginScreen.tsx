import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Alert,
} from 'react-native';
import { signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { auth } from '../firebase/index';

const LoginScreen: React.FC = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            //Alert.alert('Success', 'Logged in successfully!');
        } catch (error) {
            Alert.alert(
                'Error',
                'This login does not exist.',
            );
            console.error(error);
        }
    };

    const handleAnonymousLogin = async () => {
        try {
            await signInAnonymously(auth);
            Alert.alert('Success', 'Logged in as a guest!');
        } catch (error) {
            Alert.alert('Error', 'Failed to login anonymously.');
            console.error(error);
        }
    };

    return (
        <ImageBackground
            source={require('../assets/images/LoginBackground.jpg')}
            style={styles.background}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Login</Text>
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
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.registerButton]}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.guestButton]}
                    onPress={handleAnonymousLogin}
                >
                    <Text style={styles.buttonText}>Login as Guest</Text>
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

export default LoginScreen;
