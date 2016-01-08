'use strict';

var React = require('react-native');

var {
    ListView,
    StyleSheet,
    PullToRefreshViewAndroid,
    Text,
    View,
    TouchableNativeFeedback,
    ToastAndroid,
    } = React;

var Constants = require('./Constants');

var TasksList = React.createClass({
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
        this.fetchTasks();
    },
    fetchTasks: function () {
        if (this.state.isRefreshing) {
            return;
        }
        this.setState({isRefreshing: true});
        var self = this;
        fetch(Constants.URL_TASKS, {
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            if (json.error == 0) {
                self.setState({
                    isRefreshing: false,
                    dataSource: self.state.dataSource.cloneWithRows(json.tasks)
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
    viewTaskDetail: function (task) {
        this.props.navigator.push({
            name: 'task',
            taskId: task._id
        });
    },
    viewHomeworkList: function (task) {

    },
    renderRow: function (task) {
        return (
            <View style={styles.row}>
                <View style={styles.column}>
                    <View style={styles.header}>
                        <Text
                            numberOfLines={1}
                            style={styles.title}>
                            {task.title}
                        </Text>
                        <Text
                            style={styles.time}>
                            {task.createAt + '发布'}
                        </Text>
                    </View>
                    <View style={styles.content}>
                        <Text
                            numberOfLines={1}
                            style={styles.lesson}>
                            {'班级：' + task.lesson}
                        </Text>
                        <Text
                            style={styles.deadline}>
                            {task.deadline ? '截止日期：' + task.deadline : '无截止日期'}
                        </Text>
                    </View>
                    <View style={styles.actions}>
                        <TouchableNativeFeedback
                            onPress={()=>this.viewTaskDetail(task)}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>{'作业要求'}</Text>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback
                            onPress={()=>this.viewHomeworkList(task)}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>{'学生作业'}</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                </View>
            </View>
        );
    },
    selectTask: function (task) {
        this.props.navigator.push({
            name: 'task',
            taskId: task.taskId
        });
    },
    render() {
        return (
            <PullToRefreshViewAndroid
                style={styles.layout}
                refreshing={this.state.isRefreshing}
                onRefresh={this.fetchTasks}
                colors={['#4CAF50']}>
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
        flex: 1,
        backgroundColor: '#DEDEDE',
        paddingBottom: 16
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        marginTop: 8,
        paddingVertical: 10,
        borderBottomColor: '#BBB',
        borderBottomWidth: 0.5
    },
    column: {
        flex: 1,
        flexDirection: 'column'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingBottom: 8,
        marginBottom: 8,
        borderBottomColor: '#CCC',
        borderBottomWidth: 0.5
    },
    title: {
        flex: 1,
        fontSize: 17,
        color: '#222'
    },
    time: {
        fontSize: 14
    },
    content: {
        flexDirection: 'column',
        paddingHorizontal: 12,
        paddingBottom: 12,
        borderBottomColor: '#CCC',
        borderBottomWidth: 0.5
    },
    lesson: {
        marginTop: 4,
        fontSize: 15
    },
    deadline: {
        marginTop: 2,
        fontSize: 14
    },
    actions: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 12,
        paddingHorizontal: 16
    },
    button: {
        marginLeft: 16,
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderColor: '#388E3C',
        borderWidth: 1,
        borderRadius: 2
    },
    buttonText: {
        fontSize: 15,
        color: '#388E3C'
    }
});

module.exports = TasksList;
