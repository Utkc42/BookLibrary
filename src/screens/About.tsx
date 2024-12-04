import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

const About = () => {
  return (
    <ImageBackground
      source={require('../assets/images/AboutBackground.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.content}>
            Welcome to the Library App! This app allows you to manage your
            book collection. You can add books, view details, save your
            favorites, and explore your personal library. Enjoy discovering
            and organizing your favorite reads!
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  textContainer: {
    backgroundColor: 'white', 
    padding: 15,
    borderRadius: 10, 
  },
  content: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 30,
  },
});

export default About;
