import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import { Provider, useDispatch } from 'react-redux';
import { store, persistor } from './src/redux/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import AuthNavigator from './src/navigation/AuthNavigator';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/firebase/index';
import { setUserType } from './src/redux/features/books/booksSlice';

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user); // Controleer of een gebruiker is ingelogd

            // Zet het type gebruiker in Redux
            if (user) {
                const dispatch = store.dispatch;
                dispatch(setUserType(user.isAnonymous ? 'anonymous' : 'authenticated'));
            }

            setIsLoading(false); // Stop met laden
        });

        return unsubscribe; // Cleanup de listener bij unmount
    }, []);

    if (isLoading) {
        return null; // Of toon een laadscherm
    }

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <NavigationContainer>
                    {isLoggedIn ? <DrawerNavigator /> : <AuthNavigator />}
                </NavigationContainer>
            </PersistGate>
        </Provider>
    );
}
