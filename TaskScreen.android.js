'use strict';

var React = require('react-native');

var {
    StyleSheet,
    ToolbarAndroid,
    Text,
    View,
    ProgressBarAndroid,
    ScrollView,
    ToastAndroid,
    IntentAndroid,
    } = React;

var HTMLView = require('react-native-htmlview');

var Constants = require('./Constants');
var MessagesList = require('./MessagesList');

var TaskScreen = React.createClass({
    getInitialState() {
        return {
            task: null
        };
    },
    componentDidMount: function () {
        this.fetchTask(this.props.taskId);
    },
    fetchTask: function (taskId) {
        var self = this;
        fetch(Constants.URL_TASK + taskId, {
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            if (json.error == 0) {
                self.setState({
                    task: json.task
                });
            } else {
                ToastAndroid.show(json.message, ToastAndroid.SHORT);
            }
        }).catch(function (e) {
            ToastAndroid.show(e.message, ToastAndroid.SHORT);
        });
    },
    render: function () {
        var toolbar = (
            <ToolbarAndroid
                navIcon={require('image!ic_back_white')}
                title='作业'
                titleColor="white"
                style={styles.toolbar}
                onIconClicked={() => this.props.navigator.pop()}/>
        );
        if (!this.state.task) {
            return (
                <View style={styles.container}>
                    {toolbar}
                    <View style={styles.progressView}>
                        <ProgressBarAndroid styleAttr="Large"/>
                    </View>
                </View>
            );
        }
        var task = this.state.task;
        return (
            <View style={styles.container}>
                {toolbar}
                <ScrollView style={styles.scroll}>
                    <View style={styles.taskView}>
                        <View style={styles.header}>
                            <Text
                                style={styles.title}>
                                {task.title}
                            </Text>
                            <View style={styles.extra}>
                                <Text
                                    style={styles.lesson}>
                                    {task.lesson}
                                </Text>
                                <Text
                                    style={styles.time}>
                                    {task.createAt + ' 发布'}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.content}>
                            <Text
                                style={styles.contentTitle}>
                                {'截止日期'}
                            </Text>
                            <Text
                                style={styles.deadline}>
                                {task.deadline ? task.deadline : '无'}
                            </Text>
                            <Text
                                style={styles.contentTitle}>
                                {'具体要求'}
                            </Text>
                            <HTMLView
                                style={styles.html}
                                onLinkPress={(url) => IntentAndroid.openURL(url)}
                                value={task.content||'无具体要求'}/>
                        </View>
                    </View>
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
        backgroundColor: '#E8E8E8',
        padding: 12
    },
    sectionTitle: {
        marginTop: 8,
        marginHorizontal: 8,
        fontSize: 16
    },
    taskView: {
        flex: 1,
        marginBottom: 8,
        padding: 16,
        backgroundColor: 'white'
    },
    header: {
        flexDirection: 'column',
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#CCC'
    },
    title: {
        fontSize: 18,
        color: 'black'
    },
    extra: {
        flexDirection: 'row',
        marginTop: 6,
        alignItems: 'center'
    },
    lesson: {
        flex: 1,
        fontSize: 15,
        color: '#555'
    },
    time: {
        color: '#888'
    },
    deadline: {
        marginBottom: 8
    },
    content: {
        marginTop: 16,
        paddingBottom: 12
    },
    contentTitle: {
        fontSize: 17,
        color: '#555',
        marginBottom: 8
    }

});

module.exports = TaskScreen;