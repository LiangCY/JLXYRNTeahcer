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
    TouchableNativeFeedback,
    TextInput,
    } = React;

var HTMLView = require('react-native-htmlview');

var Constants = require('./Constants');

var TaskScreen = React.createClass({
    getInitialState() {
        return {
            homework: null,
            isLoading: false,
            grade: '',
            remark: ''
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
    grade: function () {
        if (this.state.isLoading) {
            return;
        }
        this.setState({
            isLoading: true
        });
        var grade = this.state.grade;
        var remark = this.state.remark;
        if (/^[0-9]$/.test(grade) ||
            /^[1-9][0-9]$/.test(grade) ||
            /^100$/.test(grade)) {
            var self = this;
            fetch(Constants.URL_GRADE + this.state.homework._id, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    grade: parseInt(grade),
                    remark: remark
                }),
                credentials: 'same-origin'
            }).then(function (response) {
                return response.json()
            }).then(function (json) {
                self.setState({
                    isLoading: false
                });
                if (json.error == 0) {
                    ToastAndroid.show('已完成评分', ToastAndroid.SHORT);
                    self.props.navigator.pop();
                } else {
                    ToastAndroid.show(json.message, ToastAndroid.SHORT);
                }
            }).catch(function (e) {
                self.setState({
                    isLoading: false
                });
                ToastAndroid.show(e.message, ToastAndroid.SHORT);
            });
        } else {
            ToastAndroid.show('错误的分数格式', ToastAndroid.SHORT);
        }
    },
    approveRedo: function () {
        if (this.state.isLoading) {
            return;
        }
        this.setState({
            isLoading: true
        });
        var self = this;
        fetch(Constants.URL_APPROVE_REDO + this.state.homework._id, {
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            self.setState({
                isLoading: false
            });
            if (json.error == 0) {
                ToastAndroid.show('已同意重交申请', ToastAndroid.SHORT);
                self.props.navigator.pop();
            } else {
                ToastAndroid.show(json.message, ToastAndroid.SHORT);
            }
        }).catch(function (e) {
            self.setState({
                isLoading: false
            });
            ToastAndroid.show(e.message, ToastAndroid.SHORT);
        });
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
            var attachmentView = (
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
            attachmentView = (<View/>);
        }
        var gradeViewActive = (
            <View style={styles.gradeView}>
                <Text
                    style={styles.sectionTitle}>
                    {'作业批改'}
                </Text>
                <View style={styles.scoreView}>
                    <TextInput
                        placeholder="分数"
                        style={styles.scoreInput}
                        underlineColorAndroid="transparent"
                        onChangeText={(text) => this.setState({grade:text})}
                        value={this.state.grade}/>
                </View>
                <View style={styles.remarkView}>
                    <TextInput
                        placeholder="评语"
                        style={styles.remarkInput}
                        multiline={true}
                        textAlign='start'
                        textAlignVertical='top'
                        underlineColorAndroid="transparent"
                        onChangeText={(text) => this.setState({remark:text})}
                        value={this.state.remark}/>
                </View>
                <View style={styles.sectionContent}>
                    <TouchableNativeFeedback
                        onPress={this.grade}>
                        <View style={styles.buttonGrade}>
                            <Text style={styles.buttonText}>{'评分'}</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
        );
        var redoView = <View/>;
        if (homework.status == 1) {
            var status = '未批改';
            var statusStyle = styles.statusNotGrade;
            var gradeView = gradeViewActive;
        } else if (homework.status == 2) {
            status = homework.grade + (homework.remark ? ' (' + homework.remark + ')' : '');
            statusStyle = parseInt(status) >= 60 ? styles.statusPass : styles.statusNotPass;
            gradeView = <View/>;
        } else if (homework.status == 3) {
            status = '申请重交 (' + homework.redoReason + ')';
            statusStyle = styles.statusAskForRedo;
            gradeView = gradeViewActive;
            redoView = (
                <View>
                    <View style={styles.sectionContent}>
                        <TouchableNativeFeedback
                            onPress={this.approveRedo}>
                            <View style={styles.buttonApprove}>
                                <Text style={styles.buttonText}>{'同意重交'}</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                </View>
            );
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
                            {attachmentView}
                        </View>
                        <View style={styles.status}>
                            <Text style={statusStyle}>{status}</Text>
                            {redoView}
                        </View>
                    </View>
                    {gradeView}
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
        padding: 16,
        backgroundColor: 'white',
        marginBottom: 16
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
        backgroundColor: '#4CAF50',
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
        fontSize: 16,
        marginBottom: 4
    },
    statusPass: {
        color: '#4EAC39',
        fontSize: 18,
        marginBottom: 4
    },
    statusNotPass: {
        color: '#C14C44',
        fontSize: 18,
        marginBottom: 4
    },
    statusAskForRedo: {
        color: '#FF8C1A',
        fontSize: 16,
        marginBottom: 4
    },
    gradeView: {
        padding: 16,
        backgroundColor: 'white',
        marginBottom: 24
    },
    scoreView: {
        marginTop: 8,
        padding: 8,
        borderColor: '#BBB',
        borderWidth: 1,
        borderRadius: 2
    },
    scoreInput: {
        padding: 0,
        fontSize: 16
    },
    remarkView: {
        height: 120,
        marginTop: 12,
        marginBottom: 16,
        padding: 8,
        borderColor: '#BBB',
        borderWidth: 1,
        borderRadius: 2
    },
    remarkInput: {
        flex: 1,
        padding: 0,
        fontSize: 16
    },
    buttonGrade: {
        flexDirection: 'column',
        alignItems: 'center',
        width: 96,
        padding: 6,
        backgroundColor: '#4CAF50',
        borderRadius: 4
    },
    buttonApprove: {
        flexDirection: 'column',
        alignItems: 'center',
        width: 96,
        padding: 6,
        backgroundColor: '#FF8C1A',
        borderRadius: 4
    }
});

module.exports = TaskScreen;