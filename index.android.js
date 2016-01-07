'use strict';

var React = require('react-native');
var {
    AppRegistry,
    StyleSheet,
    Image,
    Navigator,
    BackAndroid,
    } = React;

var TimerMixin = require('react-timer-mixin');

var LoginScreen = require('./LoginScreen');
var MainScreen = require('./MainScreen');

var _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
    if (_navigator && _navigator.getCurrentRoutes().length > 1) {
        _navigator.pop();
        return true;
    }
    return false;
});

var RNAppTeacher = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function () {
        return {
            splashed: false
        };
    },
    componentDidMount: function () {
        this.setTimeout(() => {
            this.setState({splashed: true});
        }, 2000);
    },
    RouteMapper: function (route, navigationOperations) {
        _navigator = navigationOperations;
        if (route.name === 'login') {
            return (
                <LoginScreen navigator={navigationOperations}/>
            );
        } else if (route.name === 'main') {
            return (
                <MainScreen menu={route.menu} navigator={navigationOperations}/>
            );
        }
    },
    render: function () {
        if (this.state.splashed) {
            var initialRoute = {name: 'login'};
            return (
                <Navigator
                    configureScene={(route) => Navigator.SceneConfigs.FadeAndroid}
                    initialRoute={initialRoute}
                    renderScene={this.RouteMapper}
                />
            );
        } else {
            return (
                <Image
                    style={styles.cover}
                    source={require('image!splash')}/>
            );
        }
    }
});

const styles = StyleSheet.create({
    cover: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: Image.resizeMode.cover
    }
});

AppRegistry.registerComponent('RNAppTeacher', () => RNAppTeacher);
