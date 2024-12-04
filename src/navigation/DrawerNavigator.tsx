import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LibraryStackNavigator from './LibraryStackNavigator';
import SavedBooks from '../screens/SavedBooks';
import About from '../screens/About';
import Header from '../components/Header';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="LibraryStack"
      screenOptions={({ route }) => ({
        header: () => <Header title={route.name} />, 
      })}
    >
      <Drawer.Screen
        name="LibraryStack"
        component={LibraryStackNavigator}
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

export default DrawerNavigator;
