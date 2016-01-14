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
                    <View style={styles.row}>
                        <Text style={styles.rowTitle}>
                            {'教师号'}
                        </Text>
                        <Text style={styles.rowContent}>
                            {this.state.user._id}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowTitle}>
                            {'院系'}
                        </Text>
                        <Text style={styles.rowContent}>
                            {this.state.user.school}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowTitle}>
                            {'民族'}
                        </Text>
                        <Text style={styles.rowContent}>
                            {this.state.user.nation ? this.state.user.nation : ''}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowTitle}>
                            {'出生日期'}
                        </Text>
                        <Text style={styles.rowContent}>
                            {this.state.user.birthDate ? this.state.user.birthDate : ''}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowTitle}>
                            {'课程'}
                        </Text>
                        <Text style={styles.rowContent}>
                            {this.state.user.lessons.join('、')}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,

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
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8
    },
    rowTitle: {
        width: 96,
        fontSize: 17,
        color: '#333'
    },
    rowContent: {
        flex: 1,
        fontSize: 17
    }
});

module.exports = UserScreen;
