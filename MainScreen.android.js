'use strict';

var React = require('react-native');
var {
    StyleSheet,
    View,
    DrawerLayoutAndroid,
    ToolbarAndroid,
    Dimensions,
    AsyncStorage,
    } = React;


var DRAWER_REF = 'drawer';
var DRAWER_WIDTH_LEFT = 64;

var DrawerMenu = require('./DrawerMenu');
var EventsList = require('./EventsList');
var LessonsList = require('./LessonsList');
var MessagesScreen = require('./MessagesScreen');

var MainScreen = React.createClass({
    getInitialState: function () {
        return ({
            menu: this.props.menu
        });
    },
    renderNavigationView: function () {
        return (
            <DrawerMenu
                selected={this.state.menu}
                onSelectItem={this.onSelectItem}
                onPressUser={this.onPressUser}
                onLogout={this.onLogout}
            />
        );
    },
    onPressUser: function () {
        this.refs[DRAWER_REF].closeDrawer();
        this.props.navigator.push({
            name: 'user'
        });
    },
    onSelectItem: function (menu) {
        this.refs[DRAWER_REF].closeDrawer();
        this.setState({menu: menu});
    },
    onLogout: function () {
        this.refs[DRAWER_REF].closeDrawer();
        AsyncStorage.clear();
        this.props.navigator.immediatelyResetRouteStack([
            {name: 'login'}
        ]);
    },
    render: function () {
        var content;
        var toolbar = (
            <ToolbarAndroid
                navIcon={require('image!ic_menu_white')}
                title={this.state.menu}
                titleColor="white"
                style={styles.toolbar}
                onIconClicked={() => this.refs[DRAWER_REF].openDrawer()}/>
        );
        switch (this.state.menu) {
            case '微博':
                content = <EventsList navigator={this.props.navigator}/>;
                break;
            case '课程':
                content = <LessonsList navigator={this.props.navigator}/>;
                break;
            case '作业':
                break;
            case '资源':
                break;
            case '私信':
                content = <MessagesScreen navigator={this.props.navigator}/>;
                break;
        }
        return (
            <DrawerLayoutAndroid
                ref={DRAWER_REF}
                drawerWidth={Dimensions.get('window').width - DRAWER_WIDTH_LEFT}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                renderNavigationView={this.renderNavigationView}>
                {toolbar}
                <View style={styles.container}>
                    {content}
                </View>
            </DrawerLayoutAndroid>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#FAFAFA'
    },
    toolbar: {
        backgroundColor: '#4CAF50',
        height: 56
    }
});

module.exports = MainScreen;
