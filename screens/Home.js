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
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Content from './Content';
import {callServer, getImageUrl, measureItem} from '../globals';
import {ContentWidth, Theme} from '../contexts';


const PokeItem = React.memo(props => {
    const {name, url, nav, width} = props;
    const theme = React.useContext(Theme);
    
    return name
        ? <TouchableOpacity
            style={[styles.item, {backgroundColor: theme.background, width}]}
            onPress={() => nav.navigate('Detail', {name, url})}
        >
            <Image source={{uri: getImageUrl(url)}} style={styles.itemImage} />
            <Text style={[styles.itemTitle, {color: theme.color}]}>{name}</Text>
        </TouchableOpacity>
        
        : <View style={{height: styles.item.height, width}}></View>;
});

const LoadingIncator = React.memo(({width}) => {
    const theme = React.useContext(Theme);
    
    return <View style={[styles.item, {backgroundColor: theme.background, width}]}>
        <View style={styles.itemImage}>
            <SkeletonPlaceholder backgroundColor={theme.loading.background} highlightColor={theme.loading.highlight}>
                <SkeletonPlaceholder.Item
                    height={styles.itemImage.height}
                    width={styles.itemImage.width}
                    borderRadius={0.5 * styles.itemImage.height} />
            </SkeletonPlaceholder>
        </View>
        <SkeletonPlaceholder backgroundColor={theme.loading.background} highlightColor={theme.loading.highlight}>
            <SkeletonPlaceholder.Item height={styles.itemTitle.fontSize} width={0.8 * width} />
        </SkeletonPlaceholder>
    </View>;
});

const PokeItemRow = React.memo(props => {
    const {items = [], start, end, numCols, navigation, itemWidth} = props;
    const pokes = [];

    let i = start, j = 0;
    for (; i < end; i++, j++) {
        pokes.push(<PokeItem key={j} nav={navigation} {...items[i]} width={itemWidth} />);
    }
    for (; j < numCols; j++) {
        pokes.push(<LoadingIncator key={j} width={itemWidth} />);
    }

    return <View key={start} style={styles.itemRow}>{pokes}</View>;
});

const ItemSeparator = () => <View style={styles.itemSeparator}></View>;

const PokeList = props => {
    const {navigation, state, state: {items}} = props;
    const contentWidth = React.useContext(ContentWidth);
    
    const [numCols, itemWidth] = React.useMemo(
        () => measureItem(contentWidth, styles.item.minWidth, styles.itemSeparator.height),
        [contentWidth]
    );

    const rowsCount = () => Math.ceil((items?.length ?? 0) / numCols) + (
        state.nextUrl != null //There are still more items in the next page
        || items == null //still loading data for the first page
        ? 1 //adds one row for loading indicator
        : 0
    );

    const listLength = React.useMemo(rowsCount, [items?.length, numCols]);
    
    const [list, setList] = React.useState(new Array(listLength));
    
    React.useEffect(() => {
        if (list.length != listLength) setList(new Array(listLength));
    });
    
    const addItems = newItems => {
        items.push(...newItems);
        setList( new Array(rowsCount()) ); //set rows based on the number of items
    };
    
    const getItemLayout = React.useCallback(
        (_, index) => ({
            length: styles.item.height,
            offset: (styles.item.height + styles.itemSeparator.height) * index,
            index
        }),
        [],
    );

    const renderItem = ({_, index}) => {
        const start = index * numCols,
              end = state.nextUrl && items != null //if there are more items in the next page
                ? Math.min(start + numCols, items?.length) //the empty column will be filled by loading indicator
                : start + numCols; //let the empty columns be blank
        return <PokeItemRow key={index} {...{items, start, end, numCols, navigation, itemWidth}} />
    }

    const onEndReached = () => {
        if (state.nextUrl) {
            callServer(state.nextUrl).then(data => {
                if (data) {
                    state.nextUrl = data.next;
                    addItems(data.results);
                }
            })
        }
    };

    return <FlatList
        {...props}

        data={list}
        getItemLayout={getItemLayout}
        onEndReached={onEndReached}
        renderItem={renderItem}
        
        ItemSeparatorComponent={ItemSeparator}
    />
};

export default function Home(props) {
    const state = {};
    
    return <Content
        {...props}
        leftNav="Home"
        rightNav="Pokebag"
        title="Pokedex"
        url="pokemon/"
        scroller={PokeList}
        scrollerProps={{
            navigation: props.navigation,
            route: props.route,
            state,
        }}
    >{data => {
        state.items = data?.results;
        state.nextUrl = data?.next;
        return null;
    }}</Content>;
}

const styles = StyleSheet.create({
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemSeparator: {
        height: 10,
    },
    item: {
        alignItems: 'flex-start',
        borderRadius: 8,
        elevation: 5,
        height: 130,
        minWidth: 180,
        overflow: 'hidden',
        padding: 10,
        shadowColor: '#888',
    },
    itemTitle: {
        fontSize: 20,
        textTransform: 'capitalize',
    },
    itemImage: {
        bottom: 0,
        height: 100,
        position: 'absolute',
        resizeMode: 'contain',
        right: 0,
        width: 100,
    },
});