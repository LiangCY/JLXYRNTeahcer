'use strict';

var React = require('react-native');

var {
    ListView,
    StyleSheet,
    ToolbarAndroid,
    Image,
    Text,
    View,
    TouchableNativeFeedback,
    ToastAndroid,
    PullToRefreshViewAndroid,
} = React;

var Constants = require('./Constants');

var HomeworkList = React.createClass({
    getInitialState() {
        var dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        return {
            isRefresh: false,
            dataSource: dataSource
        };
    },
    componentWillMount: function () {
        var navigator = this.props.navigator;
        var self = this;
        var didFocusCallback = function (event) {
            if (event.data.route.name == 'homework_list') {
                self.fetchStudents();
            }
        };
        this._listeners = [
            navigator.navigationContext.addListener('didfocus', didFocusCallback)
        ];
    },
    componentDidMount: function () {
        this.fetchStudents();
    },
    componentWillUnmount: function () {
        this._listeners && this._listeners.forEach(listener => listener.remove());
    },
    fetchStudents: function () {
        if (this.state.isRefresh) {
            return;
        }
        this.setState({
            isRefresh: true
        });
        var self = this;
        fetch(Constants.URL_HOMEWORK_LIST + this.props.task._id, {
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            if (json.error == 0) {
                self.setState({
                    isRefresh: false,
                    dataSource: self.state.dataSource.cloneWithRows(json.homeworks)
                });
            } else {
                self.setState({
                    isRefresh: false
                });
                ToastAndroid.show(json.message, ToastAndroid.SHORT);
            }
        }).catch(function (e) {
            self.setState({
                isRefresh: false
            });
            ToastAndroid.show(e.message, ToastAndroid.SHORT);
        });
    },
    viewHomework: function (homework) {
        this.props.navigator.push({
            name: 'homework',
            homeworkId: homework._id
        });
    },
    viewStudent: function (student) {
        this.props.navigator.push({
            name: 'student',
            studentId: student._id
        });
    },
    renderRow: function (homework) {
        if (homework.status == 1) {
            var status = '未批改';
            var statusStyle = styles.statusNotGrade
        } else if (homework.status == 2) {
            if (homework.doubt) {
                status = '质疑';
                statusStyle = styles.statusAskForRedo
            } else {
                status = homework.grade + (homework.remark ? ' (' + homework.remark + ')' : '');
                statusStyle = parseInt(status) >= 60 ? styles.statusPass : styles.statusNotPass;
            }
        } else if (homework.status == 3) {
            status = '申请重交';
            statusStyle = styles.statusAskForRedo
        }
        return (
            <TouchableNativeFeedback
                onPress={()=>this.viewHomework(homework)}
                background={TouchableNativeFeedback.SelectableBackground()}>
                <View style={styles.row}>
                    <TouchableNativeFeedback
                        onPress={()=>this.viewStudent(homework.student)}
                        background={TouchableNativeFeedback.SelectableBackground()}>
                        <View>
                            <Image style={styles.avatar}
                                   source={{uri:Constants.URL_PREFIX_AVATAR+homework.student._id}}/>
                        </View>
                    </TouchableNativeFeedback>
                    <View style={styles.column}>
                        <View style={styles.studentRow}>
                            <Text
                                style={styles.name}>
                                {homework.student.name}
                            </Text>
                            <Text
                                style={styles.number}>
                                {homework.student._id}
                            </Text>
                        </View>
                        <Text
                            style={styles.time}>
                            {homework.submitAt + ' 提交'}
                        </Text>
                    </View>
                    <Text style={statusStyle}>
                        {status}
                    </Text>
                </View>
            </TouchableNativeFeedback>
        );
    },
    render() {
        return (
            <View style={styles.container}>
                <ToolbarAndroid
                    navIcon={require('image!ic_back_white')}
                    title={this.props.task.title}
                    titleColor="white"
                    style={styles.toolbar}
                    onIconClicked={() => this.props.navigator.pop()}/>
                <PullToRefreshViewAndroid
                    style={styles.layout}
                    refreshing={this.state.isRefreshing}
                    onRefresh={this.fetchStudents}
                    colors={['#4CAF50']}>
                    <ListView
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
        backgroundColor: 'white',
        padding: 12,
        borderBottomColor: '#DDD',
        borderBottomWidth: 0.5
    },
    avatar: {
        height: 48,
        width: 48,
        borderRadius: 24
    },
    column: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 16
    },
    studentRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    name: {
        fontSize: 17,
        color: '#222'
    },
    number: {
        fontSize: 15,
        marginLeft: 8
    },
    time: {
        fontSize: 16,
        marginTop: 4
    },
    button: {
        marginRight: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderColor: '#388E3C',
        borderWidth: 2,
        borderRadius: 4
    },
    buttonText: {
        fontSize: 16,
        color: '#388E3C'
    },
    statusNotGrade: {
        color: '#888',
        fontSize: 16
    },
    statusPass: {
        color: '#4EAC39',
        fontSize: 18
    },
    statusNotPass: {
        color: '#C14C44',
        fontSize: 18
    },
    statusAskForRedo: {
        color: '#FF8C1A',
        fontSize: 16
    }
});

module.exports = HomeworkList;
