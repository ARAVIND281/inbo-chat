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
            userId: firebase.auth().currentUser.email,
            subject: "",
            description: "",
            IsBookRequestActive: "",
            docId: "",
            name: "",
            contact: ""
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
            subject: subject,
            description: description,
            FeedBack_id: randomRequestId,
            name: this.state.name,
            contact: this.state.contact,
            date: firebase.firestore.FieldValue.serverTimestamp(),
            state: 'unread'
        });

        return Alert.alert("FeedBack Send Successfully Your FeedBack ID is" + randomRequestId);
    };

    getUserDetails = () => {
        db.collection("users")
            .where("email_id", "==", this.state.userId)
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    var data = doc.data();
                    this.setState({
                        name: data.first_name,
                        contact: data.contact,
                        docId: doc.id,
                    });
                });
            });
    };

    componentDidMount() {
        this.getUserDetails();
    }

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
                            style={[styles.formTextInput, { height: RFValue(200) }]}
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
                                this.addFeedBack(
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
    formTextInput: {
        width: "75%",
        height: RFValue(45),
        borderWidth: 1,
        padding: 10,
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