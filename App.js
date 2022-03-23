/**
 * Simple React Native app that mimics https://pokebag.vercel.app/
 * 
 * Written by AT Mulyana
 * https://github.com/atmulyana/
 *
 * @format
 * @flow strict-local
 */
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';
import type {Node} from 'react';
import {
    Dimensions,
    Platform,
    StatusBar,
    useColorScheme,
} from 'react-native';
import {SafeAreaInsetsContext, SafeAreaProvider} from 'react-native-safe-area-context';
import {ContentWidth, Theme, themes} from './contexts';
import {contentPadding} from './globals';

import Home from './screens/Home';
import Pokebag from './screens/Pokebag';
import Detail from './screens/Detail';
const screens = [Home, Pokebag, Detail];

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

const App: () => Node = () => {
    const [windowWidth, setWindowWidth] = React.useState(Dimensions.get('window').width);
    const schemeColor = useColorScheme();

    React.useEffect(
        () => {
            const listener = Dimensions.addEventListener('change', () => setWindowWidth(Dimensions.get('window').width));
            return () => listener.remove();
        },
        []
    );

    return <SafeAreaProvider><SafeAreaInsetsContext.Consumer>{insets =>
        <ContentWidth.Provider value={windowWidth - 2 * contentPadding - insets.left - insets.right}>
            <Theme.Provider value={themes[schemeColor] ?? themes.light}><Theme.Consumer>{theme =>
                <GestureHandlerRootView style={{backgroundColor: theme.secondBg, position: 'absolute', ...insets}}>
                    <StatusBar barStyle={theme.isDarkMode ? 'light-content' : 'dark-content'} />
                    <NavigationContainer>
                        <Stack.Navigator initialRouteName={Home.name} screenOptions={{
                            animationEnabled: Platform.OS == 'android', //On iOS, animation keeps issueing warning log
                            headerShown: false,
                            headerStatusBarHeight: 0,
                        }}>
                            {screens.map((Component, idx) =>
                                <Stack.Screen
                                    key={idx}
                                    name={Component.name}
                                    component={Component}
                                />
                            )}
                        </Stack.Navigator>
                    </NavigationContainer>
                </GestureHandlerRootView>
            }</Theme.Consumer></Theme.Provider>
        </ContentWidth.Provider>
    }</SafeAreaInsetsContext.Consumer></SafeAreaProvider>
};

export default App;
