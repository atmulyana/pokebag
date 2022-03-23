/**
 * Simple React Native app that mimics https://pokebag.vercel.app/
 * 
 * Written by AT Mulyana
 * https://github.com/atmulyana/
 *
 * @format
 * @flow strict-local
 */
import {Alert} from 'react-native';

export const BASE_URL = 'https://pokeapi.co/api/v2/';
export const contentPadding = 10;

export function callServer(url, callback, method='GET') {
    return (url
            ? fetch(/^https?:/.test(url) ? url : `${BASE_URL}${url}`, {method})
            : Promise.resolve(null)
        )
        .then(response => response?.json())
        .then(data => {
            typeof(callback) == 'function' && callback(data);
            return data;
        })
        .catch(err => {
            typeof(callback) == 'function' && callback(null);
            Alert.alert('Error', 'Cannot get data from server');
            return null;
        });
}

export const capitalizeFirst = str => str && (str.charAt(0).toUpperCase() + str.substring(1).toLowerCase());

export const normalizeTitle = str => str
    ?.trim()
    ?.split(/\s+/)
    ?.reduce(
        (prev, cur) => prev + (prev ? ' ' : '') + capitalizeFirst(cur),
        ''
    );

export const getImageUrl = itemUrl => {
    let url = itemUrl?.replace(BASE_URL, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/')
    while (url?.endsWith('/')) url = url.substring(0, url.length - 1);
    return url?.concat('.png');
}

export const measureItem = (contentWidth, itemMinWidth, margin) => {
    const numCols = Math.floor( (contentWidth + margin) / (itemMinWidth + margin) );
    const restWidth = contentWidth - numCols * itemMinWidth - (numCols - 1) * margin;
    const itemWidth = itemMinWidth + restWidth / numCols;
    return [numCols, itemWidth];
};