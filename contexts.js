/**
 * Simple React Native app that mimics https://pokebag.vercel.app/
 * 
 * Written by AT Mulyana
 * https://github.com/atmulyana/
 *
 * @format
 * @flow strict-local
 */
import {createContext} from "react";
import {Dimensions} from "react-native";

export const themes = {
    dark: {
        isDarkMode: true,
        color: 'white',
        background: 'black',
        secondBg: '#111',
        loading: {
            background: '#2f2722',
            highlight: '#1e1814'
        },
    },
    light: {
        isDarkMode: false,
        color: 'black',
        background: 'white',
        secondBg: '#eee',
        loading: {
            background: '#E1E9EE',
            highlight: '#F2F8FC'
        },
    },
};

export const Theme = createContext(themes.light);
export const ContentWidth = createContext(Dimensions.get('window').width);