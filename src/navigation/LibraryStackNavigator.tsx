import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LibraryStackParamList } from '../types/types';
import AllBooks from '../screens/AllBooks';
import BookDetails from '../screens/BookDetails';
import NewBook from '../screens/NewBook';
import SavedBooks from '../screens/SavedBooks';
import About from '../screens/About';
import Header from '../components/Header';

const Stack = createStackNavigator<LibraryStackParamList>();

const LibraryStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="AllBooks">
      <Stack.Screen
        name="AllBooks"
        component={AllBooks}
        options={{
          header: () => <Header title="All Books" />,
        }}
      />
      <Stack.Screen
        name="BookDetails"
        component={BookDetails}
        options={{
          header: () => <Header title="Book Details" showBackButton={true} />,
        }}
      />
      <Stack.Screen
        name="SavedBooks"
        component={SavedBooks}
        options={{
          header: () => <Header title="Saved Books" />,
        }}
      />
      <Stack.Screen
        name="NewBook"
        component={NewBook}
        options={{
          header: () => null, 
        }}
      />
      <Stack.Screen
        name="About"
        component={About}
        options={{
          header: () => <Header title="About" />,
        }}
      />
    </Stack.Navigator>
  );
};

export default LibraryStackNavigator;
