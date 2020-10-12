import React, { Component } from "react";
import {
    View,
    Text,
    TextInput,
    Image,
    Modal,
    KeyboardAvoidingView,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
} from "react-native";

import db from "../config";
import firebase from "firebase";

import { Icon } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";

export default class WelcomeScreen extends Component {
    constructor() {
        super();
        this.state = {
            emailId: "",
            password: "",
            firstName: "",
            lastName: "",
            about: "",
            contact_no: "",
            confirmPassword: "",
            isModalVisible: "false",
        };
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
                        contact_no: this.state.contact_No,
                        email_id: this.state.emailId,
                        about:this.state.about

                    });
                    return Alert.alert("User Added Successfully", "", [
                        {
                            text: "OK",
                            onPress: () => this.setState({ isModalVisible: false }),
                        },
                    ]);
                })
                .catch((error) => {
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
                this.props.navigation.navigate("Contacts");
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
                        <TextInput
                            style={styles.formInput}
                            placeholder={"First Name"}
                            onChangeText={(text) => {
                                this.setState({
                                    firstName: text,
                                });
                            }}
                        />

                        <Text style={styles.label}>Last Name </Text>
                        <TextInput
                            style={styles.formInput}
                            placeholder={"Last Name"}
                            onChangeText={(text) => {
                                this.setState({
                                    lastName: text,
                                });
                            }}
                        />

                        <Text style={styles.label}>Contact No </Text>
                        <TextInput
                            style={styles.formInput}
                            placeholder={"Contact No"}
                            keyboardType={"numeric"}
                            onChangeText={(text) => {
                                this.setState({
                                    contact_no: text,
                                });
                            }}
                        />

                        <Text style={styles.label}>Email </Text>
                        <TextInput
                            style={styles.formInput}
                            placeholder={"Email"}
                            keyboardType={"email-address"}
                            onChangeText={(text) => {
                                this.setState({
                                    emailId: text,
                                });
                            }}
                        />

                        <Text style={styles.label}>About </Text>
                        <TextInput
                            style={styles.formInput}
                            placeholder={"About"}
                            onChangeText={(text) => {
                                this.setState({
                                    about: text,
                                });
                            }}
                        />

                        <Text style={styles.label}> Password </Text>
                        <TextInput
                            style={styles.formInput}
                            placeholder={"Password"}
                            secureTextEntry={true}
                            onChangeText={(text) => {
                                this.setState({
                                    password: text,
                                });
                            }}
                        />

                        <Text style={styles.label}>Confirm Password</Text>
                        <TextInput
                            style={styles.formInput}
                            placeholder={"Confrim Password"}
                            secureTextEntry={true}
                            onChangeText={(text) => {
                                this.setState({
                                    confirmPassword: text,
                                });
                            }}
                        />
                    </View>

                    <View style={{ flex: 0.2, alignItems: 'center' }}>
                        <TouchableOpacity
                            style={styles.registerButton}
                            onPress={() =>
                                this.userSignUp(
                                    this.state.emailId,
                                    this.state.password,
                                    this.state.confirmPassword
                                )
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
                            Cancel
              </Text>
                    </View>
                </ScrollView>
            </Modal>
        );
    };
    render() {
        return (
            <View style={styles.container}>
                {this.showModal()}
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
                <View style={{ flex: 0.45, marginTop: RFValue(150) }}>

                    <View style={styles.TextInput}>
                        <TextInput
                            style={styles.loginBox}
                            placeholder="abc@example.com"
                            placeholderTextColor="gray"
                            keyboardType="email-address"
                            onChangeText={(text) => {
                                this.setState({
                                    emailId: text,
                                });
                            }}
                        />
                        <TextInput
                            style={[styles.loginBox, { marginTop: RFValue(15) }]}
                            secureTextEntry={true}
                            placeholder="Enter Password"
                            placeholderTextColor="gray"
                            onChangeText={(text) => {
                                this.setState({
                                    password: text,
                                });
                            }}
                        />
                    </View>
                    <View style={{ flex: 0.5, alignItems: "center", marginTop: 30 }}>
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
        fontSize: RFValue(13),
        color: "#717D7E",
        fontWeight: 'bold',
        paddingLeft: RFValue(10),
        marginLeft: RFValue(20)
    },
    formInput: {
        width: "90%",
        height: RFValue(45),
        padding: RFValue(10),
        borderWidth: 1,
        borderRadius: 2,
        borderColor: "grey",
        paddingBottom: RFValue(10),
        marginLeft: RFValue(20),
        marginBottom: RFValue(14)
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
    },
    bookImage: {
        width: "100%",
        height: RFValue(220)
    }
});