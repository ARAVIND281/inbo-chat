import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    Modal,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import { Icon, Input } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";

export default class WelcomeScreen extends Component {
    constructor() {
        super();
        this.state = {
            emailId: "",
            password: "",
            firstName: "INBO",
            lastName: "",
            about: "INBO-CHAT-USER",
            contact: "",
            confirmPassword: "",
            isModalVisible: "false",
            Refcontact: ''
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
            this.userSignUp(
                this.state.emailId,
                this.state.password,
                this.state.confirmPassword
            )
        } else if (this.state.contact === this.state.Refcontact) {
            Alert.alert('This contact is already registered Please Login')
        }
    }

    userSignUp = (emailId, password, confirmPassword) => {
        if (password !== confirmPassword) {
            return Alert.alert("password doesn't match\nCheck your password.");
        } else {
            firebase
                .auth()
                .createUserWithEmailAndPassword(emailId, password)
                .then(() => {
                    db.collection("users").add({
                        first_name: this.state.firstName,
                        last_name: this.state.lastName,
                        contact: this.state.contact,
                        email_id: this.state.emailId,
                        about: this.state.about,
                        imageurl: 'https://firebasestorage.googleapis.com/v0/b/inbo-chat-a81c7.appspot.com/o/user_profiles%2F0c3b3adb1a7530892e55ef36d3be6cb8.png?alt=media&token=7818f4b2-e6cf-4342-8666-424c4636a430',
                    });
                    return Alert.alert("User Added Successfully", "", [
                        {
                            text: "OK",
                            onPress: () => this.setState({ isModalVisible: false }),
                        },
                    ]);
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    return Alert.alert(errorMessage);
                });
        }
    };

    userLogin = (emailId, password) => {
        firebase
            .auth()
            .signInWithEmailAndPassword(emailId, password)
            .then(() => {
                this.props.navigation.navigate("Chat");
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                return Alert.alert(errorMessage);

            });
    };

    showModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.isModalVisible}
            >
                <ScrollView style={styles.scrollview}>
                    <View style={styles.signupView}>
                        <Text style={styles.signupText}> SIGN UP </Text>
                    </View>
                    <View style={{ flex: 0.95 }}>
                        <Text style={styles.label}>First Name </Text>
                        <Input
                            style={styles.loginBox}
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


                        <Text style={styles.label}> About </Text>
                        <Input
                            style={styles.loginBox}
                            placeholder={"About"}
                            multiline={true}
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

                        <Text style={styles.label}>Email </Text>
                        <Input
                            style={styles.loginBox}

                            placeholder={"Email"}
                            keyboardType={"email-address"}
                            onChangeText={(text) => {
                                this.setState({
                                    emailId: text.toLowerCase().trim(),
                                });
                            }}
                            value={this.state.emailId}
                            leftIcon={
                                <Icon
                                    name='envelope-open-text'
                                    size={RFValue(35)}
                                    color='#fabf10'
                                    type="font-awesome-5"
                                />
                            }
                        />

                        <Text style={styles.label}> Password </Text>
                        <Input
                            style={styles.loginBox}
                            placeholder={"Password"}
                            secureTextEntry={true}
                            onChangeText={(text) => {
                                this.setState({
                                    password: text,
                                });
                            }}
                            leftIcon={
                                <Icon
                                    name='user-lock'
                                    size={RFValue(35)}
                                    color='#fabf10'
                                    type="font-awesome-5"
                                />
                            }
                        />

                        <Text style={styles.label}>Confirm Password</Text>
                        <Input
                            style={styles.loginBox}
                            placeholder={"Confrim Password"}
                            secureTextEntry={true}
                            onChangeText={(text) => {
                                this.setState({
                                    confirmPassword: text,
                                });
                            }}
                            leftIcon={
                                <Icon
                                    name='key'
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
                                this.state.contact.length !== 10 ? (
                                    Alert.alert('Enter a Valid Phone Number')
                                ) : (
                                        /*this.userSignUp(
                                            this.state.emailId,
                                            this.state.password,
                                            this.state.confirmPassword
                                        )*/
                                        this.checkNumber()
                                    )
                            }

                            }
                        >
                            <Text style={styles.registerButtonText}>Register</Text>
                        </TouchableOpacity>
                        <Text
                            style={styles.cancelButtonText}
                            onPress={() => {
                                this.setState({ isModalVisible: false });
                            }}
                        >
                            Cancel</Text>
                    </View>
                </ScrollView>
            </Modal>
        );
    }
    render() {
        return (
            <View style={styles.container}>
                {this.showModal()}
                <ScrollView>
                    <View
                        style={{ flex: 0.25 }}
                    >
                        <View style={{ flex: 0.15 }} />
                        <View style={styles.logo}>
                            <Image
                                source={require('../assets/logo.png')}
                                style={styles.santaImage}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 0.45, marginTop: 20 }}>

                        <View style={styles.TextInput}>
                            <Input
                                style={styles.loginBox}
                                placeholder="abc@example.com"
                                placeholderTextColor="#fabf10"
                                leftIcon={
                                    <Icon
                                        name='envelope-open-text'
                                        size={RFValue(35)}
                                        color='black'
                                        type="font-awesome-5"
                                    />
                                }
                                keyboardType="email-address"
                                onChangeText={(text) => {
                                    this.setState({
                                        emailId: text,
                                    });
                                }}

                            />
                            <Input
                                style={[styles.loginBox, { marginTop: RFValue(15) }]}
                                secureTextEntry={true}
                                placeholder="Enter Password"
                                placeholderTextColor="#fabf10"
                                leftIcon={
                                    <Icon
                                        name='user-lock'
                                        size={RFValue(30)}
                                        color='black'
                                        type="font-awesome-5"
                                    />
                                }
                                onChangeText={(text) => {
                                    this.setState({
                                        password: text,
                                    });
                                }}
                            />
                        </View>
                        <View style={{ flex: 0.5, alignItems: "center", marginTop: 20 }}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    this.userLogin(this.state.emailId, this.state.password);
                                }}
                            >
                                <Text style={styles.buttonText}>Login</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => this.setState({ isModalVisible: true })}
                            >
                                <Text style={styles.buttonText}>SignUp</Text>
                            </TouchableOpacity>
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
        backgroundColor: "#a901ff",
    },
    loginBox: {
        width: "80%",
        height: RFValue(50),
        borderWidth: 1.5,
        borderColor: "#ffffff",
        fontSize: RFValue(20),
        paddingLeft: RFValue(10),
    },
    button: {
        width: "80%",
        height: RFValue(50),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: RFValue(25),
        backgroundColor: "#ffff",
        shadowColor: "#000",
        marginBottom: RFValue(10),
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10.32,
        elevation: 16,
    },
    buttonText: {
        color: "#32867d",
        fontWeight: "200",
        fontSize: RFValue(20),
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
    logo: {
        justifyContent: "center",
        alignItems: "center",
        padding: RFValue(10),
        height: RFValue(280)
    },
    santaImage: {
        width: "70%",
        height: "100%",
        resizeMode: "stretch"
    },
    TextInput: {
        flex: 0.5,
        alignItems: "center",
        justifyContent: "center"
    }
});