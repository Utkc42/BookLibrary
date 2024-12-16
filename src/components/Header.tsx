import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../types/types';
import { db } from '../firebase/index';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

interface HeaderProps {
    title?: string;
    showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton }) => {
    const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
    const [favoriteCount, setFavoriteCount] = useState(0);

    // Realtime updates voor het aantal favorieten
    useEffect(() => {
        const q = query(collection(db, 'books'), where('favorite', '==', true));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setFavoriteCount(snapshot.docs.length); // Aantal favorieten bijwerken
        });

        return () => unsubscribe(); // Cleanup bij demontage
    }, []);

    return (
        <ImageBackground
            source={require('../assets/images/header.jpg')}
            style={styles.header}
        >
            {!showBackButton && (
                <TouchableOpacity
                    onPress={() => navigation.toggleDrawer()}
                    style={styles.menuButton}
                >
                    <Ionicons name="menu" size={32} color="white" />
                </TouchableOpacity>
            )}
            {showBackButton && (
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={32} color="white" />
                </TouchableOpacity>
            )}
            {/* Titel */}
            <Text style={styles.title}>{title}</Text>
            {/* Favorieten */}
            <View style={styles.favoritesContainer}>
                <Ionicons name="heart" size={24} color="purple" />
                <Text style={styles.favoriteCount}>
                    Favorites: {favoriteCount}
                </Text>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 100,
        marginTop: 25,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        position: 'relative',
    },
    menuButton: {
        position: 'absolute',
        left: 10,
        top: 40,
    },
    backButton: {
        position: 'absolute',
        left: 10,
        top: 40,
    },
    title: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
        marginTop: 40,
    },
    favoritesContainer: {
        position: 'absolute',
        right: 10,
        top: 40,
        flexDirection: 'row',
        alignItems: 'center',
    },
    favoriteCount: {
        position: 'absolute',
        right: 10,
        top: 40,
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Header;
