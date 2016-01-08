'use strict';

var React = require('react-native');
var {
    AsyncStorage,
    StyleSheet,
    View,
    ToolbarAndroid,
    TextInput,
    Text,
    TouchableNativeFeedback,
    ToastAndroid,
    } = React;

var KEY_USER = '@User';

var Constants = require('./Constants');

var LoginScreen = React.createClass({
    getInitialState: function () {
        return {
            username: '',
            password: ''
        };
    },
    componentDidMount() {
        this.loadUserInfo().done();
    },
    async loadUserInfo() {
        try {
            var value = await AsyncStorage.getItem(KEY_USER);
            if (value !== null) {
                var userInfo = value.split(':');
                this.setState({
                    username: userInfo[0] ? userInfo[0] : '',
                    password: userInfo[1] ? userInfo[1] : ''
                });
                this.login();
            }
        } catch (error) {
            this.setState({
                username: '',
                password: ''
            });
        }
    },
    login: function () {
        if (this.state.username == '') {
            ToastAndroid.show('请输入教师号', ToastAndroid.SHORT);
            return;
        }
        if (this.state.password == '') {
            ToastAndroid.show('请输入密码', ToastAndroid.SHORT);
            return;
        }
        var username = this.state.username;
        var password = this.state.password;
        var _navigator = this.props.navigator;
        fetch(Constants.URL_LOGIN, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            if (json.error == 0) {
                _navigator.replace({name: 'main', menu: '微博'});
                AsyncStorage.setItem(KEY_USER, username + ':' + password)
            } else {
                ToastAndroid.show(json.message, ToastAndroid.SHORT);
            }
        }).catch(function (e) {
            ToastAndroid.show(e.message, ToastAndroid.SHORT);
        });
    },
    render: function () {
        return (
            <View style={styles.container}>
                <ToolbarAndroid
                    style={styles.toolbar}
                    title="登录"
                    titleColor="white"/>
                <Text style={styles.label}>学号</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => this.setState({username:text})}
                    value={this.state.username}
                />
                <Text style={styles.label}>密码</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => this.setState({password:text})}
                    value={this.state.password}
                    secureTextEntry={true}
                />
                <TouchableNativeFeedback
                    onPress={this.login}
                    background={TouchableNativeFeedback.SelectableBackground()}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>登 录</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    toolbar: {
        height: 56,
        backgroundColor: '#4CAF50'
    },
    label: {
        marginTop: 16,
        marginLeft: 12,
        color: '#388E3C',
        fontSize: 16
    },
    input: {
        marginLeft: 12,
        marginRight: 12,
        height: 48,
        fontSize: 16
    },
    button: {
        marginTop: 24,
        marginLeft: 12,
        marginRight: 12,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48
    },
    buttonText: {
        color: 'white',
        fontSize: 18
    }
});

module.exports = LoginScreen;
