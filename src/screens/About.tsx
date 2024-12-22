import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { auth } from '../firebase/index';

const About: React.FC = () => {
  const [userInfo, setUserInfo] = useState<{
    displayName: string | null;
    email: string | null;
    isAnonymous: boolean;
  }>({
    displayName: null,
    email: null,
    isAnonymous: false,
  });

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUserInfo({
        displayName: currentUser.displayName,
        email: currentUser.email,
        isAnonymous: currentUser.isAnonymous,
      });
    }
  }, []);

  return (
    <ImageBackground
      source={require('../assets/images/AboutBackground.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.textContainer}>
          {userInfo.isAnonymous ? (
            <>
              <Text style={styles.title}>Anonymous User</Text>
              <Text style={styles.content}>
                You are currently exploring the app as an anonymous user.
                Changes you make will not be saved.
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.title}>About You</Text>
              <View style={styles.infoContainer}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.content}>
                  {userInfo.displayName || 'Not provided'}
                </Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.content}>
                  {userInfo.email || 'Not provided'}
                </Text>
              </View>
            </>
          )}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparant wit
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Schaduw voor Android
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#406E8E', // Blauw tint voor labels
  },
  content: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 5,
    lineHeight: 25,
    color: '#555',
  },
  infoContainer: {
    marginVertical: 10, // Ruimte tussen de items
    alignItems: 'center',
  },
});

export default About;
