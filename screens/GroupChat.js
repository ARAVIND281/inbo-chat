import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    Alert,
    FlatList,
    ImageBackground
} from 'react-native';
import { Icon, ListItem, Header, Avatar } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';
import firebase from 'firebase';
import db from '../config';
import { GiftedChat, Actions, Day } from 'react-native-gifted-chat';
import * as ImagePicker from "expo-image-picker";

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
            members: [],
            isAboutGroupModalVisible: false,
            userImage: '#',
            total: '',
            docid: '',
            usergroupstate: ''
        }
    }

    uid = '';
    messagesRef = null;

    getGroupMember = () => {
        this.memberRef = db.collection(this.state.gCode + "groupmember")
            .orderBy('Memberstate', 'asc')
            .onSnapshot((snapshot) => {
                var members = snapshot.docs.map((doc) => doc.data())
                this.setState({
                    members: members,
                    total: snapshot.docs.length,
                });
            })
    }

    selectPicture = async () => {
        const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!cancelled) {
            this.uploadImage(uri, this.state.gCode);
        }
    }

    uploadImage = async (uri, imageName) => {
        var response = await fetch(uri);
        var blob = await response.blob();

        var ref = firebase
            .storage()
            .ref()
            .child("group_profiles/" + imageName);

        return ref.put(blob).then((response) => {
            this.fetchImage(imageName);
        });
    };

    exitGroup = async () => {
        await db.collection(this.state.gCode + 'groupmember').doc(this.state.userid).delete();
        await db.collection(this.state.userid + 'group').doc(this.state.gCode).delete();
        this.props.navigation.goBack()
    }

    getusergroupstate = () => {
        db.collection(this.state.gCode + 'groupmember')
            .where("userid", "==", this.state.userid)
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    var data = doc.data();
                    this.setState({
                        usergroupstate: data.Memberstate,
                    });
                });
            });
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

    setUid(value) {
        this.uid = value;
    }
    getUid() {
        return this.uid;
    }

    fetchImage2 = (imageName) => {
        var storageRef = firebase
            .storage()
            .ref()
            .child("user_profiles/" + imageName);

        storageRef
            .getDownloadURL()
            .then((url) => {
                this.setState({ userImage: url });
            })
            .catch((error) => {
                this.setState({ userImage: "https://firebasestorage.googleapis.com/v0/b/inbo-chat-a81c7.appspot.com/o/user_profiles%2F0c3b3adb1a7530892e55ef36d3be6cb8.png?alt=media&token=7818f4b2-e6cf-4342-8666-424c4636a430" });
            });
    };

    fetchImage = (imageName) => {
        var storageRef = firebase
            .storage()
            .ref()
            .child("group_profiles/" + imageName);

        storageRef
            .getDownloadURL()
            .then((url) => {
                this.setState({ image: url });
            })
            .catch((error) => {
                this.setState({ image: "https://firebasestorage.googleapis.com/v0/b/inbo-chat-a81c7.appspot.com/o/user_profiles%2F0c3b3adb1a7530892e55ef36d3be6cb8.png?alt=media&token=7818f4b2-e6cf-4342-8666-424c4636a430" });
            });
    };

    renderActions() {
        return (
            <Actions
                options={{
                    ['Send Image']: () => {
                        alert('Dear INBO user Sorry for inconvenience INBO Team working on sending image and video soon you can send image and video')
                    },
                }}
                icon={() => (
                    <Icon name={'attachment'} size={28} color={'red'} />
                )}
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
                    avatar: message.user.avatar
                },
            });
        };
        this.messagesRef.limitToLast(90000000).on('child_added', onReceive);
    };

    updateUserfState = () => {
        db.collection(this.state.members.userid + 'group')
            .doc(this.state.gCode)
            .update({
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                state: 'unread'
            });
    }

    sendMessage(message) {
        for (let i = 0; i < message.length; i++) {
            this.messagesRef.push({
                text: message[i].text,
                user: message[i].user,
                createdAt: firebase.database.ServerValue.TIMESTAMP,
            });
        }
        this.updateUserfState()
    }

    keyExtractor = (index) => index.toString();

    renderItem = ({ item, i }) => {
        return (
            <ListItem
                key={i}
                title={item.name}
                subtitle={item.contact}
                containerStyle={{ backgroundColor: '#FFFEE0' }}
                bottomDivider
                rightElement={
                    <Text
                        style={{
                            color: '#32867d',
                            fontWeight: 'bold'
                        }}
                    >{item.Memberstate.toUpperCase().trim()}</Text>
                }
            />
        )
    }

    aboutGroupModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.isAboutGroupModalVisible}
            >
                <ScrollView style={[styles.scrollview, { backgroundColor: '#FFFEE0' }]}>
                    <View style={styles.signupView}>
                        <Text style={styles.signupText}>GROUP INFO</Text>
                    </View>
                    <View
                        style={{
                            flex: 0.3,
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 20
                        }}
                    >{this.state.usergroupstate === 'admin' ? (
                        <View>
                            <Avatar
                                rounded
                                source={{
                                    uri: this.state.image,
                                }}
                                size={RFValue(200)}
                                onPress={() => this.selectPicture()}
                                showEditButton
                            />


                            <View style={{ marginTop: -30, alignItems: 'flex-end', marginLeft: RFValue(133) }}>
                                <Icon name='camera-retro' type='font-awesome-5' color="#fabf10" solid={true} />
                            </View>
                        </View>
                    ) : (
                            <Avatar
                                rounded
                                source={{
                                    uri: this.state.image,
                                }}
                                size={RFValue(200)}
                            />
                        )

                        }

                    </View>
                    <Text
                        style={{
                            fontWeight: "bold",
                            fontSize: RFValue(20),
                            padding: RFValue(10),
                            textAlign: 'center'
                        }}
                    >
                        {this.state.gName}
                    </Text>
                    <View>
                        <ListItem
                            title={this.state.gAbout}
                            subtitle='About'
                            titleStyle={{ color: 'black', fontWeight: 'bold' }}
                            containerStyle={{ backgroundColor: '#FFFEE0' }}
                        />
                    </View>
                    <Text
                        style={{
                            fontWeight: "300",
                            fontSize: RFValue(15),
                            padding: RFValue(10),
                            textAlign: 'left',
                            color: '#32867d',
                            fontWeight: 'bold'
                        }}
                    >
                        {this.state.total} Members are in Group
                    </Text>
                    <FlatList
                        keyExtractor={this.keyExtractor}
                        data={this.state.members}
                        renderItem={this.renderItem}
                    />
                    <Text
                        style={{
                            fontWeight: 'bold',
                            fontSize: RFValue(15),
                            padding: RFValue(10),
                            textAlign: 'left'
                        }}
                    >
                        Group Code
                    </Text>
                    <Text
                        style={{
                            fontWeight: 'bold',
                            fontSize: RFValue(15),
                            padding: RFValue(15),
                            textAlign: 'left',
                            marginTop: RFValue(-15),
                        }}
                    >
                        {this.state.gCode}
                    </Text>
                    <Text
                        style={{
                            fontWeight: '300',
                            fontSize: RFValue(15),
                            padding: RFValue(25),
                            textAlign: 'left',
                            marginTop: RFValue(-25),
                        }}
                    >
                        Add your Friends to the group by typing this code
                    </Text>
                    <Text
                        style={{
                            fontWeight: 'bold',
                            fontSize: RFValue(15),
                            padding: RFValue(10),
                            textAlign: 'left',
                            marginTop: RFValue(-10),
                        }}
                    >
                        Encryption
                    </Text>
                    <Text
                        style={{
                            fontWeight: '300',
                            fontSize: RFValue(15),
                            padding: RFValue(18),
                            textAlign: 'left'
                        }}
                    >
                        Messages are end-to-end encrypted.No one else other than in the group can't see this messages
                    </Text>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity
                            style={{
                                height: RFValue(100),
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: RFValue(5),
                            }}
                            onPress={() => {
                                {
                                    this.state.usergroupstate === 'admin' ? (
                                        Alert.alert("Your are grour Admin so you can't exit the group")
                                    ) : (
                                            this.exitGroup()
                                        )

                                }
                            }}
                        >
                            <Header
                                centerComponent={{ text: 'EXIT GROUP', style: { color: 'red', fontSize: 20, fontWeight: "bold" } }}
                                leftComponent={<Icon name='door-open' type='font-awesome-5' color='red' solid={true} style={{ marginLeft: RFValue(40) }} />}
                                backgroundColor="#FFFEE0"
                            />

                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity
                            style={styles.registerButton}
                            onPress={() => {
                                this.setState({
                                    isAboutGroupModalVisible: false
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
                <ImageBackground source={require('../assets/bg.png')} style={styles.image}>

                    {this.aboutGroupModal()}
                    <View style={{ marginTop: RFValue(10) }}>
                        <ListItem
                            title={this.state.gName}
                            subtitle={this.state.gAbout}
                            titleStyle={{ color: 'black', fontWeight: 'bold' }}
                            leftElement={
                                <View>
                                    <View style={{ marginLeft: RFValue(25), marginTop: RFValue(10) }}>
                                        <Avatar
                                            rounded
                                            source={{
                                                uri: this.state.image,
                                            }}
                                            size={RFValue(50)}
                                            onPress={() => this.props.navigation.goBack()}
                                        />
                                    </View>
                                    <View style={{ marginLeft: RFValue(-60), marginTop: RFValue(10) }}>
                                        <Icon
                                            name="arrow-left"
                                            type="font-awesome-5"
                                            //color="#ffffff"
                                            onPress={() => this.props.navigation.goBack()}
                                            containerStyle={{ position: 'absolute', top: RFValue(-45), right: RFValue(60) }}
                                        />
                                    </View>
                                </View>
                            }
                            rightElement={
                                <Icon
                                    name="info-circle"
                                    type="font-awesome-5"
                                    size={RFValue(40)}
                                    onPress={() => {
                                        this.setState({
                                            isAboutGroupModalVisible: true
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
                            avatar: this.state.userImage
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
                        showAvatarForEveryMessage={true}
                        renderDay={this.renderDay}
                    />
                </ImageBackground>
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
        this.getGroupMember();
        this.fetchImage(this.state.gCode);
        this.fetchImage2(this.state.userid);
        this.getusergroupstate();
    }
    renderDay(props) {
        return <Day {...props} textStyle={{ color: '#000', fontWeight: 'bold', fontSize: RFValue(14) }} />
    }
}
const styles = StyleSheet.create({
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
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
        shadowOpacity: 0.3,

    },
})