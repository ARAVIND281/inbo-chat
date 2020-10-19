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
    SafeAreaView,
    Button
} from 'react-native';
import Contacts from 'react-native-contacts';
import MyHeader from '../components/MyHeader.js';
import { Icon, Input, ListItem } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';
import firebase from 'firebase'
import db from '../config';
import { GiftedChat, Bubble, Actions, ActionsProps, } from 'react-native-gifted-chat';
import NavBar, { NavTitle, NavButton } from 'react-native-nav';
import * as ImagePicker from "expo-image-picker";

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
            item: undefined,
            image: '',
            filePath: '',
            fileData: '',
            fileUri: ''
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

     handlePickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
        }

    }

    renderActions() {
        return (
            <Actions
                options={{
                    ['Send Image']: this.handlePickImage,
                }}
                icon={() => (
                    <Icon name={'attachment'} size={28} color={'red'} />
                )}
                onSend={args => console.log(args)}
            />
        )
    }



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

    sendMessage(message) {
        for (let i = 0; i < message.length; i++) {
            this.messagesRef.push({
                text: message[i].text,
                user: message[i].user,
                createdAt: firebase.database.ServerValue.TIMESTAMP,
            });
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ffefff' }}>

                <SafeAreaView style={{ backgroundColor: '#f5f5f5' }}>
                    <NavBar>
                        <NavButton />
                        <NavTitle>
                            INBO CHAT{'\n'}
                            <Text style={{ fontSize: 10, color: '#aaa' }}>
                                hi
          </Text>
                        </NavTitle>
                        <NavButton />
                    </NavBar>
                </SafeAreaView>

                <GiftedChat
                    messages={this.state.messages}
                    onSend={(message) => {
                        this.sendMessage(message);
                    }}
                    user={{
                        _id: this.state.userid,
                        name: this.state.firstName + '' + this.state.lastName,
                        avatar: this.state.image
                    }}
                    scrollToBottom
                    alwaysShowSend={true}
                    renderUsernameOnMessage={true}
                    scrollToBottomComponent={() => (
                        <Icon name='arrow-down' type='font-awesome-5' />
                    )}
                    isTyping={true}
                    isLoadingEarlier={true}
                    timeTextStyle={{ left: { color: 'green' }, right: { color: 'yellow' } }}
                    isTyping={true}
                    infiniteScroll
                    renderActions={this.renderActions}

                />
            </View>
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
