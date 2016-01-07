'use strict';

var React = require('react-native');

var {
    StyleSheet,
    Image,
    Text,
    View,
    ToolbarAndroid,
    } = React;

var HTMLView = require('react-native-htmlview');

var Constants = require('./Constants');

var EventScreen = React.createClass({
    render() {
        var event = this.props.event;
        return (
            <View style={styles.container}>
                <ToolbarAndroid
                    navIcon={require('image!ic_back_white')}
                    title='私信'
                    titleColor="white"
                    style={styles.toolbar}
                    onIconClicked={() => this.props.navigator.pop()}/>
                <View style={styles.row}>
                    <Image
                        style={styles.avatar}
                        source={{uri:Constants.URL_PREFIX+'/avatar/'+event.userId}}/>
                    <View style={styles.column}>
                        <View style={styles.extra}>
                            <Text
                                style={styles.author}>
                                {(event.username)}
                            </Text>
                            <Text
                                style={styles.date}>
                                {(event.date)}
                            </Text>
                        </View>
                        <HTMLView
                            style={styles.content}
                            onLinkPress={(url) => IntentAndroid.openURL(url)}
                            value={event.content}/>
                    </View>
                </View>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    toolbar: {
        backgroundColor: '#4CAF50',
        height: 56
    },
    row: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 12,
        marginHorizontal: 8,
        marginVertical: 12,
        borderColor: '#ddd',
        borderWidth: 0.5,
        borderRadius: 2
    },
    avatar: {
        height: 48,
        width: 48,
        marginRight: 16,
        borderRadius: 4
    },
    column: {
        flex: 1,
        flexDirection: 'column'
    },
    extra: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6
    },
    author: {
        fontSize: 17,
        color: '#222'
    },
    date: {
        fontSize: 15,
        marginLeft: 12
    },
    content: {
        fontSize: 16
    }
});

module.exports = EventScreen;
