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
import { GiftedChat } from 'react-native-gifted-chat';

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




    getChat = () => {
        db.collection(this.state.fid)
            .orderBy('createdAt', 'desc')
            .onSnapshot((snapshot) => {
                var chats = snapshot.docs.map((doc) => doc.data())
                this.setState({
                    chats: chats
                });
            })
    }

    sendText = async (massage) => {
        await db.collection(this.state.fid).add({
            massage: massage,
            sender: this.state.userid,
            reciever: this.state.fEmail,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
    }

    renderItem = ({ item, i }) => {
        return (
            <ListItem
                key={i}
                title={item.massage}
                bottomDivider
            />
        )
    }

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

    keyExtractor = (index) => index.toString()

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

    componentDidMount() {
        this.getUserDetails();
        //this.getChat();
        this.loadMessages(this.state.fid, (message) => {
            this.setState((previousState) => {
                return {
                    messages: GiftedChat.append(previousState.messages, message),
                };
            });
        });

    }

    render() {
        return (
            <View>


                <View style={{marginBottom:100}}>
                    <GiftedChat
                        messages={this.state.messages}
                        onSend={(message) => {
                            this.sendMessage(message);
                        }}
                        user={{
                            _id: this.state.userid,
                            name: this.state.firstName+''+this.state.lastName,
                        }}
                    />
                </View>
            </View>
        );
    }
}

