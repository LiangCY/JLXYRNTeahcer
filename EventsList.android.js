'use strict';

var React = require('react-native');

var {
    ListView,
    StyleSheet,
    PullToRefreshViewAndroid,
    ProgressBarAndroid,
    Image,
    Text,
    View,
    TouchableNativeFeedback,
    ToastAndroid,
    } = React;

import ActionButton from 'react-native-action-button';

var Constants = require('./Constants');

var EventsList = React.createClass({
    getInitialState() {
        var dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        return {
            isRefreshing: false,
            loaded: 0,
            dataSource: dataSource,
            isLoadingMore: false,
            hasMore: false
        };
    },
    componentDidMount: function () {
        this.fetchEvents();
    },
    fetchEvents: function () {
        if (this.state.isRefreshing) {
            return;
        }
        this.setState({isRefreshing: true});
        var self = this;
        fetch(Constants.URL_EVENTS, {
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            if (json.error == 0) {
                self.setState({
                    isRefreshing: false,
                    loaded: json.events.length,
                    dataSource: self.state.dataSource.cloneWithRows(json.events),
                    hasMore: json.hasMore
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
    fetchMoreEvents: function () {
        if (this.state.isRefreshing || this.state.isLoadingMore || !this.state.hasMore) {
            return;
        }
        this.setState({isLoadingMore: true});
        var self = this;
        fetch(Constants.URL_MORE_EVENTS + '?count=' + this.state.loaded, {
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            if (json.error == 0) {
                self.setState({
                    isLoadingMore: false,
                    loaded: json.events.length,
                    dataSource: self.state.dataSource.cloneWithRows(json.events),
                    hasMore: json.hasMore
                });
            } else {
                self.setState({
                    isLoadingMore: false
                });
                ToastAndroid.show(json.message, ToastAndroid.SHORT);
            }
        }).catch(function (e) {
            self.setState({
                isLoadingMore: false
            });
            ToastAndroid.show(e.message, ToastAndroid.SHORT);
        });
    },
    renderRow: function (event) {
        return (
            <TouchableNativeFeedback
                onPress={()=>this.selectEvent(event)}
                background={TouchableNativeFeedback.SelectableBackground()}>
                <View style={styles.row}>
                    <Image
                        style={styles.avatar}
                        source={{uri:Constants.URL_PREFIX_AVATAR+event.userId}}/>
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
                        <Text
                            style={styles.content}>
                            {(event.content).replace(/<\/?[^>]+>/g, '').replace(/&nbsp;/g, ' ')}
                        </Text>
                    </View>
                </View>
            </TouchableNativeFeedback>
        );
    },
    renderFooter: function () {
        if (this.state.isLoadingMore) {
            return (
                <ProgressBarAndroid color="#999"/>
            );
        }
        return <View/>;
    },
    selectEvent: function (event) {
        switch (event.type) {
            case 0:
                this.props.navigator.push({
                    name: 'event',
                    event: event
                });
                break;
            case 4:
            case 5:
                this.props.navigator.push({
                    name: 'message',
                    messageId: event.messageId
                });
                break;
        }
    },
    addEvent: function () {
        this.props.navigator.push({
            name: 'add_event'
        });
    },
    render() {
        return (
            <PullToRefreshViewAndroid
                style={styles.layout}
                refreshing={this.state.isRefreshing}
                onRefresh={this.fetchEvents}
                colors={['#4CAF50']}>
                <View style={{flex:1}}>
                    <ListView
                        style={styles.list}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow}
                        renderFooter={this.renderFooter}
                        onEndReached={this.fetchMoreEvents}
                        onEndReachedThreshold={240}/>
                    <ActionButton
                        onPress={this.addEvent}
                        icon={<Image style={{height:24,width:24}} source={require('image!ic_write_white')}/>}
                        buttonColor="rgba(76,175,80,1)"/>
                </View>
            </PullToRefreshViewAndroid>
        );
    }
});

var styles = StyleSheet.create({
    layout: {
        flex: 1
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 12,
        marginLeft: 8,
        marginRight: 8,
        marginVertical: 5,
        borderColor: '#dddddd',
        borderStyle: null,
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
        alignItems: 'center'
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
        fontSize: 16,
        marginTop: 4
    },
    list: {
        backgroundColor: '#DADADA'
    }
});

module.exports = EventsList;
