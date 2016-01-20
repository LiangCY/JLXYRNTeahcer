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
    } = React;

var Constants = require('./Constants');

var MessageEditor = React.createClass({
    getInitialState() {
        return {
            title: '',
            content: '',
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
            fetch(Constants.URL_MESSAGE_ADD, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    toId: this.props.student._id,
                    toName: this.props.student.name,
                    title: this.state.title,
                    content: this.state.content
                }),
                credentials: 'same-origin'
            }).then(function (response) {
                return response.json()
            }).then(function (json) {
                self.setState({
                    isAdding: false
                });
                if (json.error == 0) {
                    ToastAndroid.show('私信已发送', ToastAndroid.SHORT);
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
    render() {
        if (!this.state.title) {
            var toolbar = (
                <ToolbarAndroid
                    navIcon={require('image!ic_back_white')}
                    title='添加私信'
                    titleColor="white"
                    style={styles.toolbar}
                    onIconClicked={() => this.props.navigator.pop()}/>
            );
        } else {
            var toolbarActions = [
                {title: '发送', icon: require('image!ic_send_white'), show: 'always'}
            ];
            toolbar = (
                <ToolbarAndroid
                    navIcon={require('image!ic_back_white')}
                    title='添加私信'
                    titleColor="white"
                    style={styles.toolbar}
                    onIconClicked={() => this.props.navigator.pop()}
                    actions={toolbarActions}
                    onActionSelected={this.onActionSelected}/>
            );
        }
        var student = this.props.student;
        return (
            <View style={styles.container}>
                {toolbar}
                <ScrollView style={styles.editor}>
                    <Text style={styles.label}>收信人</Text>
                    <View style={styles.userView}>
                        <Text style={styles.userInfo}>
                            {student.name + ' (' + student._id + ')'}
                        </Text>
                    </View>
                    <Text style={styles.label}>标题</Text>
                    <View style={styles.titleView}>
                        <TextInput
                            placeholder="请输入私信标题"
                            style={styles.titleInput}
                            underlineColorAndroid="transparent"
                            onChangeText={(text) => this.setState({title:text})}
                            value={this.state.title}/>
                    </View>
                    <Text style={styles.label}>内容</Text>
                    <View style={styles.contentView}>
                        <TextInput
                            placeholder="请输入私信内容"
                            style={styles.contentInput}
                            multiline={true}
                            textAlign='start'
                            textAlignVertical='top'
                            underlineColorAndroid="transparent"
                            onChangeText={(text) => this.setState({content:text})}
                            value={this.state.content}/>
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
    editor: {
        flex: 1,
        padding: 12
    },
    label: {
        marginTop: 16,
        color: '#388E3C',
        fontSize: 16
    },
    userView: {
        marginTop: 8,
        padding: 12,
        borderColor: '#CCC',
        borderWidth: 1,
        backgroundColor: '#EEE'
    },
    userInfo: {
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
        marginBottom: 16,
        padding: 12,
        borderColor: '#CCC',
        borderWidth: 1,
        backgroundColor: 'white'
    },
    contentInput: {
        flex: 1,
        padding: 0,
        fontSize: 16
    }
});

module.exports = MessageEditor;
