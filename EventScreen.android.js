'use strict';

var React = require('react-native');

var {
    StyleSheet,
    Image,
    Text,
    View,
    ToolbarAndroid,
    ScrollView,
    Alert,
    TouchableNativeFeedback,
    } = React;

var HTMLView = require('react-native-htmlview');

var Constants = require('./Constants');

var EventScreen = React.createClass({
    getInitialState: function () {
        return {
            isDeleting: false
        }
    },
    onDelete: function () {
        Alert.alert(
            '删除微博',
            '您确定要删除这条微博吗？',
            [
                {text: '取消', style: 'cancel'},
                {text: '确定', onPress: this.doDelete}
            ]
        )
    },
    doDelete: function () {
        if (this.state.isDeleting) return;
        this.setState({
            isDeleting: true
        });
        var self = this;
        fetch(Constants.URL_DELETE_EVENT + this.props.event._id, {
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            self.setState({
                isDeleting: false
            });
            if (json.error == 0) {
                self.props.navigator.pop();
            } else {
                ToastAndroid.show(json.message, ToastAndroid.SHORT);
            }
        }).catch(function (e) {
            self.setState({
                isDeleting: false
            });
            ToastAndroid.show(e.message, ToastAndroid.SHORT);
        });
    },
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
                <ScrollView style={styles.scroll}>
                    <View style={styles.eventView}>
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
                        <TouchableNativeFeedback
                            onPress={this.onDelete}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>{'删除'}</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                </ScrollView>
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
    scroll: {
        flex: 1,
        backgroundColor: '#EAEAEA'
    },
    eventView: {
        flex: 1,
        flexDirection: 'column'
    },
    row: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 12,
        marginVertical: 12
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
    },
    button: {
        backgroundColor: 'white',
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8
    },
    buttonText: {
        fontSize: 16,
        color: '#ED3454'
    }
});

module.exports = EventScreen;
