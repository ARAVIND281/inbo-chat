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
import { Icon, Input, ListItem, Avatar } from 'react-native-elements';
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
            image: '#',
            filePath: '',
            fileData: '',
            fileUri: '',
            iseditfriendModalVisible: false
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

    editfriendModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.iseditfriendModalVisible}
            >
                <ScrollView style={styles.scrollview}>
                    <View style={styles.signupView}>
                        <Text style={styles.signupText}>Frind Details</Text>
                    </View>
                    <View
                        style={{
                            flex: 0.3,
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 20
                        }}
                    >
                        <Avatar
                            rounded
                            source={{
                                uri: this.state.image,
                            }}
                            size={RFValue(200)}
                            onPress={() => this.selectPicture()}
                            showEditButton
                        />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity
                            style={styles.registerButton}
                            onPress={() => {
                                this.setState({
                                    iseditfriendModalVisible: false
                                })

                            }}
                        >
                            <Text style={styles.registerButtonText}>DONE</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Modal>
        );
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ffefff' }}>
                {this.editfriendModal()}
                <View style={{ marginTop: RFValue(10) }}>
                    <ListItem
                        title={this.state.fName}
                        subtitle={this.state.fContact}
                        titleStyle={{ color: 'black', fontWeight: 'bold' }}
                        leftElement={
                            <Icon
                                name="arrow-left"
                                type="feather"
                                //color="#ffffff"
                                onPress={() => this.props.navigation.goBack()}
                            />
                        }
                        rightElement={
                            <Icon
                                name="edit"
                                type="feather"
                                //color="#ffffff"
                                onPress={() => {
                                    this.setState({
                                        iseditfriendModalVisible: true
                                    })
                                }}
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

const styles = StyleSheet.create({
    add1: {
        width: RFValue(65),
        height: RFValue(65),
        marginTop: RFValue(20),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: RFValue(100),
        backgroundColor: "#a901ff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 16,
        marginTop: RFValue(10),
    },
    scrollview: {
        flex: 1,
        backgroundColor: "#fff"
    },
    signupView: {
        flex: 0.05,
        justifyContent: 'center',
        alignItems: 'center'
    },
    signupText: {
        fontSize: RFValue(20),
        fontWeight: "bold",
        color: "#32867d"
    },
    label: {
        fontSize: RFValue(17),
        color: "#717D7E",
        fontWeight: 'bold',
        paddingLeft: RFValue(10),
        marginLeft: RFValue(20)
    },
    registerButton: {
        width: "75%",
        height: RFValue(50),
        marginTop: RFValue(20),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: RFValue(3),
        backgroundColor: "#32867d",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 16,
        marginTop: RFValue(10),
    },
    registerButtonText: {
        fontSize: RFValue(23),
        fontWeight: "bold",
        color: "#fff",
    },
    cancelButtonText: {
        fontSize: RFValue(20),
        fontWeight: 'bold',
        color: "#32867d",
        marginTop: RFValue(10)
    },
})