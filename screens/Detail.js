/**
 * Simple React Native app that mimics https://pokebag.vercel.app/
 * 
 * Written by AT Mulyana
 * https://github.com/atmulyana/
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {Alert, Animated, Easing, Image, Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import promptAndroid from 'react-native-prompt-android';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Content from './Content';
import {capitalizeFirst, contentPadding, getImageUrl} from '../globals';
import pokebag from '../pokebag-storage';
import {Theme} from '../contexts';
import PokeBall from '../images/pokeball.svg';
import PokeBallDark from '../images/pokeball-dark.svg';

const prompt = Platform.OS == 'android' 
    ? (title, message, buttons) => promptAndroid(title, message, buttons, {cancelable: false, type: 'plain-text'})
    : (title, message, buttons) => Alert.prompt(title, message, buttons, 'plain-text');


export default function Detail(props) {
    const {navigation, route: {params: {name, url}}} = props;
    const theme = React.useContext(Theme);
    
    let moveColor, moveBgColor, CatchButton;
    if (theme.isDarkMode) {
        moveColor = 'black';
        moveBgColor = '#f09d01';
        CatchButton = PokeBallDark;
    }
    else {
        moveColor = 'white';
        moveBgColor = '#0f62fe';
        CatchButton = PokeBall;
    
    }

    let animValue = new Animated.Value(0);
    const anim = Animated.loop(
        Animated.timing(animValue, {
            toValue: 1,
            duration: 1500,
            easing: Easing.in(Easing.bounce),
            useNativeDriver: false,
        })
    );
    useFocusEffect(() => {
        anim.start();
        return () => anim.stop();
    });

    const pos = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [50, 10]
    });

    return <>
        <Content
            {...props}
            leftNav="Home"
            rightNav="Pokebag"
            title={capitalizeFirst(name)}
            url={url}
            scrollerProps={{style: {marginHorizontal: -contentPadding}}}
        >{data => <>
            <View style={[styles.itemContainer, {marginHorizontal: contentPadding}]}>
                {data /* data has been loaded */
                    
                    ? data.types.map((item, idx) =>
                        <Text key={idx} style={[styles.item, {backgroundColor: theme.color, color: theme.background}]}>{item.type.name}</Text>
                    )

                    //needs to get data from server (shows loading indicator)
                    : <SkeletonPlaceholder backgroundColor={theme.loading.background} highlightColor={theme.loading.highlight}>
                        <SkeletonPlaceholder.Item {...styles.itemContainer}>{[1, 2].map((_, idx) =>
                            <SkeletonPlaceholder.Item 
                                key={idx}
                                {...styles.item}
                                height={styles.item.fontSize + 2 * styles.item.padding}
                                width={65}
                            />
                        )}</SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder>
                }
            </View>

            <View style={styles.imageContainer}>
                <Image source={{uri: getImageUrl(url)}} style={styles.image} />
            </View>

            <View style={[styles.movesContainer, {backgroundColor: theme.background}]}>
                <Text style={styles.movesTitle}>Moves</Text>
                <View style={styles.itemContainer}>{data
                    ? data.moves.map((item, idx) =>
                        <Text key={idx} style={[styles.item, {backgroundColor: moveBgColor, color: moveColor}]}>{item.move.name}</Text>
                    )

                    : <SkeletonPlaceholder backgroundColor={theme.loading.background} highlightColor={theme.loading.highlight}>
                        <SkeletonPlaceholder.Item {...styles.itemContainer}>{[1, 2, 3, 4].map((_, idx) =>
                            <SkeletonPlaceholder.Item 
                                key={idx}
                                {...styles.item}
                                height={styles.item.fontSize + 2 * styles.item.padding}
                                width={65}
                            />
                        )}</SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder>
                }</View>
            </View>
        </>}</Content>
        
        <Animated.View style={[styles.buttonContainer, {bottom: pos}]}>
            <Pressable
                onPress={async () => {
                    const succeed = Math.round(Math.random());
                    if (succeed) {
                        let status = '';
                        do {
                            const nickname = await new Promise(resolve => {
                                prompt(
                                    'Gotcha!',
                                    `${status}Enter your ${name} nickname`,
                                    [{
                                        text: 'Submit',
                                        onPress: nickname => resolve(nickname),
                                    }],
                                    //{cancelable: false, type: 'plain-text'}
                                    'plain-text'
                                );
                            });
                            status = await pokebag.addPoke({name, url}, nickname);
                            if (status !== true) status += '\n\n';
                        } while (status !== true);

                        Alert.alert(
                            '',
                            'Your Pokemon is safe and sound in your pokebag.',
                            [
                                {text: 'Close'},
                                {
                                    text: 'See Pokebage',
                                    onPress: () => navigation.navigate('Pokebag')
                                }
                            ],
                            {cancelable: true, type: 'plain-text'}
                        )
                    }
                    else {
                        Alert.alert('',
                            'Sorry, lady luck not in your side!',
                            [{text: 'Close'}],
                            {cancelable: true}
                        );
                    }
                }}
            >
                <CatchButton height={60} width={60} />
            </Pressable>
        </Animated.View>
    </>;
}

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    item: {
        borderRadius: 8,
        fontSize: 15,
        marginBottom: 16,
        marginRight: 16,
        overflow: 'hidden',
        padding: 8,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    image: {
        height: 250,
        marginBottom: -72,
        resizeMode: 'contain',
        width: 250,
    },
    movesContainer: {
        borderTopEndRadius: 32,
        borderTopStartRadius: 32,
        
        padding: 16,
        paddingTop: 48,
    },
    movesTitle: {
        fontSize: 30,
        fontWeight: '400',
        marginBottom: 8,
    },
    buttonContainer: {
        alignItems: 'flex-end',
        alignSelf: 'center',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'absolute',
    },
});