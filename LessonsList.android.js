'use strict';

var React = require('react-native');

var {
    ListView,
    StyleSheet,
    Text,
    View,
    TouchableNativeFeedback,
    ToastAndroid,
    AsyncStorage
} = React;

var Icon = require('react-native-vector-icons/FontAwesome');
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
                var lessons = json.lessons;
                self.setState({
                    dataSource: self.state.dataSource.cloneWithRows(lessons)
                });
                AsyncStorage.setItem('@Lessons', JSON.stringify(
                    lessons.map(function (lesson) {
                        return {
                            _id: lesson._id,
                            name: lesson.name
                        };
                    }))
                );
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
                    <Icon name="clock-o" size={16} color="#666" style={styles.planIcon}/>
                    <Text style={styles.period}>{day + ' ' + period}</Text>
                    <Text style={styles.classroom}>{item.classroom}</Text>
                </View>
            );
        });
        return (
            <View style={styles.lessonView}>
                <View style={styles.lessonHeader}>
                    <Icon name="book" size={32} color="#666" style={styles.lessonHeaderIcon}/>
                    <View style={styles.lessonHeaderText}>
                        <Text
                            style={styles.lessonTitle}>
                            {(lesson.name)}
                        </Text>
                        <Text
                            style={styles.lessonSubtitle}>
                            {(lesson.term) + ' - ' + (lesson.term + 1) + ' 第' + lesson.half + '学期'}
                        </Text>
                    </View>
                </View>
                <View style={styles.plans}>
                    {plans}
                </View>
                <View style={styles.actions}>
                    <TouchableNativeFeedback
                        onPress={()=>this.rollCall(lesson)}>
                        <View style={styles.buttonCall}>
                            <Icon name="bell" size={16} color="#E56E2E" style={styles.buttonCallIcon}/>
                            <Text style={styles.buttonCallText}>{'课堂点名'}</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback
                        onPress={()=>this.viewStudents(lesson)}>
                        <View style={styles.buttonStudents}>
                            <Icon name="group" size={16} color="#139A86" style={styles.buttonStudentsIcon}/>
                            <Text style={styles.buttonStudentsText}>{'学生列表'}</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback
                        onPress={()=>this.viewResources(lesson)}>
                        <View style={styles.buttonResources}>
                            <Icon name="folder" size={16} color="#1884BF" style={styles.buttonResourcesIcon}/>
                            <Text style={styles.buttonResourcesText}>{'课程资源'}</Text>
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
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        paddingHorizontal: 16,
        paddingBottom: 8,
        borderBottomColor: '#CCC',
        borderBottomWidth: 0.5
    },
    lessonHeaderIcon: {
        marginRight: 16
    },
    lessonHeaderText: {
        flexDirection: 'column'
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
        alignItems: 'center',
        marginTop: 4
    },
    planIcon: {
        marginRight: 12
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
    buttonCall: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
        borderColor: '#E56E2E',
        borderWidth: 1,
        borderRadius: 4
    },
    buttonCallIcon: {
        marginRight: 4
    },
    buttonCallText: {
        fontSize: 16,
        color: '#E56E2E'
    },
    buttonStudents: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 16,
        padding: 6,
        borderColor: '#139A86',
        borderWidth: 1,
        borderRadius: 4
    },
    buttonStudentsIcon: {
        marginRight: 4
    },
    buttonStudentsText: {
        fontSize: 16,
        color: '#139A86'
    },
    buttonResources: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 16,
        padding: 6,
        borderColor: '#1884BF',
        borderWidth: 1,
        borderRadius: 4
    },
    buttonResourcesIcon: {
        marginRight: 4
    },
    buttonResourcesText: {
        fontSize: 16,
        color: '#1884BF'
    }
});

module.exports = EventsList;
