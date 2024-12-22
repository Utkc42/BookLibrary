import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LibraryStackNavigator from './LibraryStackNavigator';
import SavedBooks from '../screens/SavedBooks';
import About from '../screens/About';
import Header from '../components/Header';
import { auth } from '../firebase/index'; // Zorg ervoor dat auth correct is geïmporteerd
import { signOut } from 'firebase/auth';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props: any) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="LibraryStack"
      screenOptions={({ route }) => ({
        header: () => <Header title={route.name} />,
      })}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="LibraryStack"
        component={LibraryStackNavigator}
        initialParams={{ newBook: undefined }}
        options={{
          title: 'All Books',
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="SavedBooks"
        component={SavedBooks}
        options={{
          title: 'Saved Books',
          header: () => <Header title="Saved Books" />,
        }}
      />
      <Drawer.Screen
        name="About"
        component={About}
        options={{
          title: 'About',
          header: () => <Header title="About" />,
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  logoutContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  logoutButton: {
    backgroundColor: 'red',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DrawerNavigator;
