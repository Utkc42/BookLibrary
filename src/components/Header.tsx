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
import { db, auth } from '../firebase/index';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { selectFavoritesCount, selectSavedBooks } from '../redux/features/books/booksSlice';
import { RootState } from '../redux/store/store';

interface HeaderProps {
    title?: string;
    showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton }) => {
    const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
    const [firebaseFavoriteCount, setFirebaseFavoriteCount] = useState(0);

    // Haal het aantal favorieten op voor anonieme gebruikers uit Redux
    const anonymousFavoriteCount = useSelector(selectFavoritesCount);
    const userType = useSelector((state: RootState) => state.books.userType);

    useEffect(() => {
        if (auth.currentUser && userType === 'authenticated') {
            // Firestore-query voor ingelogde gebruikers
            const userUid = auth.currentUser.uid;
            const favoritesQuery = query(
                collection(db, 'books'),
                where('favorite', '==', true),
                where('uid', '==', userUid),
            );

            const unsubscribe = onSnapshot(favoritesQuery, (snapshot) => {
                setFirebaseFavoriteCount(snapshot.docs.length);
            });

            return () => unsubscribe();
        }
    }, [auth.currentUser, userType]);

    const favoriteCount =
        userType === 'anonymous' ? anonymousFavoriteCount : firebaseFavoriteCount;

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
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold',
        marginTop: 20,
    },
    favoritesContainer: {
        position: 'absolute',
        right: 10,
        top: 30,
        flexDirection: 'row',
        alignItems: 'center',
    },
    favoriteCount: {
        position: 'absolute',
        right: 10,
        top: 40,
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Header;
