'use strict';

var React = require('react-native');

var {
    ListView,
    StyleSheet,
    Text,
    View,
    TouchableNativeFeedback,
    } = React;

var Constants = require('./Constants');

var EventsList = React.createClass({
    getInitialState() {
        var dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        return {
            dataSource: dataSource
        };
    },
    componentDidMount: function () {
        this.fetchLessons();
    },
    fetchLessons: function () {
        var self = this;
        fetch(Constants.URL_LESSONS, {
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            if (json.error == 0) {
                self.setState({
                    dataSource: self.state.dataSource.cloneWithRows(json.lessons)
                });
            } else {
                ToastAndroid.show(json.message, ToastAndroid.SHORT);
            }
        }).catch(function (e) {
            ToastAndroid.show(e.message, ToastAndroid.SHORT);
        });
    },
    rollCall: function (lesson) {
        this.props.navigator.push({
            name: 'roll_call',
            lesson: lesson
        });
    },
    viewStudents: function (lesson) {
        this.props.navigator.push({
            name: 'students',
            lesson: lesson
        });
    },
    viewResources: function (lesson) {
        this.props.navigator.push({
            name: 'resources',
            lesson: lesson
        });
    },
    renderRow: function (lesson) {
        lesson.plan.sort(function (a, b) {
            return a.day - b.day;
        });
        var plans = lesson.plan.map(function (item) {
            switch (item.day) {
                case 1:
                    var day = '周一';
                    break;
                case 2:
                    day = '周二';
                    break;
                case 3:
                    day = '周三';
                    break;
                case 4:
                    day = '周四';
                    break;
                case 5:
                    day = '周五';
                    break;
                case 6:
                    day = '周六';
                    break;
                case 7:
                    day = '周日';
                    break;
            }
            var period = item.start + ' - ' + (item.start + item.period - 1) + '节';
            return (
                <View style={styles.planRow} key={item._id}>
                    <Text style={styles.period}>{day + ' ' + period}</Text>
                    <Text style={styles.classroom}>{item.classroom}</Text>
                </View>
            );
        });
        return (
            <View style={styles.lessonView}>
                <View style={styles.lessonHeader}>
                    <Text
                        style={styles.lessonTitle}>
                        {(lesson.name)}
                    </Text>
                    <Text
                        style={styles.lessonSubtitle}>
                        {(lesson.term) + ' - ' + (lesson.term + 1) + ' 第' + lesson.half + '学期'}
                    </Text>
                </View>
                <View style={styles.plans}>
                    {plans}
                </View>
                <View style={styles.actions}>
                    <TouchableNativeFeedback
                        onPress={()=>this.rollCall(lesson)}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>{'课堂点名'}</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback
                        onPress={()=>this.viewStudents(lesson)}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>{'学生列表'}</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback
                        onPress={()=>this.viewResources(lesson)}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>{'课程资源'}</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
        );
    },
    render() {
        return (
            <View style={styles.container}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}/>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8E8E8',
        paddingBottom: 16
    },
    lessonView: {
        flexDirection: 'column',
        marginTop: 12,
        paddingVertical: 12,
        backgroundColor: 'white'
    },
    lessonHeader: {
        flexDirection: 'column',
        marginBottom: 8,
        paddingHorizontal: 16,
        paddingBottom: 8,
        borderBottomColor: '#CCC',
        borderBottomWidth: 0.5
    },
    lessonTitle: {
        fontSize: 17,
        color: '#222'
    },
    lessonSubtitle: {
        marginTop: 2,
        fontSize: 15
    },
    plans: {
        flexDirection: 'column',
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomColor: '#CCC',
        borderBottomWidth: 0.5
    },
    planRow: {
        flexDirection: 'row',
        marginTop: 4
    },
    period: {
        fontSize: 15
    },
    classroom: {
        fontSize: 15,
        marginLeft: 16,
        color: '#444'
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
        padding: 6,
        borderColor: '#388E3C',
        borderWidth: 1,
        borderRadius: 4
    },
    buttonText: {
        fontSize: 16,
        color: '#388E3C'
    }
});

module.exports = EventsList;
