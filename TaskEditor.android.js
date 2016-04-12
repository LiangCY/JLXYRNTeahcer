'use strict';

var React = require('react-native');

var {
    StyleSheet,
    Text,
    View,
    ScrollView,
    ToolbarAndroid,
    TextInput,
    ToastAndroid,
    TouchableNativeFeedback,
    DatePickerAndroid,
} = React;

var Constants = require('./Constants');

var TaskEditor = React.createClass({
    getInitialState() {
        return {
            title: '',
            content: '',
            deadline: '',
            isAdding: false
        };
    },
    onActionSelected: function (position) {
        if (position == 0) {
            if (this.state.isAdding) {
                return;
            }
            this.setState({
                isAdding: true
            });
            var self = this;
            fetch(Constants.URL_TASK_ADD, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    lesson: this.props.lesson._id,
                    title: this.state.title,
                    description: this.state.content,
                    deadline: this.state.deadline
                }),
                credentials: 'same-origin'
            }).then(function (response) {
                return response.json()
            }).then(function (json) {
                self.setState({
                    isAdding: false
                });
                if (json.error == 0) {
                    ToastAndroid.show('作业已添加', ToastAndroid.SHORT);
                    self.props.navigator.pop();
                } else {
                    ToastAndroid.show(json.message, ToastAndroid.SHORT);
                }
            }).catch(function (e) {
                self.setState({
                    isAdding: false
                });
                ToastAndroid.show(e.message, ToastAndroid.SHORT);
            });

        }
    },
    async showPicker() {
        try {
            let deadline = this.state.deadline;
            if (deadline) {
                var arr = deadline.split('-');
                var defaultDate = new Date(arr[0], arr[1] - 1, arr[2]);
            } else {
                defaultDate = new Date();
            }
            const {action, year, month, day} = await DatePickerAndroid.open({
                date: defaultDate,
                minDate: new Date()
            });
            if (action === DatePickerAndroid.dateSetAction) {
                this.setState({
                    deadline: year + '-' + (month + 1) + '-' + day
                });
            }
        } catch (e) {
            ToastAndroid.show(e.message, ToastAndroid.SHORT);
        }
    },
    render() {
        if (!this.state.title) {
            var toolbar = (
                <ToolbarAndroid
                    navIcon={require('image!ic_back_white')}
                    title='添加作业'
                    titleColor="white"
                    style={styles.toolbar}
                    onIconClicked={() => this.props.navigator.pop()}/>
            );
        } else {
            var toolbarActions = [
                {title: '添加', icon: require('image!ic_send_white'), show: 'always'}
            ];
            toolbar = (
                <ToolbarAndroid
                    navIcon={require('image!ic_back_white')}
                    title='添加作业'
                    titleColor="white"
                    style={styles.toolbar}
                    onIconClicked={() => this.props.navigator.pop()}
                    actions={toolbarActions}
                    onActionSelected={this.onActionSelected}/>
            );
        }
        var lesson = this.props.lesson;
        return (
            <View style={styles.container}>
                {toolbar}
                <ScrollView style={styles.editor}>
                    <Text style={styles.label}>课程</Text>
                    <View style={styles.lessonView}>
                        <Text style={styles.lessonInfo}>
                            {lesson.name}
                        </Text>
                    </View>
                    <Text style={styles.label}>作业标题</Text>
                    <View style={styles.titleView}>
                        <TextInput
                            placeholder="请输入作业标题"
                            style={styles.titleInput}
                            underlineColorAndroid="transparent"
                            onChangeText={(text) => this.setState({title:text})}
                            value={this.state.title}/>
                    </View>
                    <Text style={styles.label}>具体要求</Text>
                    <View style={styles.contentView}>
                        <TextInput
                            placeholder="请输入作业具体要求"
                            style={styles.contentInput}
                            multiline={true}
                            textAlign='start'
                            textAlignVertical='top'
                            underlineColorAndroid="transparent"
                            onChangeText={(text) => this.setState({content:text})}
                            value={this.state.content}/>
                    </View>
                    <Text style={styles.label}>截止时间</Text>
                    <TouchableNativeFeedback
                        onPress={this.showPicker}>
                        <View style={styles.dateButton}>
                            <Text>{this.state.deadline || '点击选择日期'}</Text>
                        </View>
                    </TouchableNativeFeedback>
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
    editor: {
        flex: 1,
        padding: 12
    },
    label: {
        marginTop: 16,
        color: '#388E3C',
        fontSize: 16
    },
    lessonView: {
        marginTop: 8,
        padding: 12,
        borderColor: '#CCC',
        borderWidth: 1,
        backgroundColor: '#EEE'
    },
    lessonInfo: {
        fontSize: 16,
        color: 'black'
    },
    titleView: {
        marginTop: 8,
        padding: 12,
        borderColor: '#CCC',
        borderWidth: 1,
        backgroundColor: 'white'
    },
    titleInput: {
        padding: 0,
        fontSize: 16
    },
    contentView: {
        height: 240,
        marginTop: 8,
        padding: 12,
        borderColor: '#CCC',
        borderWidth: 1,
        backgroundColor: 'white'
    },
    contentInput: {
        flex: 1,
        padding: 0,
        fontSize: 16
    },
    dateButton: {
        padding: 12,
        marginTop: 8,
        borderColor: '#CCC',
        borderWidth: 1,
        backgroundColor: 'white'
    }
});

module.exports = TaskEditor;
