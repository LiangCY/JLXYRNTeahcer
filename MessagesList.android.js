var React = require('react-native');

var {
    ListView,
    StyleSheet,
    PullToRefreshViewAndroid,
    Image,
    Text,
    View,
    TouchableNativeFeedback,
    } = React;

var Constants = require('./Constants');

var MessagesList = React.createClass({
    getInitialState() {
        var dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        return {
            dataSource: dataSource
        };
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(nextProps.messages)
        });
    },
    renderRow: function (message) {
        return (
            <TouchableNativeFeedback
                onPress={()=>this.selectMessage(message)}
                background={TouchableNativeFeedback.SelectableBackground()}>
                <View style={styles.row}>
                    <Image
                        style={styles.avatar}
                        source={{uri:Constants.URL_PREFIX+'/avatar/'+message.userId}}/>
                    <View style={styles.column}>
                        <Text
                            numberOfLines={1}
                            style={message.isNew?styles.titleNew:styles.title}>
                            {message.title}
                        </Text>
                        <View style={styles.extra}>
                            <Text
                                style={styles.author}>
                                {message.from || message.to}
                            </Text>
                            <Text
                                style={styles.date}>
                                {message.createAt}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableNativeFeedback>
        );
    },
    _onRefresh: function () {
        this.props.onRefresh();
    },
    selectMessage: function (message) {
        this.props.navigator.push({
            name: 'message',
            messageId: message._id
        });
    },
    render: function () {
        return (
            <PullToRefreshViewAndroid
                onRefresh={this._onRefresh}
                refreshing={this.props.isRefreshing}
                colors={['#4CAF50']}
                style={styles.layout}>
                <ListView
                    style={styles.list}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}/>
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
        padding: 12,
        borderBottomColor: '#DDD',
        borderBottomWidth: 1
    },
    avatar: {
        height: 48,
        width: 48,
        marginRight: 12,
        borderRadius: 24
    },
    column: {
        flex: 1,
        flexDirection: 'column'
    },
    extra: {
        marginTop: 4,
        flexDirection: 'row',
        alignItems: 'center'
    },
    author: {
        fontSize: 15,
        color: '#555'
    },
    date: {
        fontSize: 15,
        marginLeft: 12
    },
    title: {
        fontSize: 17
    },
    titleNew: {
        fontSize: 17,
        color: '#2B8'
    }
});

module.exports = MessagesList;