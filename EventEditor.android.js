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
            fetch(Constants.URL_ADD_EVENT, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: this.state.content
                }),
                credentials: 'same-origin'
            }).then(function (response) {
                return response.json()
            }).then(function (json) {
                if (json.error == 0) {
                    self.props.navigator.pop();
                } else {
                    ToastAndroid.show(json.message, ToastAndroid.SHORT);
                }
            }).catch(function (e) {
                ToastAndroid.show(e.message, ToastAndroid.SHORT);
            });
        }
    },
    render() {
        if (!this.state.content) {
            var toolbar = (
                <ToolbarAndroid
                    navIcon={require('image!ic_back_white')}
                    title='发布微博'
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
                    title='发布微博'
                    titleColor="white"
                    style={styles.toolbar}
                    onIconClicked={() => this.props.navigator.pop()}
                    actions={toolbarActions}
                    onActionSelected={this.onActionSelected}/>
            );
        }
        return (
            <View style={styles.container}>
                {toolbar}
                <ScrollView style={styles.editor}>
                    <View style={styles.contentView}>
                        <TextInput
                            placeholder="请输入微博内容"
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
