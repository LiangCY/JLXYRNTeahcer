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
    TouchableNativeFeedback
} = React;

var HTMLView = require('react-native-htmlview');
var Icon = require('react-native-vector-icons/FontAwesome');
var Constants = require('./Constants');
var MessagesList = require('./MessagesList');

var TaskScreen = React.createClass({
    getInitialState() {
        return {
            task: null
        };
    },
    componentWillMount: function () {
        var navigator = this.props.navigator;
        var self = this;
        var didFocusCallback = function (event) {
            if (event.data.route.name == 'task') {
                self.fetchTask(self.props.taskId);
            }
        };
        this._listeners = [
            navigator.navigationContext.addListener('didfocus', didFocusCallback)
        ];
    },
    componentWillUnmount: function () {
        this._listeners && this._listeners.forEach(listener => listener.remove());
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
    editTask: function () {
        var task = this.state.task;
        this.props.navigator.push({
            name: 'add_task',
            lesson: {_id: task.lessonId, name: task.lesson},
            task: task
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
                    <TouchableNativeFeedback onPress={this.editTask}>
                        <View style={styles.button}>
                            <Icon name="edit" size={20} color="#2C9F40" style={styles.buttonCallIcon}/>
                            <Text style={styles.buttonText}>
                                {'编辑'}
                            </Text>
                        </View>
                    </TouchableNativeFeedback>
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
    },
    button: {
        flexDirection: 'row',
        marginVertical: 24,
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        borderWidth: 1,
        borderColor: '#2C9F40',
        borderRadius: 8
    },
    buttonText: {
        marginLeft: 12,
        color: '#2C9F40',
        fontSize: 18
    }
});

module.exports = TaskScreen;