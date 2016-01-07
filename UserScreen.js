'use strict';

var React = require('react-native');
var {
    Image,
    StyleSheet,
    Text,
    View,
    } = React;

var Constants = require('./Constants');

var UserScreen = React.createClass({
    getInitialState: function () {
        return {
            user: null
        };
    },
    componentDidMount: function () {
        this.fetchUser();
    },
    fetchUser: function () {
        var self = this;
        fetch(Constants.URL_USER, {
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            if (json.error == 0) {
                self.setState({
                    user: json.user
                });
            }
        }).catch(function (e) {

        });
    },
    render: function () {
        if (!this.state.user) {
            return (
                <View style={styles.container}/>
            );
        }
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image
                        style={styles.avatar}
                        source={{uri:Constants.URL_PREFIX_AVATAR + this.state.user._id}}
                    />
                    <Text style={styles.name}>
                        {this.state.user.name}
                    </Text>
                </View>
                <View style={styles.content}>
                    <Text style={styles.item}>
                        {'教师号：' + this.state.user._id}
                    </Text>
                    <Text style={styles.item}>
                        {'院　系：' + this.state.user.school}
                    </Text>
                    <Text style={styles.item}>
                        {'课　程：' + this.state.user.lessons.join('、')}
                    </Text>
                </View>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#FAFAFA'
    },
    header: {
        height: 240,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4CAF50'
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderColor: 'white',
        borderWidth: 2
    },
    name: {
        marginTop: 16,
        fontSize: 28,
        color: 'white'
    },
    content: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 24,
        paddingHorizontal: 16
    },
    item: {
        marginVertical: 8,
        fontSize: 18
    }
});

module.exports = UserScreen;
