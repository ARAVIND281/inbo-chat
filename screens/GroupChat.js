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
} from 'react-native';
import { Icon, Input, ListItem, Header } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';
import firebase from 'firebase';
import db from '../config';
import { GiftedChat, Bubble, Actions, ActionsProps, } from 'react-native-gifted-chat';
import NavBar, { NavTitle, NavButton } from 'react-native-nav';

export default class GroupChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userid: firebase.auth().currentUser.email,
            firstName: '',
            lastName: '',
            about: '',
            contact: '',
            gName: this.props.navigation.getParam("details")["group_name"],
            gAbout: this.props.navigation.getParam("details")["group_about"],
            gCode: this.props.navigation.getParam("details")["group_code"],
            messages: [],
            item: undefined,
            messages: [],
            image: '#',
            filePath: '',
            fileData: '',
            fileUri: '',
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
        this.messagesRef.limitToLast(10000000).on('child_added', onReceive);
    };

    sendMessage(message) {
        for (let i = 0; i < message.length; i++) {
            this.messagesRef.push({
                text: message,
                //user: message[i].user,
                createdAt: firebase.database.ServerValue.TIMESTAMP,
            });
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ffefff' }}>
                <View style={{ marginTop: RFValue(10) }}>
                    <ListItem
                        title={this.state.gName}
                        subtitle={this.state.gAbout}
                        titleStyle={{ color: 'black', fontWeight: 'bold' }}
                        leftElement={
                            <Icon
                                name="arrow-left"
                                type="feather"
                                //color="#ffffff"
                                onPress={() => this.props.navigation.goBack()}
                            />
                        }
                    />
                </View>
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
                    showUserAvatar={true}
                    showAvatarForEveryMessage={true}
                />
            </View>
        );
    }
    componentDidMount() {
        this.loadMessages(this.state.gCode, (message) => {
            this.setState((previousState) => {
                return {
                    messages: GiftedChat.append(previousState.messages, message),
                };
            });
        });
        this.getUserDetails();
    }
}