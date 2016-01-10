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
    } = React;

var Constants = require('./Constants');

var LessonsList = React.createClass({
    getInitialState() {
        var dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        return {
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
            if (json.error == 0) {
                self.setState({
                    dataSource: self.state.dataSource.cloneWithRows(json.students)
                });
            } else {
                ToastAndroid.show(json.message, ToastAndroid.SHORT);
            }
        }).catch(function (e) {
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
        return (
            <TouchableNativeFeedback
                onPress={()=>this.selectStudent(student)}
                background={TouchableNativeFeedback.SelectableBackground()}>
                <View style={styles.row}>
                    <Image
                        style={styles.avatar}
                        source={{uri:Constants.URL_PREFIX_AVATAR+student._id}}/>
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
        return (
            <View style={styles.container}>
                <ToolbarAndroid
                    navIcon={require('image!ic_back_white')}
                    title={'学生列表 '+this.props.lesson.name}
                    titleColor="white"
                    style={styles.toolbar}
                    onIconClicked={() => this.props.navigator.pop()}/>
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
    name: {
        fontSize: 17,
        color: '#222'
    },
    number: {
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

module.exports = LessonsList;
