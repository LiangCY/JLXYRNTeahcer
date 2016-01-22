'use strict';

var React = require('react-native');

var {
    ListView,
    StyleSheet,
    ToolbarAndroid,
    Text,
    View,
    TouchableNativeFeedback,
    ToastAndroid,
    } = React;

var Constants = require('./Constants');

var RollCallScreen = React.createClass({
    getInitialState() {
        var dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        return {
            dataSource: dataSource,
            students: [],
            saving: false
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
            if (json.error == 0) {
                var students = json.students.map(function (student) {
                    return {
                        ...student,
                        status: 0
                    }
                });
                self.setState({
                    dataSource: self.state.dataSource.cloneWithRows(students),
                    students: students
                });
            } else {
                ToastAndroid.show(json.message, ToastAndroid.SHORT);
            }
        }).catch(function (e) {
            ToastAndroid.show(e.message, ToastAndroid.SHORT);
        });
    },
    selectAttend: function (student) {
        var students = this.state.students.slice();
        var index = students.map((student)=>student._id).indexOf(student._id);
        students[index] = {
            ...this.state.students[index],
            status: 0
        };
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(students),
            students: students
        });
    },
    selectAbsent: function (student) {
        var students = this.state.students.slice();
        var index = students.map((student)=>student._id).indexOf(student._id);
        students[index] = {
            ...this.state.students[index],
            status: 1
        };
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(students),
            students: students
        });
    },
    selectLeave: function (student) {
        var students = this.state.students.slice();
        var index = students.map((student)=>student._id).indexOf(student._id);
        students[index] = {
            ...this.state.students[index],
            status: 2
        };
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(students),
            students: students
        });
    },
    confirmRollCall: function () {
        if (this.state.saving) {
            return;
        }
        this.setState({
            saving: true
        });
        var students = this.state.students;
        var absent = students.filter((student)=>student.status == 1)
            .map((student)=>student._id);
        var leave = students.filter((student)=>student.status == 2)
            .map((student)=>student._id);
        var self = this;
        fetch(Constants.URL_ROLL_CALL + this.props.lesson._id, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                absent: absent,
                leave: leave
            }),
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            self.setState({
                saving: false
            });
            if (json.error == 0) {
                ToastAndroid.show('点名记录已保存', ToastAndroid.SHORT);
                self.props.navigator.pop();
            } else {
                ToastAndroid.show(json.message, ToastAndroid.SHORT);
            }
        }).catch(function (e) {
            self.setState({
                saving: false
            });
            ToastAndroid.show(e.message, ToastAndroid.SHORT);
        });
    },
    renderRow: function (student) {
        var buttonStyleAttend = styles.buttonAttend;
        var buttonTextStyleAttend = styles.buttonTextAttend;
        var buttonStyleAbsent = styles.buttonAbsent;
        var buttonTextStyleAbsent = styles.buttonTextAbsent;
        var buttonStyleLeave = styles.buttonLeave;
        var buttonTextStyleLeave = styles.buttonTextLeave;
        if (student.status == 0) {
            buttonStyleAttend = styles.buttonAttendActive;
            buttonTextStyleAttend = styles.buttonTextAttendActive;
        }
        if (student.status == 1) {
            buttonStyleAbsent = styles.buttonAbsentActive;
            buttonTextStyleAbsent = styles.buttonTextAbsentActive;
        }
        else if (student.status == 2) {
            buttonStyleLeave = styles.buttonLeaveActive;
            buttonTextStyleLeave = styles.buttonTextLeaveActive;
        }
        return (
            <View style={styles.row}>
                <View style={styles.column}>
                    <Text
                        style={styles.name}>
                        {(student.name)}
                    </Text>
                    <Text
                        style={styles.number}>
                        {student._id}
                    </Text>
                </View>
                <TouchableNativeFeedback
                    onPress={()=>this.selectAttend(student)}
                    background={TouchableNativeFeedback.SelectableBackground()}>
                    <View style={buttonStyleAttend}>
                        <Text style={buttonTextStyleAttend}>{'出勤'}</Text>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback
                    onPress={()=>this.selectAbsent(student)}
                    background={TouchableNativeFeedback.SelectableBackground()}>
                    <View style={buttonStyleAbsent}>
                        <Text style={buttonTextStyleAbsent}>{'缺勤'}</Text>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback
                    onPress={()=>this.selectLeave(student)}
                    background={TouchableNativeFeedback.SelectableBackground()}>
                    <View style={buttonStyleLeave}>
                        <Text style={buttonTextStyleLeave}>{'请假'}</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        );
    },
    renderFooter: function () {
        var absentCount = 0;
        var leaveCount = 0;
        var attendCount = 0;
        this.state.students.forEach(function (student) {
            if (student.status == 0) {
                attendCount++;
            } else if (student.status == 1) {
                absentCount++;
            } else {
                leaveCount++;
            }
        });
        return (
            <View style={styles.footer}>
                <Text style={styles.message}>
                    {attendCount + '人到课，' + absentCount + '人缺勤，' + leaveCount + '人请假'}
                </Text>
                <TouchableNativeFeedback
                    onPress={this.confirmRollCall}
                    background={TouchableNativeFeedback.SelectableBackground()}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>{'确定'}</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        );
    },
    render() {
        return (
            <View style={styles.container}>
                <ToolbarAndroid
                    navIcon={require('image!ic_back_white')}
                    title={'点名 '+this.props.lesson.name}
                    titleColor="white"
                    style={styles.toolbar}
                    onIconClicked={() => this.props.navigator.pop()}/>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    renderFooter={this.renderFooter}/>
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
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 12,
        borderBottomColor: '#DDD',
        borderBottomWidth: 0.5
    },
    column: {
        flex: 1,
        flexDirection: 'column'
    },
    name: {
        fontSize: 17,
        color: '#222'
    },
    number: {
        fontSize: 16,
        marginTop: 4
    },
    buttonAttend: {
        marginRight: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderColor: '#4CAF50',
        borderWidth: 1,
        borderRadius: 4
    },
    buttonTextAttend: {
        fontSize: 16,
        color: '#4CAF50'
    },
    buttonAttendActive: {
        marginRight: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
        borderWidth: 1,
        borderRadius: 4
    },
    buttonTextAttendActive: {
        fontSize: 16,
        color: 'white'
    },
    buttonAbsent: {
        marginRight: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderColor: 'red',
        borderWidth: 1,
        borderRadius: 4
    },
    buttonTextAbsent: {
        fontSize: 16,
        color: 'red'
    },
    buttonAbsentActive: {
        marginRight: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: 'red',
        borderColor: 'red',
        borderWidth: 1,
        borderRadius: 4
    },
    buttonTextAbsentActive: {
        fontSize: 16,
        color: 'white'
    },
    buttonLeave: {
        marginRight: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderColor: 'orange',
        borderWidth: 1,
        borderRadius: 4
    },
    buttonTextLeave: {
        fontSize: 16,
        color: 'orange'
    },
    buttonLeaveActive: {
        marginRight: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: 'orange',
        borderColor: 'orange',
        borderWidth: 1,
        borderRadius: 4
    },
    buttonTextLeaveActive: {
        fontSize: 16,
        color: 'white'
    },
    footer: {
        flexDirection: 'column',
        paddingVertical: 12
    },
    message: {
        marginHorizontal: 16,
        fontSize: 17,
        color: '#444'
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 12,
        paddingVertical: 8,
        backgroundColor: 'white',
        borderBottomColor: '#BBB',
        borderBottomWidth: 1,
        borderTopColor: '#BBB',
        borderTopWidth: 1
    },
    buttonText: {
        fontSize: 18,
        color: '#2C8F36'
    }
});

module.exports = RollCallScreen;
