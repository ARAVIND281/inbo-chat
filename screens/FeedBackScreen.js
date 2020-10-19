import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import { RFValue } from "react-native-responsive-fontsize";
import { Input } from "react-native-elements";

import MyHeader from "../components/MyHeader";

export default class FeedBackScreen extends Component {
    constructor() {
        super();
        this.state = {
            userId: "firebase.auth().currentUser.email",
            subject: "",
            description: "",
            IsBookRequestActive: "",
            docId: "",
        };
    }

    createUniqueId() {
        return Math.random().toString(36).substring(7);
    }

    addFeedBack = (subject, description) => {
        var userId = this.state.userId;
        var randomRequestId = this.createUniqueId();

        db.collection("FeedBack").add({
            user_id: userId,
            book_name: subject,
            reason_to_request: description,
            request_id: randomRequestId,
            date: firebase.firestore.FieldValue.serverTimestamp(),
        });

        return Alert.alert("FeedBack Send Successfully Your FeedBack ID is" + randomRequestId);
    };

    render() {

        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 0.1 }}>
                    <MyHeader title="FeedBack" navigation={this.props.navigation} />
                </View>
                <View style={{ flex: 0.9 }}>
                    <Input
                        style={styles.formTextInput}
                        label={"Subject"}
                        placeholder={"Subject"}
                        containerStyle={{ marginTop: RFValue(60) }}
                        onChangeText={(text) => this.setState({
                            subject: text
                        })}
                        value={this.state.subject}
                    />

                    <View style={{ alignItems: "center" }}>
                        <Input
                            style={styles.formTextInput}
                            containerStyle={{ marginTop: RFValue(30) }}
                            multiline
                            numberOfLines={8}
                            label={"Description"}
                            placeholder={"Description"}
                            onChangeText={(text) => {
                                this.setState({
                                    description: text,
                                });
                            }}
                            value={this.state.description}
                        />
                        <TouchableOpacity
                            style={[styles.button, { marginTop: RFValue(30) }]}
                            onPress={() => {
                                this.addRequest(
                                    this.state.subject,
                                    this.state.description
                                );
                            }}
                        >
                            <Text style={styles.requestbuttontxt}>Send FeedBack</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    keyBoardStyle: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    formTextInput: {
        width: "75%",
        height: RFValue(35),
        borderWidth: 1,
        padding: 10,
    },
    ImageView: {
        flex: 0.3,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20
    },
    imageStyle: {
        height: RFValue(200),
        width: RFValue(150),
        alignSelf: "center",
        borderWidth: 5,
        borderRadius: RFValue(10),
    },
    bookstatus: {
        flex: 0.4,
        alignItems: "center",

    },
    requestedsubject: {
        fontSize: RFValue(30),
        fontWeight: "500",
        padding: RFValue(10),
        fontWeight: "bold",
        alignItems: 'center',
        marginLeft: RFValue(60)
    },
    status: {
        fontSize: RFValue(20),
        marginTop: RFValue(30),
    },
    bookStatus: {
        fontSize: RFValue(30),
        fontWeight: "bold",
        marginTop: RFValue(10),
    },
    buttonView: {
        flex: 0.2,
        justifyContent: "center",
        alignItems: "center",
    },
    buttontxt: {
        fontSize: RFValue(18),
        fontWeight: "bold",
        color: "#fff",
    },
    touchableopacity: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10,
        width: "90%",
    },
    requestbuttontxt: {
        fontSize: RFValue(20),
        fontWeight: "bold",
        color: "#fff",
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
    },
});