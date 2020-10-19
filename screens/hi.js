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
        }
        firebase.initializeApp({
            apiKey: 'AIzaSyD-KuBOHXtlE5HqotA-nJHtDL3Z3BOidjk',
            authDomain: 'inbo-chat-a81c7.firebaseapp.com',
            databaseURL: 'https://inbo-chat-a81c7.firebaseio.com',
            storageBucket: 'inbo-chat-a81c7.appspot.com',
        });
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setUid(user.uid);
            } else {
                firebase
                    .auth()
                    .signInAnonymously()
                    .catch((error) => {
                        alert(error.message);
                    });
            }
        });
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

    componentDidMount() {
        this.getUserDetails();
        this.getChat();
    }

    render() {
        return (
            <View style={{ marginTop: 50 }}>


                <View>
                    <FlatList
                        keyExtractor={this.keyExtractor}
                        data={this.state.chats}
                        renderItem={this.renderItem}
                    />
                </View>
                <View>
                    <Input
                        onChangeText={(text) => {
                            this.setState({
                                text: text,
                            });
                        }}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            this.sendText(this.state.text),
                                this.setState({
                                    text: ''
                                })
                        }}>
                        <Text>
                            send
                            </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

/*
<Text>{this.state.userid}</Text>
                <Text>{this.state.firstName}</Text>
                <Text>{this.state.lastName}</Text>
                <Text>{this.state.about}</Text>
                <Text>{this.state.contact}</Text>
                <Text>{this.state.fEmail}</Text>
                <Text>{this.state.fName}</Text>
                <Text>{this.state.fabout}</Text>
                <Text>{this.state.fContact}</Text>
                */
/*
react-native-gifted-chat
import {GifterChat} from react-native-gifted-chat
import {GiftedChat} from react-native-gifted-chat*/