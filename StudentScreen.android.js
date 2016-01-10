'use strict';

var React = require('react-native');

var {
    StyleSheet,
    ToolbarAndroid,
    Text,
    Image,
    View,
    ProgressBarAndroid,
    ScrollView,
    ToastAndroid,
    TouchableNativeFeedback,
    } = React;

var Constants = require('./Constants');
var MessagesList = require('./MessagesList');

var TeacherScreen = React.createClass({
    getInitialState() {
        return {
            student: null
        };
    },
    componentDidMount: function () {
        this.fetchStudent(this.props.studentId);
    },
    fetchStudent: function (studentId) {
        var self = this;
        fetch(Constants.URL_STUDENT + studentId, {
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            if (json.error == 0) {
                self.setState({
                    student: json.student
                });
            } else {
                ToastAndroid.show(json.message, ToastAndroid.SHORT);
            }
        }).catch(function (e) {
            ToastAndroid.show(e.message, ToastAndroid.SHORT);
        });
    },
    sendMessage: function (student) {
        this.props.navigator.push({
            name: 'edit_message',
            student: student
        });
    },
    render: function () {
        var student = this.state.student;
        if (!student) {
            return (
                <View style={styles.container}>
                    <ToolbarAndroid
                        navIcon={require('image!ic_back_white')}
                        title='学生'
                        titleColor="white"
                        style={styles.toolbar}
                        onIconClicked={() => this.props.navigator.pop()}/>
                    <View style={styles.progressView}>
                        <ProgressBarAndroid styleAttr="Large"/>
                    </View>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <ToolbarAndroid
                    navIcon={require('image!ic_back_white')}
                    title={student.name}
                    titleColor="white"
                    style={styles.toolbar}
                    onIconClicked={() => this.props.navigator.pop()}/>
                <ScrollView style={styles.scroll}>
                    <View style={styles.teacherView}>
                        <View style={styles.header}>
                            <Image style={styles.avatar}
                                   source={{uri:Constants.URL_PREFIX+'/avatar/'+student._id}}/>
                            <View style={styles.headerContent}>
                                <Text
                                    style={styles.title}>
                                    {student.name}
                                </Text>
                                <Text
                                    style={styles.subTitle}>
                                    {student._id}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.rowTitle}>{'院系'}</Text>
                            <Text style={styles.rowContent}>{student.school}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.rowTitle}>{'专业'}</Text>
                            <Text style={styles.rowContent}>{student.major}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.rowTitle}>{'年级'}</Text>
                            <Text style={styles.rowContent}>{student.year}</Text>
                        </View>
                        <TouchableNativeFeedback onPress={()=>this.sendMessage(student)}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>
                                    {'发送私信'}
                                </Text>
                            </View>
                        </TouchableNativeFeedback>
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
        backgroundColor: '#F4F4F4'
    },
    teacherView: {
        flex: 1,
        padding: 16
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#CCC'
    },
    avatar: {
        height: 64,
        width: 64,
        borderRadius: 32
    },
    headerContent: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 16
    },
    title: {
        fontSize: 20,
        color: '#333'
    },
    subTitle: {
        marginTop: 4,
        fontSize: 15
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#CCC'
    },
    rowTitle: {
        fontSize: 16,
        color: '#333'
    },
    rowContent: {
        marginLeft: 34,
        fontSize: 16
    },
    button: {
        marginTop: 24,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 24
    },
    buttonText: {
        color: 'white',
        fontSize: 18
    }
});

module.exports = TeacherScreen;