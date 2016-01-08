'use strict';

var React = require('react-native');

var {
    StyleSheet,
    ToolbarAndroid,
    Image,
    Text,
    View,
    TextInput,
    ProgressBarAndroid,
    ScrollView,
    ToastAndroid
    } = React;

var Constants = require('./Constants');
var MessagesList = require('./MessagesList');

var MessageScreen = React.createClass({
    getInitialState() {
        return {
            message: null,
            reply: '',
            isReplying: false
        };
    },
    componentDidMount: function () {
        this.fetchMessage(this.props.messageId);
    },
    fetchMessage: function (messageId) {
        var self = this;
        fetch(Constants.URL_MESSAGE + messageId, {
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            if (json.error == 0) {
                self.setState({
                    message: json.message
                });
            } else {
                ToastAndroid.show(json.message, ToastAndroid.SHORT);
            }
        }).catch(function (e) {
            ToastAndroid.show(e.message, ToastAndroid.SHORT);
        });
    },
    onActionSelected: function (position) {
        if (position == 0) {
            var messageId = this.state.message._id;
            var reply = this.state.reply;
            if (this.state.isReplying) {
                return;
            }
            this.setState({
                isReplying: true
            });
            var self = this;
            fetch(Constants.URL_MESSAGE_REPLY, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messageId: messageId,
                    reply: reply
                }),
                credentials: 'same-origin'
            }).then(function (response) {
                return response.json()
            }).then(function (json) {
                self.setState({
                    isReplying: false
                });
                if (json.error == 0) {
                    ToastAndroid.show('私信已发送', ToastAndroid.SHORT);
                    self.props.navigator.pop();
                } else {
                    ToastAndroid.show(json.message, ToastAndroid.SHORT);
                }
            }).catch(function (e) {
                self.setState({
                    isReplying: false
                });
                ToastAndroid.show(e.message, ToastAndroid.SHORT);
            });
        }
    },
    render: function () {
        var toolbar = (
            <ToolbarAndroid
                navIcon={require('image!ic_back_white')}
                title='私信'
                titleColor="white"
                style={styles.toolbar}
                onIconClicked={() => this.props.navigator.pop()}/>
        );
        if (!this.state.message) {
            return (
                <View style={styles.container}>
                    {toolbar}
                    <View style={styles.progressView}>
                        <ProgressBarAndroid styleAttr="Large"/>
                    </View>
                </View>
            );
        }
        var message = this.state.message;
        if (message.reply) {
            var replyContent = (
                <View style={styles.replyView}>
                    <View style={styles.extra}>
                        <Image
                            style={styles.avatar}
                            source={{uri:Constants.URL_PREFIX+'/avatar/'+message.toId}}/>
                        <Text
                            style={styles.user}>
                            {message.to}
                        </Text>
                        <Text
                            style={styles.date}>
                            {message.updateAt}
                        </Text>
                    </View>
                    <View style={styles.replyContent}>
                        <Text style={styles.replyText}>
                            {message.reply}
                        </Text>
                    </View>
                </View>
            );
        } else if (!message.toMe) {
            replyContent = (
                <View style={styles.replyView}>
                    <Text
                        style={styles.noReply}>
                        {'未回复'}
                    </Text>
                </View>
            );
        } else {
            if (this.state.reply) {
                var toolbarActions = [
                    {title: '回复', icon: require('image!ic_send_white'), show: 'always'}
                ];
                toolbar = (
                    <ToolbarAndroid
                        navIcon={require('image!ic_back_white')}
                        title='私信'
                        titleColor="white"
                        style={styles.toolbar}
                        onIconClicked={() => this.props.navigator.pop()}
                        actions={toolbarActions}
                        onActionSelected={this.onActionSelected}/>
                );
            }
            replyContent = (
                <View style={styles.replyEditor}>
                    <TextInput
                        textAlign='start'
                        textAlignVertical='top'
                        placeholder="请输入回复内容"
                        underlineColorAndroid="transparent"
                        multiline={true}
                        style={styles.replyInput}
                        onChangeText={(text) => this.setState({reply:text})}
                        value={this.state.reply}/>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                {toolbar}
                <ScrollView style={styles.scroll}>
                    <View style={styles.from}>
                        <View style={styles.header}>
                            <Image
                                style={styles.avatar}
                                source={{uri:Constants.URL_PREFIX+'/avatar/'+message.fromId}}/>
                            <View style={styles.headerText}>
                                <Text
                                    style={styles.title}>
                                    {message.title}
                                </Text>
                                <View style={styles.extra}>
                                    <Text
                                        style={styles.user}>
                                        {message.from}
                                    </Text>
                                    <Text
                                        style={styles.date}>
                                        {message.createAt}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <Text
                            style={styles.content}>
                            {message.content || '无内容'}
                        </Text>
                    </View>
                    {replyContent}
                </ScrollView>
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
        backgroundColor: '#4CAF50',
        height: 56
    },
    progressView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    scroll: {
        flex: 1,
        backgroundColor: '#E8E8E8'
    },
    from: {
        margin: 8,
        padding: 12,
        backgroundColor: 'white'
    },
    header: {
        flexDirection: 'row',
        borderBottomColor: '#CCC',
        borderBottomWidth: 1,
        alignItems: 'center',
        paddingBottom: 12
    },
    avatar: {
        height: 48,
        width: 48,
        marginRight: 12,
        borderRadius: 24
    },
    headerText: {
        flex: 1,
        flexDirection: 'column'
    },
    title: {
        fontSize: 20,
        color: '#388E3C'
    },
    extra: {
        flexDirection: 'row',
        marginTop: 6,
        alignItems: 'center'
    },
    user: {
        flex: 1,
        fontSize: 15,
        color: '#555'
    },
    date: {
        color: '#99A'
    },
    content: {
        marginTop: 12,
        marginBottom: 8,
        fontSize: 16
    },
    replyView: {
        flexDirection: 'column',
        margin: 8,
        padding: 12,
        backgroundColor: 'white'
    },
    replyContent: {
        marginTop: 12,
        paddingTop: 12,
        borderTopColor: '#CCC',
        borderTopWidth: 1
    },
    replyText: {
        fontSize: 16
    },
    noReply: {
        marginTop: 12,
        marginBottom: 8,
        fontSize: 16,
        color: 'orange'
    },
    replyEditor: {
        height: 240,
        flexDirection: 'column',
        alignItems: 'flex-start',
        margin: 8,
        padding: 12,
        backgroundColor: 'white'
    },
    replyInput: {
        flex: 1,
        fontSize: 16
    }
});

module.exports = MessageScreen;