import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    PermissionsAndroid,
    TouchableOpacity,
    Modal,
    ScrollView,
    Alert,
    FlatList,
} from 'react-native';
import Contacts from 'react-native-contacts';
import MyHeader from '../components/MyHeader.js';
import { Icon, Input, ListItem } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';
import firebase from 'firebase'
import db from '../config';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

export default class ChatScreen extends Component {
    uid = '';
    messagesRef = null;
    constructor(props) {
        super(props);
        this.state = {
            userid: firebase.auth().currentUser.email,
            firstName: '',
            lastName: '',
            about: '',
            contact: '',
            fEmail: this.props.navigation.getParam("details")["email_id"],
            fName: this.props.navigation.getParam("details")["name"],
            fabout: this.props.navigation.getParam("details")["about"],
            fContact: this.props.navigation.getParam("details")["contact"],
            fid: this.props.navigation.getParam("details")["friendid"],
            docId: '',
            chats: [],
            messages: [],
        }
    }

    uid = '';
    messagesRef = null;

    getUserDetails = () => {
        db.collection("users")
            .where("email_id", "==", this.state.userid)
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    var data = doc.data();
                    this.setState({
                        firstName: data.first_name,
                        lastName: data.last_name,
                        about: data.about,
                        contact: data.contact,
                        docId: doc.id,
                        text: '',
                    });
                });
            });
    };

    setUid(value) {
        this.uid = value;
    }
    getUid() {
        return this.uid;
    }

    

    // retrieve the messages from the Backend
    loadMessages = (where, callback) => {
        this.messagesRef = firebase.database().ref(where);
        this.messagesRef.off();
        const onReceive = (data) => {
            const message = data.val();
            callback({
                _id: data.key,
                text: message.text,
                createdAt: new Date(message.createdAt),
                user: {
                    _id: message.user._id,
                    name: message.user.name,
                },
            });
        };
        this.messagesRef.limitToLast(20).on('child_added', onReceive);
    };
    // send the message to the Backend
    sendMessage(message) {
        for (let i = 0; i < message.length; i++) {
            this.messagesRef.push({
                text: message[i].text,
                user: message[i].user,
                createdAt: firebase.database.ServerValue.TIMESTAMP,
            });
        }
    }

    renderName = props => {
        const { user: self } = this.props; // where your user data is stored;
        const { user = {} } = props.currentMessage;
        const { user: pUser = {} } = props.previousMessage;
        const isSameUser = pUser._id === user._id;
        const isSelf = user._id === self._Id;
        const shouldNotRenderName = isSameUser;
        let firstName = user.name.split(" ")[0];
        let lastName = user.name.split(" ")[1][0];
        return shouldNotRenderName ? (
            <View />
        ) : (
                <View>
                    <Text style={{ color: "grey", padding: 2, alignSelf: "center" }}>
                        {`${firstName} ${lastName}.`}
                    </Text>
                </View>
            );
    };

    renderBubble = props => {
        return (
            <View>
                {this.renderName(props)}
                {this.renderAudio(props)}
                <Bubble {...props} />
            </View>
        );
    };

    render() {
        return (
            <GiftedChat
                messages={this.state.messages}
                onSend={(message) => {
                    this.sendMessage(message);
                }}
                user={{
                    _id: this.state.userid,
                    name: this.state.firstName + '' + this.state.lastName,
                }}
                scrollToBottom
                alwaysShowSend
                renderBubble={this.renderBubble}

            />
        );
    }
    componentDidMount() {
        this.loadMessages(this.state.fid, (message) => {
            this.setState((previousState) => {
                return {
                    messages: GiftedChat.append(previousState.messages, message),
                };
            });
        });
        this.getUserDetails();
    }
}