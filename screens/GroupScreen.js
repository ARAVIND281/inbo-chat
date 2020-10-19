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
import db from '../config'

export default class GroupScreen extends Component {

    constructor() {
        super();
        this.state = {
            counter: 0,
            image: '../assets/into-2.png',
            userid: firebase.auth().currentUser.email,
            fContact: '',
            fName: '',
            isFriendModalVisible: false,
            fEmail: '',
            fabout: '',
            docId: '',
            name: '',
            about: '',
            contact: '',
            isGroupModal: false,
            gCode: '',
            gName: '',
            gAbout: '',
            jgName: '',
            jgAbout: '',
            jgCode: '',
            gdocId: '',
            groups: []
        };
    }

    createUniqueId() {
        return Math.random().toString(36).substring(7);
    }

    addGrope = async (gName, gAbout) => {
        var id = this.createUniqueId()
        await db.collection(gName + 'groupabout').add({
            name: gName,
            about: gAbout,
            created_by: this.state.userid,
            grope_code: id
        })
        this.addGropeMember(gName)
        this.addUserGroup(gName, gAbout)
        this.addinGroup(gName, gAbout, id)
    }

    addinGroup = async (gName, gAbout, id) => {
        await db.collection('groups').add({
            name: gName,
            about: gAbout,
            created_by: this.state.userid,
            grope_code: id
        })
    }

    addGropeMember = async (gName) => {
        await db.collection(gName + 'groupmember').add({
            name: this.state.name,
            contact: this.state.contact,
            about: this.state.about,
            userid: this.state.userid
        })
    }

    addUserGroup = async (gName, gAbout) => {
        await db.collection(this.state.userid + "group").add({
            group_name: gName,
            group_about: gAbout
        })
    }

    joinGroup = async (jgCode) => {
        await db.collection('groups')
            .where("grope_code", "==", jgCode)
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    var data = doc.data();
                    this.setState({
                        jgName: data.name,
                        jgAbout: data.about,
                        gdocId: doc.id,
                    });
                    this.addinUserGroup(this.state.jgName, this.state.jgAbout)
                    this.addinGroupMember(this.state.jgName)
                    Alert.alert('joined Group Successfully')
                });
            });
    }

    addinUserGroup = async (jgName, jgAbout) => {
        await db.collection(this.state.userid + "group").add({
            group_name: jgName,
            group_about: jgAbout
        })
    }

    addinGroupMember = async (jgName) => {
        await db.collection(jgName + 'groupmember').add({
            name: this.state.name,
            contact: this.state.contact,
            about: this.state.about,
            userid: this.state.userid
        })
    }

    getFriendDetails = async (fContact) => {
        await db.collection("users")
            .where("contact", "==", fContact)
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    var data = doc.data();
                    this.setState({
                        fEmail: data.email_id,
                        fabout: data.about,
                        docId: doc.id,
                    });
                    this.addFriend(this.state.fEmail, this.state.fabout)
                    this.addFriendslist()
                });
            });
    }

    addFriend = async (email_id, about) => {
        await db.collection(this.state.userid + 'friend').add({
            name: this.state.fName,
            contact: this.state.fContact,
            email_id: email_id,
            about: about,
            friendid: this.createUniqueId()
        })
    }

    getUserDetails = () => {
        db.collection("users")
            .where("email_id", "==", this.state.userid)
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    var data = doc.data();
                    this.setState({
                        name: data.first_name,
                        about: data.about,
                        contact: data.contact,
                        docId: doc.id,
                    });
                });
            });
    };

    addFriendslist = async () => {
        await db.collection(this.state.fEmail + 'friend').add({
            name: this.state.fContact,
            contact: this.state.fContact,
            email_id: this.state.userid,
            about: this.state.about,
            friendid: this.createUniqueId()
        })
        Alert.alert('Friend Added Successfully')
    }

    getGroups = () => {
        this.groupsRef = db.collection(this.state.userid + "group")
            .onSnapshot((snapshot) => {
                var groups = snapshot.docs.map((doc) => doc.data())
                this.setState({
                    groups: groups
                });
            })
    }

    componentDidMount() {
        this.getUserDetails();
        this.getGroups();
    }

    friendModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.isFriendModalVisible}
            >
                <ScrollView style={styles.scrollview}>
                    <View style={styles.signupView}>
                        <Text style={styles.signupText}> ADD FRIEND </Text>
                    </View>
                    <View style={{ flex: 0.95 }}>
                        <Text style={styles.label}>Friend's Name</Text>
                        <Input
                            style={styles.loginBox}
                            value={this.state.fName}
                            placeholder={"Name"}
                            onChangeText={(text) => {
                                this.setState({
                                    fName: text,
                                });
                            }}
                            leftIcon={
                                <Icon
                                    name='id-badge'
                                    size={RFValue(35)}
                                    color='#fabf10'
                                    type="font-awesome-5"
                                />
                            }
                        />

                        <Text style={styles.label}>Friend's Contact No</Text>

                        {this.state.fContact.length !== 10 ? (
                            <Input
                                style={styles.loginBox}
                                placeholder={"Contact"}
                                maxLength={10}
                                keyboardType={"numeric"}
                                onChangeText={(text) => {
                                    this.setState({
                                        fContact: text,
                                    });
                                }}
                                leftIcon={
                                    <Icon
                                        name='phone'
                                        size={RFValue(35)}
                                        color='#fabf10'
                                        type="font-awesome-5"
                                    />
                                }
                                errorMessage='Enter a Valid Phone Number'
                            />
                        ) : (
                                <Input
                                    style={styles.loginBox}
                                    placeholder={"Contact"}
                                    maxLength={10}
                                    keyboardType={"numeric"}
                                    onChangeText={(text) => {
                                        this.setState({
                                            fContact: text,
                                        });
                                    }}
                                    leftIcon={
                                        <Icon
                                            name='phone'
                                            size={RFValue(35)}
                                            color='#fabf10'
                                            type="font-awesome-5"
                                        />
                                    }
                                />
                            )
                        }

                    </View>

                    <View style={{ flex: 0.2, alignItems: 'center' }}>
                        <TouchableOpacity
                            style={styles.registerButton}
                            onPress={() => {
                                this.state.fContact.length !== 10 ? (
                                    Alert.alert('Enter a Valid Phone Number')
                                ) : (
                                        this.getFriendDetails(this.state.fContact),
                                        this.setState({
                                            isFriendModalVisible: false
                                        })
                                    )
                            }

                            }
                        >
                            <Text style={styles.registerButtonText}>ADD FRIEND</Text>
                        </TouchableOpacity>
                        <Text
                            style={styles.cancelButtonText}
                            onPress={() => {
                                this.setState({ isFriendModalVisible: false });

                            }}
                        >
                            Cancel</Text>
                    </View>
                </ScrollView>
            </Modal >
        );
    }

    groupModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.isGroupModal}
            >
                <ScrollView style={styles.scrollview}>
                    <View style={styles.signupView}>
                        <Text style={styles.signupText}> JOIN GROUP </Text>
                    </View>
                    <View style={{ flex: 0.95 }}>
                        <Text style={styles.label}>Group Code</Text>
                        {this.state.jgCode.length !== 6 ? (
                            <Input
                                style={styles.loginBox}
                                maxLength={6}
                                onChangeText={(text) => {
                                    this.setState({
                                        jgCode: text,
                                    });
                                }}
                                leftIcon={
                                    <Icon
                                        name='code-commit'
                                        size={RFValue(35)}
                                        color='#fabf10'
                                        type="font-awesome-5"
                                    />
                                }
                                errorMessage='Enter a Valid Group Code'
                            />
                        ) : (
                                <Input
                                    style={styles.loginBox}
                                    maxLength={6}
                                    onChangeText={(text) => {
                                        this.setState({
                                            jgCode: text,
                                        });
                                    }}
                                    leftIcon={
                                        <Icon
                                            name='code-commit'
                                            size={RFValue(35)}
                                            color='#fabf10'
                                            type="font-awesome-5"
                                        />
                                    }
                                />
                            )
                        }
                        <View style={{ alignItems: 'center' }}>

                            <TouchableOpacity
                                style={styles.registerButton}
                                onPress={() => {
                                    this.state.jgCode.length !== 6 ? (
                                        Alert.alert('Enter a Valid Group Code')
                                    ) : (
                                            this.joinGroup(this.state.jgCode),
                                            this.setState({
                                                isGroupModal: false
                                            })
                                        )
                                }

                                }
                            >
                                <Text style={styles.registerButtonText}>JOIN GROUP</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.signupView, { marginTop: RFValue(10) }]}>
                            <Text style={styles.signupText}> ADD GROUP </Text>
                        </View>
                        <Text style={styles.label}>Group Name</Text>
                        <Input
                            style={styles.loginBox}
                            value={this.state.gName}
                            placeholder={"Name"}
                            onChangeText={(text) => {
                                this.setState({
                                    gName: text,
                                });
                            }}
                            leftIcon={
                                <Icon
                                    name='id-badge'
                                    size={RFValue(35)}
                                    color='#fabf10'
                                    type="font-awesome-5"
                                />
                            }
                        />

                        <Text style={styles.label}>About Group</Text>
                        <Input
                            style={styles.loginBox}
                            value={this.state.gAbout}
                            placeholder={"About"}
                            onChangeText={(text) => {
                                this.setState({
                                    gAbout: text,
                                });
                            }}
                            leftIcon={
                                <Icon
                                    name='id-badge'
                                    size={RFValue(35)}
                                    color='#fabf10'
                                    type="font-awesome-5"
                                />
                            }
                        />

                    </View>

                    <View style={{ flex: 0.2, alignItems: 'center' }}>
                        <TouchableOpacity
                            style={styles.registerButton}
                            onPress={() => {
                                Alert.alert('GROUP ADDED ')
                                this.addGrope(this.state.gName, this.state.gAbout)
                                this.setState({
                                    isGroupModal: false
                                })

                            }

                            }
                        >
                            <Text style={styles.registerButtonText}>ADD GROUP</Text>
                        </TouchableOpacity>
                        <Text
                            style={styles.cancelButtonText}
                            onPress={() => {
                                this.setState({ isGroupModal: false });

                            }}
                        >
                            Cancel</Text>
                    </View>
                </ScrollView>
            </Modal >
        );
    }

    keyExtractor = (index) => index.toString()

    renderItem = ({ item, i }) => {
        return (
            <ListItem
                key={i}
                title={<TouchableOpacity
                    onPress={() => {
                        this.props.navigation.navigate("GroupChat", { "details": item })
                    }}
                >
                    <Text
                    style={{
                        fontSize:RFValue(20)
                    }}
                    >{item.group_name}</Text>
                </TouchableOpacity>}
                subtitle={<TouchableOpacity
                    onPress={() => {
                        this.props.navigation.navigate("GroupChat", { "details": item })
                    }}
                >
                    <Text>{item.group_about}</Text>
                </TouchableOpacity>}
                rightElement={
                    <TouchableOpacity style={styles.button}
                        onPress={() => {
                            this.props.navigation.navigate("GroupChat", { "details": item })
                        }}
                    >
                        <Icon name="comments" type="font-awesome-5" solid={true} size={RFValue(35)} />
                    </TouchableOpacity>
                }
                leftElement={
                    <TouchableOpacity style={styles.button}
                        onPress={() => {
                        }}
                    >
                        <Icon name="ellipsis-v" type="font-awesome-5" />
                    </TouchableOpacity>
                }
                bottomDivider
            />
        )
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <View style={{ flex: 1, }}>
                    <View style={{ flex: 0.1 }}>
                        <MyHeader title="INBO CHAT" navigation={this.props.navigation} />
                    </View>
                    <View style={{ flex: 0.9, marginTop: RFValue(30) }}>
                        <View>
                            {this.friendModal()}
                            {this.groupModal()}
                        </View>
                        <View>
                            {
                                this.state.groups.length === 0 ? (
                                    <Text>You are not in any Group</Text>
                                ) : (
                                        <FlatList
                                            keyExtractor={this.keyExtractor}
                                            data={this.state.groups}
                                            renderItem={this.renderItem}
                                        />
                                    )
                            }
                        </View>
                    </View>
                    <View style={{ marginTop: RFValue(30), justifyContent: 'flex-end' }}>
                        <TouchableOpacity style={styles.add1}
                            onPress={() => {
                                this.setState({
                                    isFriendModalVisible: true
                                })
                            }}>
                            <Icon
                                name='user-plus'
                                type="font-awesome-5"
                                size={RFValue(35)}
                                color='#fabf10'
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ justifyContent: 'flex-end' }}>
                        <TouchableOpacity style={styles.add1}
                            onPress={() => {
                                this.setState({
                                    isGroupModal: true
                                })
                            }}
                        >
                            <Icon
                                name='users'
                                type="font-awesome-5"
                                size={RFValue(35)}
                                color='#fabf10'
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
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