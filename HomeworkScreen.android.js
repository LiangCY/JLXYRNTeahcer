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

var Constants = require('./Constants');

var TaskScreen = React.createClass({
    getInitialState() {
        return {
            homework: null
        };
    },
    componentDidMount: function () {
        this.fetchHomework(this.props.homeworkId);
    },
    fetchHomework: function (homeworkId) {
        var self = this;
        fetch(Constants.URL_HOMEWORK + homeworkId, {
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            if (json.error == 0) {
                console.log(json);
                self.setState({
                    homework: json.homework
                });
            } else {
                ToastAndroid.show(json.message, ToastAndroid.SHORT);
            }
        }).catch(function (e) {
            ToastAndroid.show(e.message, ToastAndroid.SHORT);
        });
    },
    downloadFile: function () {
        var url = Constants.URL_PREFIX + this.state.homework.attachmentUrl;
        IntentAndroid.openURL(url);
    },
    render: function () {
        var toolbar = (
            <ToolbarAndroid
                navIcon={require('image!ic_back_white')}
                title='学生作业'
                titleColor="white"
                style={styles.toolbar}
                onIconClicked={() => this.props.navigator.pop()}/>
        );
        if (!this.state.homework) {
            return (
                <View style={styles.container}>
                    {toolbar}
                    <View style={styles.progressView}>
                        <ProgressBarAndroid styleAttr="Large"/>
                    </View>
                </View>
            );
        }
        var homework = this.state.homework;
        if (homework.attachmentUrl) {
            var attachment = (
                <View>
                    <View style={styles.sectionContent}>
                        <TouchableNativeFeedback
                            onPress={this.downloadFile}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>{'附件下载'}</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                </View>
            );
        } else {
            attachment = (<View/>);
        }
        if (homework.status == 1) {
            var status = '未批改';
            var statusStyle = styles.statusNotGrade
        } else if (homework.status == 2) {
            status = homework.grade + (homework.remark ? ' (' + homework.remark + ')' : '');
            statusStyle = parseInt(status) >= 60 ? styles.statusPass : styles.statusNotPass;
        } else if (homework.status == 3) {
            status = '申请重交 (' + homework.redoReason + ')';
            statusStyle = styles.statusAskForRedo
        }
        return (
            <View style={styles.container}>
                {toolbar}
                <ScrollView style={styles.scroll}>
                    <View style={styles.homeworkView}>
                        <View style={styles.content}>
                            <Text
                                style={styles.sectionTitle}>
                                {'作业'}
                            </Text>
                            <Text
                                style={styles.sectionContent}>
                                {homework.task.title}
                            </Text>
                            <Text
                                style={styles.sectionTitle}>
                                {'学生'}
                            </Text>
                            <Text
                                style={styles.sectionContent}>
                                {homework.student.name + ' ' + homework.student._id}
                            </Text>
                            <Text
                                style={styles.sectionTitle}>
                                {'提交时间'}
                            </Text>
                            <Text
                                style={styles.sectionContent}>
                                {homework.submitAt}
                            </Text>
                            <Text
                                style={styles.sectionTitle}>
                                {'作业标题'}
                            </Text>
                            <Text
                                style={styles.sectionContent}>
                                {homework.title}
                            </Text>
                            <Text
                                style={styles.sectionTitle}>
                                {'作业内容'}
                            </Text>
                            <View style={styles.sectionContent}>
                                <HTMLView
                                    onLinkPress={(url) => IntentAndroid.openURL(url)}
                                    value={homework.content||'无内容'}/>
                            </View>
                            {attachment}
                        </View>
                        <View style={styles.status}>
                            <Text style={statusStyle}>{status}</Text>
                        </View>
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
        backgroundColor: '#E8E8E8',
        padding: 12
    },
    homeworkView: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
        marginBottom: 24
    },
    content: {
        paddingBottom: 12,
        borderBottomColor: '#CCC',
        borderBottomWidth: 1
    },
    sectionTitle: {
        fontSize: 16,
        color: 'black'
    },
    sectionContent: {
        marginTop: 2,
        marginBottom: 6
    },
    button: {
        flexDirection: 'column',
        alignItems: 'center',
        width: 96,
        padding: 6,
        backgroundColor: '#388E3C',
        borderRadius: 4
    },
    buttonText: {
        fontSize: 16,
        color: 'white'
    },
    status: {
        marginTop: 12
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

module.exports = TaskScreen;