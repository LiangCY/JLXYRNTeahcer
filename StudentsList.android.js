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
    ProgressBarAndroid,
} = React;

var Constants = require('./Constants');

var StudentsList = React.createClass({
    getInitialState() {
        var dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        return {
            loading: true,
            dataSource: dataSource
        };
    },
    componentDidMount: function () {
        this.fetchStudents();
    },
    fetchStudents: function () {
        var self = this;
        fetch(Constants.URL_LESSON_STUDENTS + this.props.lesson._id, {
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            self.setState({
                loading: false
            });
            if (json.error == 0) {
                self.setState({
                    dataSource: self.state.dataSource.cloneWithRows(json.students)
                });
            } else {
                ToastAndroid.show(json.message, ToastAndroid.SHORT);
            }
        }).catch(function (e) {
            self.setState({
                loading: false
            });
            ToastAndroid.show(e.message, ToastAndroid.SHORT);
        });
    },
    selectStudent: function (student) {
        this.props.navigator.push({
            name: 'student',
            studentId: student._id
        });
    },
    sendMessage: function (student) {
        this.props.navigator.push({
            name: 'edit_message',
            student: student
        });
    },
    renderRow: function (student) {
        var attendance = '';
        if (student.absentCount > 0) {
            attendance = '缺勤' + student.absentCount + '次';
            if (student.leaveCount > 0) {
                attendance += ' 请假' + student.leaveCount + '次';
            }
        } else if (student.leaveCount > 0) {
            attendance = '请假' + student.leaveCount + '次';
        } else {
            attendance = '全勤';
        }
        return (
            <TouchableNativeFeedback
                onPress={()=>this.selectStudent(student)}
                background={TouchableNativeFeedback.SelectableBackground()}>
                <View style={styles.row}>
                    <Image
                        style={styles.avatar}
                        source={{uri:Constants.URL_PREFIX_AVATAR+student._id}}/>
                    <View style={styles.column}>
                        <View style={styles.nameRow}>
                            <Text
                                style={styles.name}>
                                {(student.name)}
                            </Text>
                            <Text
                                style={styles.number}>
                                {student._id}
                            </Text>
                        </View>
                        <Text
                            style={styles.attendance}>
                            {attendance}
                        </Text>
                    </View>
                    <TouchableNativeFeedback
                        onPress={()=>this.sendMessage(student)}
                        background={TouchableNativeFeedback.SelectableBackground()}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>{'私信'}</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </TouchableNativeFeedback>
        );
    },
    render() {
        var toolbar = (
            <ToolbarAndroid
                navIcon={require('image!ic_back_white')}
                title={'学生列表 '+this.props.lesson.name}
                titleColor="white"
                style={styles.toolbar}
                onIconClicked={() => this.props.navigator.pop()}/>
        );
        if (this.state.loading) {
            return (
                <View style={styles.container}>
                    {toolbar}
                    <View style={styles.progressView}>
                        <ProgressBarAndroid styleAttr="Large"/>
                    </View>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                {toolbar}
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}/>
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
    progressView: {
        flex: 1,
        justifyContent: 'center'
    },
    list: {
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
        marginRight: 16,
        borderRadius: 24
    },
    column: {
        flex: 1,
        flexDirection: 'column'
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    name: {
        fontSize: 17,
        color: '#222'
    },
    number: {
        fontSize: 15,
        marginLeft: 4
    },
    attendance: {
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
    }
});

module.exports = StudentsList;
