import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import { Ionicons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../types/types';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton }) => {
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const favoriteCount = useSelector(
    (state: RootState) => state.books.books.filter((book) => book.favorite).length
  );

  return (
    <ImageBackground
      source={require('../assets/images/header.jpg')}
      style={styles.header}
    >
      {!showBackButton && (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.menuButton}>
          <Ionicons name="menu" size={32} color="white" />
        </TouchableOpacity>
      )}
      {showBackButton && (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={32} color="white" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.favoriteCount}>Favorites.: {favoriteCount}</Text>
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
