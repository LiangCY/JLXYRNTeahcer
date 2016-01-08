var React = require('react-native');

var {
    ListView,
    StyleSheet,
    PullToRefreshViewAndroid,
    Image,
    Text,
    View,
    TouchableNativeFeedback,
    ToastAndroid,
    } = React;

var ScrollableTabView = require('react-native-scrollable-tab-view');

var Constants = require('./Constants');
var MessagesList = require('./MessagesList');


var MessagesScreen = React.createClass({
    getInitialState() {
        return {
            isRefreshing: false,
            receive: [],
            send: [],
            initialPage: 0
        };
    },
    componentWillMount: function () {
        var navigator = this.props.navigator;
        var self = this;
        var willFocusCallback = function (event) {
        };
        var didFocusCallback = function (event) {
            if (event.data.route.name == 'main') {
                self.fetchMessages();
            }
        };
        this._listeners = [
            navigator.navigationContext.addListener('willfocus', willFocusCallback),
            navigator.navigationContext.addListener('didfocus', didFocusCallback)
        ];
    },
    componentDidMount: function () {
        this.fetchMessages();
    },
    componentWillUnmount: function () {
        this._listeners && this._listeners.forEach(listener => listener.remove());
    },
    fetchMessages: function () {
        if (this.state.isRefreshing) {
            return;
        }
        this.setState({isRefreshing: true});
        var self = this;
        fetch(Constants.URL_MESSAGES, {
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            if (json.error == 0) {
                self.setState({
                    isRefreshing: false,
                    receive: json.receive,
                    send: json.send
                });
            } else {
                self.setState({
                    isRefreshing: false
                });
                ToastAndroid.show(json.message, ToastAndroid.SHORT);
            }
        }).catch(function (e) {
            self.setState({
                isRefreshing: false
            });
            ToastAndroid.show(e.message, ToastAndroid.SHORT);
        });
    },
    onRefresh: function () {
        this.fetchMessages();
    },
    render: function () {
        return (
            <ScrollableTabView
                initialPage={this.state.initialPage}
                onChangeTab={(o)=>this.setState({initialPage:o.i})}
                style={styles.tab}
                tabBarUnderlineColor="#388E3C"
                tabBarActiveTextColor="#388E3C"
                tabBarInactiveTextColor="#666">
                <MessagesList
                    onRefresh={this.onRefresh}
                    refreshing={this.state.isRefreshing}
                    messages={this.state.receive}
                    navigator={this.props.navigator}
                    type='receive'
                    tabLabel="收到的私信"/>
                <MessagesList
                    onRefresh={this.onRefresh}
                    refreshing={this.state.isRefreshing}
                    messages={this.state.send}
                    navigator={this.props.navigator}
                    type='send'
                    tabLabel="发送的私信"/>
            </ScrollableTabView>
        );
    }
});

var styles = StyleSheet.create({
    tab: {
        paddingVertical: 4
    }
});

module.exports = MessagesScreen;