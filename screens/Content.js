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
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {Theme} from '../contexts';
import {callServer, contentPadding} from '../globals';

const NavigationLink = ({name, colorStyle, navigation}) => name
    ? <TouchableOpacity
        onPress={() => navigation.navigate(name)}
      >
        <Text style={[styles.nav, colorStyle]}>{name}</Text>
      </TouchableOpacity>
    : <View></View>;

export default ({
    title,
    leftNav,
    rightNav,
    children,
    url,
    navigation,
    scroller,
    scrollerProps,
}) => {
    const [data, setData] = React.useState(null);
    const [isRefreshing, setRefreshing] = React.useState(true);
    const theme = React.useContext(Theme);
    
    React.useEffect(() => {
        if (isRefreshing) {
            callServer(url, setData)
                .finally(() => setRefreshing(false));
        }
    }, [isRefreshing]);

    const colorStyle = {color: theme.color};
    const bgColorStyle = {backgroundColor: theme.secondBg};
    const navLinkProps = {colorStyle, navigation};

    const Scroller = scroller ?? ScrollView;
    const scrolledContent = typeof(children) == 'function' ? children(data) : children;
    const scrollerProps2 = {...scrollerProps};
    delete scrollerProps2.style;

    return <View style={[styles.container, bgColorStyle]}>
        
        <View style={styles.header}>
            <View style={styles.navContainer}>
                <NavigationLink name={leftNav} {...navLinkProps} />
                <NavigationLink name={rightNav} {...navLinkProps} />
            </View>
            <Text style={[styles.title, colorStyle]}>{title}</Text>
        </View>
        
        <Scroller
            contentInsetAdjustmentBehavior="automatic"
            style={[{flex: 1}, bgColorStyle, scrollerProps?.style]}
            
            refreshControl={<RefreshControl
                refreshing={isRefreshing}
                onRefresh={() => setRefreshing(true)}
            />}
            
            {...scrollerProps2}
        >
            {scrolledContent}
        </Scroller>
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: contentPadding,
    },
    navContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    nav: {
        fontSize: 15,
    },
    title: {
        fontSize: 30,
        fontWeight: '400',
        marginVertical: 10,
    },
    header: {
        flex: 0,
    },
});