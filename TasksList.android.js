'use strict';

var React = require('react-native');

var {
    ListView,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableNativeFeedback,
    ToastAndroid,
    AsyncStorage,
} = React;

import ActionButton from 'react-native-action-button';
var Icon = require('react-native-vector-icons/FontAwesome');
var Constants = require('./Constants');

var TasksList = React.createClass({
    getInitialState() {
        var taskDataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        var lessonDataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        return {
            isRefreshing: false,
            taskDataSource: taskDataSource,
            lessonDataSource: lessonDataSource,
            isSelecting: false,
            selectedLesson: {name: '全部课程', _id: null}
        };
    },
    componentWillMount: function () {
        var navigator = this.props.navigator;
        var self = this;
        var didFocusCallback = function (event) {
            if (event.data.route.name == 'main') {
                self.fetchTasks(self.state.selectedLesson);
            }
        };
        this._listeners = [
            navigator.navigationContext.addListener('didfocus', didFocusCallback)
        ];
    },
    componentDidMount: function () {
        this.getLessons().done();
        this.fetchTasks();
    },
    componentWillUnmount: function () {
        this._listeners && this._listeners.forEach(listener => listener.remove());
    },
    async getLessons(){
        try {
            var value = await AsyncStorage.getItem('@Lessons');
            var lessons = JSON.parse(value);
            lessons.unshift({name: '全部课程', _id: null});
            this.setState({
                lessonDataSource: this.state.lessonDataSource.cloneWithRows(lessons)
            });
        } catch (error) {
        }
    },
    fetchTasks: function (lesson) {
        if (this.state.isRefreshing) {
            return;
        }
        this.setState({isRefreshing: true});
        var self = this;
        fetch(Constants.URL_TASKS + (lesson && lesson._id ? ('?lesson=' + lesson._id) : ''), {
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            if (json.error == 0) {
                self.setState({
                    isRefreshing: false,
                    taskDataSource: self.state.taskDataSource.cloneWithRows(json.tasks)
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
        this.props.navigator.push({
            name: 'homework_list',
            task: task
        });
    },
    renderRow: function (task) {
        return (
            <View style={styles.row}>
                <View style={styles.column}>
                    <View style={styles.header}>
                        <Icon name="pencil" size={18}
                              color={task.askForRedo?'#FF9124':task.unread?'#FF4D4D':'#286E2C'}
                              style={styles.taskIcon}/>
                        <Text
                            numberOfLines={1}
                            style={task.askForRedo?styles.titleOrange:task.unread?styles.titleRed:styles.title}>
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
    renderLessonRow: function (lesson) {
        return (
            <TouchableNativeFeedback
                onPress={()=>{this.selectLesson(lesson)}}>
                <View style={styles.lessonRow}>
                    <Icon name="book" size={16} color="#666" style={styles.lessonIcon}/>
                    <Text style={styles.lessonName}>
                        {lesson.name}
                    </Text>
                </View>
            </TouchableNativeFeedback>
        );
    },
    selectLesson: function (lesson) {
        this.setState({
            selectedLesson: lesson,
            isSelecting: false
        });
        this.fetchTasks(lesson);
    },
    selectTask: function (task) {
        this.props.navigator.push({
            name: 'task',
            taskId: task.taskId
        });
    },
    addTask: function () {
        this.props.navigator.push({
            name: 'add_task',
            lesson: this.state.selectedLesson
        });
    },
    render() {
        if (this.state.isSelecting) {
            return (
                <ListView
                    dataSource={this.state.lessonDataSource}
                    renderRow={this.renderLessonRow}
                />
            );
        }
        if (this.state.selectedLesson._id) {
            return (
                <View style={styles.layout}>
                    <TouchableNativeFeedback
                        background={TouchableNativeFeedback.SelectableBackground()}
                        onPress={()=>{this.setState({isSelecting:true})}}>
                        <View style={styles.selectButton}>
                            <Icon name="book" size={16} color="#666" style={styles.lessonIcon}/>
                            <Text style={styles.selectButtonText}>
                                {this.state.selectedLesson && this.state.selectedLesson.name || '全部课程'}
                            </Text>
                            <Icon name="angle-right" size={18} color="#666" style={styles.taskIcon}/>
                        </View>
                    </TouchableNativeFeedback>
                    <ListView
                        style={styles.list}
                        dataSource={this.state.taskDataSource}
                        renderRow={this.renderRow}/>
                    <ActionButton
                        onPress={this.addTask}
                        icon={<Image style={{height:24,width:24}} source={require('image!ic_add')}/>}
                        buttonColor="rgba(76,175,80,1)"/>
                </View>
            );
        }
        return (
            <View style={styles.layout}>
                <TouchableNativeFeedback
                    background={TouchableNativeFeedback.SelectableBackground()}
                    onPress={()=>{this.setState({isSelecting:true})}}>
                    <View style={styles.selectButton}>
                        <Icon name="book" size={16} color="#666" style={styles.lessonIcon}/>
                        <Text style={styles.selectButtonText}>
                            {this.state.selectedLesson && this.state.selectedLesson.name || '全部课程'}
                        </Text>
                        <Icon name="angle-right" size={18} color="#666" style={styles.taskIcon}/>
                    </View>
                </TouchableNativeFeedback>
                <ListView
                    style={styles.list}
                    dataSource={this.state.taskDataSource}
                    renderRow={this.renderRow}/>
            </View>
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
    taskIcon: {
        marginRight: 12
    },
    title: {
        flex: 1,
        fontSize: 17,
        color: '#286E2C'
    },
    titleOrange: {
        flex: 1,
        fontSize: 17,
        color: '#FF9124'
    },
    titleRed: {
        flex: 1,
        fontSize: 17,
        color: '#FF4D4D'
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
    },
    selectButton: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        alignItems: 'center',
        borderBottomWidth: 1.5,
        borderBottomColor: '#286E2C',
        paddingHorizontal: 12,
        paddingVertical: 16
    },
    selectButtonText: {
        flex: 1,
        fontSize: 16
    },
    selectButtonIcon: {},
    lessonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: '#CCC'
    },
    lessonIcon: {
        marginRight: 8
    },
    lessonName: {
        flex: 1,
        fontSize: 16
    }
});

module.exports = TasksList;
