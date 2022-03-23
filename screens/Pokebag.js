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
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {getImageUrl, measureItem} from '../globals';
import pokebag from '../pokebag-storage';
import {ContentWidth, Theme} from '../contexts';
import Content from './Content';
import DeleteIcon from '../images/delete.svg';

export default function Pokebag(props) {
    const {navigation} = props;
    const theme = React.useContext(Theme),
          contentWidth = React.useContext(ContentWidth),
          iconColor = theme.isDarkMode ? 'white' : 'black';
    
    const [items, setItems] = React.useState({});
    React.useEffect(() => {
        pokebag.getAllPokes()
            .then(pokes => setItems(pokes));
    }, []);

    const colorStyle = {color: theme.color},
          [numCols, itemWidth] = measureItem(contentWidth, styles.item.minWidth, styles.item.marginBottom),
          itemStyle = {backgroundColor: theme.background, width: itemWidth},
          nicknames = Object.keys(items),
          lastRowCols = nicknames.length % numCols;

    return <Content {...props} leftNav="Home" rightNav={null} title={Pokebag.name}>
        <View style={styles.itemContainer}>
            {nicknames.map((nickname, idx) => {
                const {name, url} = items[nickname];

                return <TouchableOpacity key={idx}
                    style={[styles.item, itemStyle]}
                    onPress={() => navigation.navigate('Detail', {name, url})}
                >
                    <Image source={{uri: getImageUrl(url)}} style={styles.itemImage} />
                    <Text style={[styles.itemNickname, colorStyle]}>{nickname}</Text>
                    <Text style={[styles.itemTitle, colorStyle]}>{name}</Text>
                    <TouchableOpacity
                        style={styles.deleteIcon}
                        onPress={async () => {
                            await pokebag.removePoke(nickname);
                            setItems(await pokebag.getAllPokes());
                        }}
                    >
                        <DeleteIcon stroke={iconColor} fill={iconColor} height={20} width={20} />
                    </TouchableOpacity>
                </TouchableOpacity>
            })}
            
            {(lastRowCols > 0) && new Array(numCols - lastRowCols).fill(null).map(
                (_, idx) => <View key={lastRowCols + idx} style={{height:styles.item.height, width:itemWidth}}></View>
            )}
        </View>
    </Content>;
}

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    item: {
        alignItems: 'flex-start',
        borderRadius: 8,
        elevation: 5,
        height: 130,
        marginBottom: 10,
        minWidth: 180,
        overflow: 'hidden',
        padding: 10,
        shadowColor: '#888',
    },
    itemNickname: {
        fontSize: 20,
    },
    itemTitle: {
        fontSize: 15,
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
    deleteIcon: {
        bottom: 0,
        left: 0,
        padding: 10,
        position: 'absolute',
    },
});