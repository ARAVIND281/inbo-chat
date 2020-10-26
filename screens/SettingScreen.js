import React, { Component } from "react";
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
} from "react-native";
import { Input, Icon, Avatar } from "react-native-elements";
import MyHeader from "../components/MyHeader";
import db from "../config";
import firebase from "firebase";
import { RFValue } from "react-native-responsive-fontsize";
import * as ImagePicker from "expo-image-picker";

export default class SettingScreen extends Component {
    constructor() {
        super();
        this.state = {
            firstName: "",
            lastName: "",
            about: "",
            contact: "",
            docId: "",
            isModalVisible: false,
            email: firebase.auth().currentUser.email,
            isfirstNameModalVisible: false,
            islastNameModal: false,
            iscontactModalVisible: false,
            isaboutModal: false,
            image: '#',
            name: "",
            docId: "",
            Refcontact: '',
        };
    }

    checkNumber = () => {
        db.collection("users")
            .where("contact", "==", this.state.contact)
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    var data = doc.data();
                    this.setState({
                        Refcontact: data.contact,
                    });
                });
            });
        if (this.state.contact !== this.state.Refcontact) {
            this.updateUserDetails();
        } else if (this.state.contact === this.state.Refcontact) {
            Alert.alert('This contact is already registered Please Logout and Login')
        }
    }

    selectPicture = async () => {
        const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!cancelled) {
            this.uploadImage(uri, this.state.email);
        }
    };

    uploadImage = async (uri, imageName) => {
        var response = await fetch(uri);
        var blob = await response.blob();

        var ref = firebase
            .storage()
            .ref()
            .child("user_profiles/" + imageName);

        return ref.put(blob).then((response) => {
            this.fetchImage(imageName);
        });
    };

    fetchImage = (imageName) => {
        var storageRef = firebase
            .storage()
            .ref()
            .child("user_profiles/" + imageName);

        storageRef
            .getDownloadURL()
            .then((url) => {
                this.setState({ image: url });
            })
            .catch((error) => {
                this.setState({ image: "#" });
            });
    };

    getUserProfile() {
        db.collection("users")
            .where("email_id", "==", this.state.email)
            .onSnapshot((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    this.setState({
                        name: doc.data().first_name + " " + doc.data().last_name,
                        docId: doc.id,
                        image: doc.data().image,
                    });
                });
            });
    }

    getUserDetails = () => {
        db.collection("users")
            .where("email_id", "==", this.state.email)
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
                    });
                });
            });
    };

    updateUserDetails = () => {
        db.collection("users").doc(this.state.docId).update({
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            about: this.state.about,
            contact: this.state.contact,
        });

        Alert.alert("Profile Updated Successfully");
    };

    showModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.isModalVisible}
            >
                <ScrollView style={styles.scrollview}>
                    <View style={styles.formContainer}>
                        <View
                            style={{
                                flex: 0.66,
                            }}
                        >
                            <Text style={styles.label}>First Name </Text>
                            <Input
                                style={styles.loginBox}
                                value={this.state.firstName}
                                placeholder={"First Name"}
                                onChangeText={(text) => {
                                    this.setState({
                                        firstName: text,
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

                            <Text style={styles.label}>Last Name </Text>
                            <Input
                                style={styles.loginBox}
                                placeholder={"Last Name"}
                                value={this.state.lastName}
                                onChangeText={(text) => {
                                    this.setState({
                                        lastName: text,
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

                            <Text style={styles.label}>Contact </Text>
                            {this.state.contact.length !== 10 ? (
                                <Input
                                    style={styles.loginBox}
                                    placeholder={"Contact"}
                                    maxLength={10}
                                    keyboardType={"numeric"}
                                    onChangeText={(text) => {
                                        this.setState({
                                            contact: text,
                                        });
                                    }}
                                    value={this.state.contact}
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
                                                contact: text,
                                            });
                                        }}
                                        value={this.state.contact}
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

                            <Text style={styles.label}>about </Text>
                            <Input
                                style={styles.loginBox}
                                placeholder={"About"}
                                multiline={true}
                                value={this.state.about}
                                onChangeText={(text) => {
                                    this.setState({
                                        about: text,
                                    });
                                }}
                                leftIcon={
                                    <Icon
                                        name='address-card'
                                        size={RFValue(35)}
                                        color='#fabf10'
                                        type="font-awesome-5"
                                    />
                                }
                            />
                        </View>
                        <View style={styles.buttonView1}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    this.checkNumber();
                                    this.setState({ isModalVisible: false });
                                }}
                            >
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                        <Text
                            style={styles.cancelButtonText}
                            onPress={() => {
                                this.setState({ isModalVisible: false });
                            }}
                        >Cancel</Text>
                    </View>
                </ScrollView>
            </Modal >
        );
    }

    showfirstNameModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.isfirstNameModalVisible}
            >
                <ScrollView style={styles.scrollview}>
                    <View style={styles.formContainer}>
                        <View>
                            <Text style={styles.label}>First Name </Text>
                            <Input
                                style={styles.loginBox}
                                placeholder={"First Name"}
                                value={this.state.firstName}
                                onChangeText={(text) => {
                                    this.setState({
                                        firstName: text,
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
                        <View style={styles.buttonView1}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    this.updateUserDetails();
                                    this.setState({ isfirstNameModalVisible: false });
                                }}
                            >
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                        <Text
                            style={styles.cancelButtonText}
                            onPress={() => {
                                this.setState({ isfirstNameModalVisible: false });
                            }}
                        >Cancel</Text>
                    </View>
                </ScrollView>
            </Modal >
        );
    }

    showlastNameModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.islastNameModal}
            >
                <ScrollView style={styles.scrollview}>
                    <View style={styles.formContainer}>
                        <View>
                            <Text style={styles.label}>Last Name </Text>
                            <Input
                                style={styles.loginBox}
                                placeholder={"Last Name"}
                                value={this.state.lastName}
                                onChangeText={(text) => {
                                    this.setState({
                                        lastName: text,
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
                        <View style={styles.buttonView1}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    this.updateUserDetails();
                                    this.setState({ islastNameModal: false });
                                }}
                            >
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                        <Text
                            style={styles.cancelButtonText}
                            onPress={() => {
                                this.setState({ islastNameModal: false });
                            }}
                        >Cancel</Text>
                    </View>
                </ScrollView>
            </Modal >
        );
    }

    showcontactModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.iscontactModalVisible}
            >
                <ScrollView style={styles.scrollview}>
                    <View style={styles.formContainer}>
                        <View>
                            <Text style={styles.label}>Contact </Text>
                            {this.state.contact.length !== 10 ? (
                                <Input
                                    style={styles.loginBox}
                                    placeholder={"Contact"}
                                    maxLength={10}
                                    keyboardType={"numeric"}
                                    onChangeText={(text) => {
                                        this.setState({
                                            contact: text,
                                        });
                                    }}
                                    value={this.state.contact}
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
                                                contact: text,
                                            });
                                        }}
                                        value={this.state.contact}
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
                        <View style={styles.buttonView1}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    this.state.contact.length !== 10 ? (
                                        Alert.alert('Enter a Valid Phone Number')
                                    ) : (
                                            this.checkNumber(),
                                            this.setState({ iscontactModalVisible: false })
                                        )
                                }}
                            >
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                        <Text
                            style={styles.cancelButtonText}
                            onPress={() => {
                                this.setState({ iscontactModalVisible: false });
                            }}
                        >Cancel</Text>
                    </View>
                </ScrollView>
            </Modal >
        );
    }

    showaboutModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.isaboutModal}
            >
                <ScrollView style={styles.scrollview}>
                    <View style={styles.formContainer}>
                        <View>
                            <Text style={styles.label}>About</Text>
                            <Input
                                style={[styles.loginBox, { height: RFValue(200) }]}
                                placeholder={"About"}
                                multiline={true}
                                value={this.state.about}
                                onChangeText={(text) => {
                                    this.setState({
                                        about: text,
                                    });
                                }}
                                leftIcon={
                                    <Icon
                                        name='address-card'
                                        size={RFValue(35)}
                                        color='#fabf10'
                                        type="font-awesome-5"
                                    />
                                }
                            />

                        </View>
                        <View style={styles.buttonView1}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    this.updateUserDetails();
                                    this.setState({ isaboutModal: false });
                                }}
                            >
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                        <Text
                            style={styles.cancelButtonText}
                            onPress={() => {
                                this.setState({ isaboutModal: false });
                            }}
                        >Cancel</Text>
                    </View>
                </ScrollView>
            </Modal >
        );
    }

    componentDidMount() {
        this.getUserDetails();
        this.fetchImage(this.state.email);
        this.getUserProfile();
    }

    render() {
        return (
            <View style={{ flex: 1.12, backgroundColor: '#ffefff' }}>
                <ScrollView>

                    <View style={{ flex: 0.12 }}>
                        <MyHeader title="Profile" navigation={this.props.navigation} />
                    </View>
                    {this.showModal()}
                    {this.showfirstNameModal()}
                    {this.showlastNameModal()}
                    {this.showcontactModal()}
                    {this.showaboutModal()}
                    <View style={{ flex: 0.35 }}>
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
                                title={this.state.firstName}
                                showEditButton
                            />


                            <View style={{ marginTop: -30, alignItems: 'flex-end', marginLeft: RFValue(133) }}>
                                <Icon name='camera-retro' type='font-awesome-5' color="#fabf10" solid={true} />
                            </View>

                            <Text
                                style={{
                                    fontWeight: "300",
                                    fontSize: RFValue(20),
                                    color: "#000",
                                    padding: RFValue(10),
                                }}
                            >
                                {this.state.name}
                            </Text>
                        </View>
                    </View>


                    <View style={styles.formContainer}>
                        <View
                            style={{
                                flex: 0.65,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        isModalVisible: true
                                    })
                                }}
                            >
                                <View style={{ alignItems: 'flex-end', marginRight: RFValue(65) }}>
                                    <Text style={{ color: "#0000ff" }}>EDIT ALL</Text>
                                </View>
                                <View style={{ marginTop: -26, alignItems: 'flex-end', marginRight: RFValue(30) }}>
                                    <Icon name='user-edit' type='font-awesome-5' color="#0000ff" solid={true} />
                                </View>
                            </TouchableOpacity>

                            <Text style={styles.label}>First Name </Text>
                            <Text style={styles.label1}>{this.state.firstName} </Text>
                            <View style={{ marginTop: -30, alignItems: 'flex-end', marginRight: RFValue(30) }}>
                                <Icon name='edit' type='font-awesome-5' color="#141561"
                                    onPress={() => {
                                        this.setState({
                                            isfirstNameModalVisible: true
                                        })
                                    }}
                                />
                            </View>
                            <Text style={styles.label}>Last Name </Text>
                            <Text style={styles.label1}>{this.state.lastName}</Text>
                            <View style={{ marginTop: -30, alignItems: 'flex-end', marginRight: RFValue(30) }}>
                                <Icon name='edit' type='font-awesome-5' color="#141561"
                                    onPress={() => {
                                        this.setState({
                                            islastNameModal: true
                                        })
                                    }}
                                />
                            </View>

                            <Text style={styles.label}>Contact </Text>
                            <Text style={styles.label1}>{this.state.contact}</Text>
                            <View style={{ marginTop: -30, alignItems: 'flex-end', marginRight: RFValue(30) }}>
                                <Icon name='edit' type='font-awesome-5' color="#141561"
                                    onPress={() => {
                                        this.setState({
                                            iscontactModalVisible: true
                                        })
                                    }}
                                />
                            </View>

                            <Text style={styles.label}>about </Text>
                            <Text style={styles.label1}>{this.state.about}</Text>
                            <View style={{ marginTop: -30, alignItems: 'flex-end', marginRight: RFValue(30) }}>
                                <Icon name='edit' type='font-awesome-5' color="#141561"
                                    onPress={() => {
                                        this.setState({
                                            isaboutModal: true
                                        })
                                    }}
                                />
                            </View>

                            <Text style={styles.label}>Email </Text>
                            <Text style={styles.label1}>{this.state.email}</Text>
                            <View style={{ marginTop: -30, alignItems: 'flex-end', marginRight: RFValue(30) }}>
                                <Icon name='edit' type='font-awesome-5' color="#141561"
                                    onPress={() => {
                                        Alert.alert("You can't edit Email ID")
                                    }}
                                />
                            </View>
                            <View style={{ marginTop: 50 }}>
                            </View>
                        </View>
                    </View>
                </ScrollView>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#6fc0b8"
    },
    formContainer: {
        flex: 0.88,
        justifyContent: 'center',
    },
    label: {
        fontSize: RFValue(15),
        color: "#717D7E",
        fontWeight: 'bold',
        padding: RFValue(10),
        marginLeft: RFValue(20)
    },
    label1: {
        fontSize: RFValue(18),
        color: "#a901ff",
        fontWeight: 'bold',
        marginLeft: RFValue(50)
    },
    button: {
        width: "75%",
        height: RFValue(60),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: RFValue(50),
        backgroundColor: "#32867d",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 16,
        marginTop: RFValue(35),
    },
    buttonView: {
        flex: 0.22,
        alignItems: "center",
        marginTop: RFValue(150),
    },
    buttonView1: {
        flex: 0.22,
        alignItems: "center",
        marginTop: RFValue(50),
    },
    buttonText: {
        fontSize: RFValue(23),
        fontWeight: "bold",
        color: "#fff",
    },
    cancelButtonText: {
        fontSize: RFValue(20),
        fontWeight: 'bold',
        color: "#32867d",
        marginTop: RFValue(10),
        textAlign: 'center'
    },
    scrollview: {
        flex: 1,
        backgroundColor: "#fff"
    },
    firstNameModal: {
        flex: 0.5,
        height: 150
    },
    logo: {
        justifyContent: "center",
        alignItems: "center",
        padding: RFValue(10),
        height: RFValue(280)
    },
    loginBox: {
        width: "80%",
        height: RFValue(50),
        borderWidth: 1.5,
        borderColor: "#ffffff",
        fontSize: RFValue(20),
        paddingLeft: RFValue(10),
    },
});