'use strict';

var React = require('react-native');

var {
    ListView,
    StyleSheet,
    ToolbarAndroid,
    PullToRefreshViewAndroid,
    Text,
    View,
    TouchableNativeFeedback,
    ToastAndroid,
    } = React;

var Constants = require('./Constants');

var EventsList = React.createClass({
    getInitialState() {
        var dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        return {
            isRefreshing: false,
            dataSource: dataSource
        };
    },
    componentDidMount: function () {
        this.fetchResources();
    },
    fetchResources: function () {
        if (this.state.isRefreshing) {
            return;
        }
        this.setState({isRefreshing: true});
        var self = this;
        fetch(Constants.URL_LESSON_RESOURCES + this.props.lesson._id, {
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            if (json.error == 0) {
                self.setState({
                    isRefreshing: false,
                    dataSource: self.state.dataSource.cloneWithRows(json.resources)
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
    renderRow: function (resource) {
        return (
            <TouchableNativeFeedback
                onPress={()=>this.selectResource(resource)}
                background={TouchableNativeFeedback.SelectableBackground()}>
                <View style={styles.row}>
                    <View style={styles.column}>
                        <Text
                            numberOfLines={1}
                            style={styles.title}>
                            {resource.title}
                        </Text>
                        <Text
                            style={styles.time}>
                            {resource.createAt + ' 发布'}
                        </Text>
                    </View>
                    <Text style={styles.count}>
                        {(resource.downloadCount || 0 ) + '次下载'}
                    </Text>
                </View>
            </TouchableNativeFeedback>
        );
    },
    selectResource: function (resource) {
        this.props.navigator.push({
            name: 'resource',
            resourceId: resource._id
        });
    },
    render() {
        return (
            <View style={styles.container}>
                <ToolbarAndroid
                    navIcon={require('image!ic_back_white')}
                    title={'课程资源 '+this.props.lesson.name}
                    titleColor="white"
                    style={styles.toolbar}
                    onIconClicked={() => this.props.navigator.pop()}/>
                <PullToRefreshViewAndroid
                    style={styles.layout}
                    refreshing={this.state.isRefreshing}
                    onRefresh={this.fetchResources}
                    colors={['#4CAF50']}>
                    <ListView
                        style={styles.list}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow}/>
                </PullToRefreshViewAndroid>
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
    layout: {
        flex: 1
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomColor: '#BBB',
        borderBottomWidth: 0.5
    },
    column: {
        flex: 1,
        flexDirection: 'column'
    },
    title: {
        fontSize: 17,
        color: '#222'
    },
    time: {
        marginTop: 4,
        fontSize: 15
    },
    count: {
        marginLeft: 12,
        fontSize: 16
    }
});

module.exports = EventsList;
